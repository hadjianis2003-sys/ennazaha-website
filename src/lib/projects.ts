import { supabase } from './supabase'

/* ── Type definitions ──────────────────────────────────────── */

export interface ApartmentType {
  id: string
  project_id: string
  type_ar: string
  type_fr: string
  area_sqm: number
  status: 'available' | 'reserved' | 'sold'
  price_dzd: number
}

export interface ProjectImage {
  id: string
  project_id: string
  image_url: string
  sort_order: number
}

export interface Project {
  id: string
  slug: string
  name_ar: string
  name_fr: string
  about_ar: string
  about_fr: string
  city_ar: string
  city_fr: string
  address: string
  map_embed_url: string
  cover_image_url: string
  brochure_url: string
  status: 'coming_soon' | 'ongoing' | 'ready'
  price_from: number
  delivery_date: string
  created_at: string
  updated_at: string
  apartment_types?: ApartmentType[]
  project_images?: ProjectImage[]
}

/* ── Fetching functions ────────────────────────────────────── */

/** Get all projects (with apartment types) — for listing page */
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, apartment_types(*)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error.message)
    return []
  }
  return (data as Project[]) ?? []
}

/** Get a single project by slug — for detail page */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, apartment_types(*), project_images(*)') 
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching project:', error.message)
    return null
  }
  return data as Project
}

/** Get all project slugs — for generateStaticParams */
export async function getProjectSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('slug')

  if (error) {
    console.error('Error fetching slugs:', error.message)
    return []
  }
  return (data ?? []).map((p) => p.slug)
}
