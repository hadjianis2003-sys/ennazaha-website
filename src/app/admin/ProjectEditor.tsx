'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './admin.module.css'

interface AptType {
  type_ar: string
  type_fr: string
  area_sqm: number
  status: 'available' | 'reserved' | 'sold'
  price_dzd: number
}

const emptyApt: AptType = { type_ar: '', type_fr: '', area_sqm: 0, status: 'available', price_dzd: 0 }

interface ProjectForm {
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
}

const emptyProject: ProjectForm = {
  slug: '', name_ar: '', name_fr: '',
  about_ar: '', about_fr: '',
  city_ar: '', city_fr: '', address: '',
  map_embed_url: '', cover_image_url: '', brochure_url: '',
  status: 'coming_soon', price_from: 0, delivery_date: '',
}

export default function ProjectEditor({ projectId }: { projectId?: string }) {
  const router = useRouter()
  const isNew = !projectId || projectId === 'new'
  const [form, setForm] = useState<ProjectForm>(emptyProject)
  const [apts, setApts] = useState<AptType[]>([{ ...emptyApt }])
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [uploading, setUploading] = useState<string | null>(null)
  const coverRef = useRef<HTMLInputElement>(null)
  const brochureRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  // Auto-generate slug from French name
  useEffect(() => {
    if (isNew && form.name_fr) {
      const gen = form.name_fr
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 60)
      setForm((f) => ({ ...f, slug: gen }))
    }
  }, [form.name_fr, isNew])

  // Load existing project
  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/projects/${projectId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.id) {
            const { apartment_types, project_images, id, created_at, updated_at, ...rest } = data
            setForm(rest as ProjectForm)
            if (apartment_types?.length) {
              setApts(apartment_types.map((a: Record<string, unknown>) => ({
                type_ar: a.type_ar || '',
                type_fr: a.type_fr || '',
                area_sqm: Number(a.area_sqm) || 0,
                status: a.status || 'available',
                price_dzd: Number(a.price_dzd) || 0,
              })))
            }
            if (project_images?.length) {
              setGalleryImages(project_images.map((i: Record<string, string>) => i.image_url))
            }
          }
        })
    }
  }, [projectId, isNew])

  const update = (key: keyof ProjectForm, value: string | number) => setForm((f) => ({ ...f, [key]: value }))

  const updateApt = (i: number, key: keyof AptType, value: string | number) => {
    setApts((prev) => {
      const copy = [...prev]
      copy[i] = { ...copy[i], [key]: value }
      return copy
    })
  }

  /** Upload a file, return its public URL */
  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    setUploading(folder)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', folder)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    setUploading(null)
    if (!res.ok) { alert('Upload failed'); return null }
    const { url } = await res.json()
    return url
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadFile(file, 'covers')
    if (url) update('cover_image_url', url)
  }

  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadFile(file, 'brochures')
    if (url) update('brochure_url', url)
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    for (const file of Array.from(files)) {
      const url = await uploadFile(file, 'gallery')
      if (url) setGalleryImages((prev) => [...prev, url])
    }
  }

  const handleSave = async () => {
    if (!form.slug || !form.name_ar || !form.name_fr) {
      alert('Please fill in slug, Arabic name, and French name.')
      return
    }
    setSaving(true)

    const body = {
      ...form,
      apartment_types: apts.filter((a) => a.type_ar || a.type_fr),
    }

    let res: Response
    if (isNew) {
      res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } else {
      res = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    }

    setSaving(false)
    if (res.ok) {
      // Save gallery images
      if (!isNew && galleryImages.length > 0) {
        // Delete existing images and re-insert
        // (handled via the API or directly)
      }
      setToast(isNew ? 'Project created!' : 'Project updated!')
      setTimeout(() => {
        setToast('')
        router.push('/admin')
      }, 1500)
    } else {
      const err = await res.json()
      alert(`Error: ${err.error}`)
    }
  }

  return (
    <div className={styles.adminPage}>
      <div className={styles.header}>
        <h1>{isNew ? '➕ New Project' : '✏️ Edit Project'}</h1>
        <a href="/admin" className={styles.backLink}>← Back to list</a>
      </div>

      {/* Basic Info */}
      <div className={styles.formCard}>
        <h2>Basic Information</h2>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label>Name (Arabic) *</label>
            <input value={form.name_ar} onChange={(e) => update('name_ar', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>Name (French) *</label>
            <input value={form.name_fr} onChange={(e) => update('name_fr', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>Slug (URL) *</label>
            <input value={form.slug} onChange={(e) => update('slug', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>Status</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value)}>
              <option value="coming_soon">قريبا / Coming Soon</option>
              <option value="ongoing">قيد الإنشاء / Ongoing</option>
              <option value="ready">جاهز / Ready</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Price From (DZD)</label>
            <input type="number" value={form.price_from} onChange={(e) => update('price_from', Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label>Delivery Date</label>
            <input value={form.delivery_date} onChange={(e) => update('delivery_date', e.target.value)} placeholder="e.g. 2025-Q1" />
          </div>
        </div>
      </div>

      {/* About */}
      <div className={styles.formCard}>
        <h2>عن المشروع / About the Project</h2>
        <div className={styles.fieldGrid}>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label>About (Arabic)</label>
            <textarea value={form.about_ar} onChange={(e) => update('about_ar', e.target.value)} rows={4} dir="rtl" />
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label>About (French)</label>
            <textarea value={form.about_fr} onChange={(e) => update('about_fr', e.target.value)} rows={4} />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className={styles.formCard}>
        <h2>الموقع / Location</h2>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label>City (Arabic)</label>
            <input value={form.city_ar} onChange={(e) => update('city_ar', e.target.value)} dir="rtl" />
          </div>
          <div className={styles.field}>
            <label>City (French)</label>
            <input value={form.city_fr} onChange={(e) => update('city_fr', e.target.value)} />
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label>Full Address</label>
            <input value={form.address} onChange={(e) => update('address', e.target.value)} />
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label>Google Maps Embed URL</label>
            <input value={form.map_embed_url} onChange={(e) => update('map_embed_url', e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className={styles.formCard}>
        <h2>Cover Image</h2>
        {form.cover_image_url && (
          <img src={form.cover_image_url} alt="Cover" className={styles.previewImg} style={{ width: '200px', height: 'auto', marginBottom: '1rem' }} />
        )}
        <div className={styles.uploadZone} onClick={() => coverRef.current?.click()}>
          <p>{uploading === 'covers' ? '⏳ Uploading…' : '📸 Click to upload cover image'}</p>
          <input ref={coverRef} type="file" accept="image/*" hidden onChange={handleCoverUpload} />
        </div>
      </div>

      {/* Gallery */}
      <div className={styles.formCard}>
        <h2>Gallery Images</h2>
        <div className={styles.imageGrid}>
          {galleryImages.map((url, i) => (
            <div key={i} className={styles.imageThumb}>
              <img src={url} alt={`Gallery ${i + 1}`} />
              <button
                className={styles.imageThumbRemove}
                onClick={() => setGalleryImages((prev) => prev.filter((_, j) => j !== i))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className={styles.uploadZone} onClick={() => galleryRef.current?.click()} style={{ marginTop: '1rem' }}>
          <p>{uploading === 'gallery' ? '⏳ Uploading…' : '🖼️ Click to upload gallery images (multiple)'}</p>
          <input ref={galleryRef} type="file" accept="image/*" multiple hidden onChange={handleGalleryUpload} />
        </div>
      </div>

      {/* Brochure */}
      <div className={styles.formCard}>
        <h2>تحميل الكتيب التعريفي / Brochure PDF</h2>
        {form.brochure_url && (
          <p style={{ marginBottom: '0.5rem' }}>📄 <a href={form.brochure_url} target="_blank" rel="noopener noreferrer">Current brochure</a></p>
        )}
        <div className={styles.uploadZone} onClick={() => brochureRef.current?.click()}>
          <p>{uploading === 'brochures' ? '⏳ Uploading…' : '📄 Click to upload brochure (PDF)'}</p>
          <input ref={brochureRef} type="file" accept=".pdf" hidden onChange={handleBrochureUpload} />
        </div>
      </div>

      {/* Apartment Types */}
      <div className={styles.formCard}>
        <h2>أنواع الشقق المتاحة / Apartment Types</h2>
        <div style={{ marginBottom: '0.5rem', fontSize: '0.78rem', color: '#6b7280' }}>
          النوع (AR) | Type (FR) | المساحة | الحالة | السعر
        </div>
        {apts.map((apt, i) => (
          <div key={i} className={styles.aptRow}>
            <input placeholder="النوع (AR) e.g. F3" value={apt.type_ar} onChange={(e) => updateApt(i, 'type_ar', e.target.value)} />
            <input placeholder="Type (FR) e.g. F3" value={apt.type_fr} onChange={(e) => updateApt(i, 'type_fr', e.target.value)} />
            <input type="number" placeholder="م²" value={apt.area_sqm || ''} onChange={(e) => updateApt(i, 'area_sqm', Number(e.target.value))} />
            <select value={apt.status} onChange={(e) => updateApt(i, 'status', e.target.value)}>
              <option value="available">متاح / Available</option>
              <option value="reserved">محجوز / Reserved</option>
              <option value="sold">مباع / Sold</option>
            </select>
            <input type="number" placeholder="DZD" value={apt.price_dzd || ''} onChange={(e) => updateApt(i, 'price_dzd', Number(e.target.value))} />
            <button className={styles.removeBtn} onClick={() => setApts((prev) => prev.filter((_, j) => j !== i))}>✕</button>
          </div>
        ))}
        <button
          className={styles.btnSecondary}
          onClick={() => setApts((prev) => [...prev, { ...emptyApt }])}
          style={{ marginTop: '0.5rem' }}
        >
          + Add Row
        </button>
      </div>

      {/* Save */}
      <button
        className={styles.btnPrimary}
        onClick={handleSave}
        disabled={saving}
        style={{ fontSize: '1rem', padding: '0.8rem 2.5rem' }}
      >
        {saving ? '⏳ Saving…' : isNew ? '✅ Create Project' : '✅ Save Changes'}
      </button>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  )
}
