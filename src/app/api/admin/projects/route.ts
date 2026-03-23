import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

/** GET all projects (admin listing) */
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*, apartment_types(*)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

/** POST create a new project */
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { apartment_types: aptTypes, gallery_images: galleryImages, ...projectData } = body

  // Insert project
  const { data: project, error } = await supabaseAdmin
    .from('projects')
    .insert(projectData)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Insert apartment types if provided
  if (aptTypes && aptTypes.length > 0) {
    const rows = aptTypes.map((a: Record<string, unknown>) => ({ ...a, project_id: project.id }))
    const { error: aptErr } = await supabaseAdmin
      .from('apartment_types')
      .insert(rows)
    if (aptErr) return NextResponse.json({ error: aptErr.message }, { status: 500 })
  }

  // Insert gallery images if provided
  if (galleryImages && galleryImages.length > 0) {
    const imgRows = galleryImages.map((url: string, i: number) => ({
      project_id: project.id,
      image_url: url,
      sort_order: i,
    }))
    const { error: imgErr } = await supabaseAdmin.from('project_images').insert(imgRows)
    if (imgErr) return NextResponse.json({ error: imgErr.message }, { status: 500 })
  }

  return NextResponse.json(project, { status: 201 })
}
