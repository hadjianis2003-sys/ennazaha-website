import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

/** GET single project by id */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*, apartment_types(*), project_images(*)')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

/** PUT update project */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { apartment_types: aptTypes, project_images, ...projectData } = body

  // Update project
  const { data: project, error } = await supabaseAdmin
    .from('projects')
    .update(projectData)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Replace apartment types: delete all existing, insert new
  if (aptTypes) {
    await supabaseAdmin.from('apartment_types').delete().eq('project_id', id)
    if (aptTypes.length > 0) {
      const rows = aptTypes.map((a: Record<string, unknown>) => {
        const { id: _aptId, project_id: _pid, created_at: _ca, ...rest } = a as Record<string, unknown>
        return { ...rest, project_id: id }
      })
      const { error: aptErr } = await supabaseAdmin.from('apartment_types').insert(rows)
      if (aptErr) return NextResponse.json({ error: aptErr.message }, { status: 500 })
    }
  }

  return NextResponse.json(project)
}

/** DELETE project */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // Cascade will delete apartment_types and project_images
  const { error } = await supabaseAdmin.from('projects').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
