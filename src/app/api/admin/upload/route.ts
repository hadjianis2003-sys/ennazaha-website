import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

/** POST — Upload a file to Supabase Storage bucket 'project-assets' */
export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const folder = (formData.get('folder') as string) || 'general'

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Create a unique filename
  const ext = file.name.split('.').pop()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `${folder}/${Date.now()}_${safeName}`

  const buffer = Buffer.from(await file.arrayBuffer())

  const { data, error } = await supabaseAdmin.storage
    .from('project-assets')
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get the public URL
  const { data: urlData } = supabaseAdmin.storage
    .from('project-assets')
    .getPublicUrl(data.path)

  return NextResponse.json({ url: urlData.publicUrl, path: data.path })
}
