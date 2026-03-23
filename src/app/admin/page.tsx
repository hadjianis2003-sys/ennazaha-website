'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './admin.module.css'

interface Project {
  id: string
  slug: string
  name_ar: string
  name_fr: string
  city_fr: string
  status: string
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  ready: '#16A34A',
  ongoing: '#D97706',
  coming_soon: '#2563EB',
}
const STATUS_LABELS: Record<string, string> = {
  ready: 'Ready',
  ongoing: 'Ongoing',
  coming_soon: 'Coming Soon',
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  const fetchProjects = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/projects')
    const data = await res.json()
    setProjects(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setToast(`Deleted "${name}"`)
      setTimeout(() => setToast(''), 3000)
      fetchProjects()
    }
  }

  return (
    <div className={styles.adminPage}>
      <div className={styles.header}>
        <h1>📋 ENNAZAHA Admin</h1>
        <Link href="/admin/new" className={styles.btnPrimary}>+ New Project</Link>
      </div>

      {loading ? (
        <p>Loading projects…</p>
      ) : projects.length === 0 ? (
        <div className={styles.empty}>
          <p>No projects yet. Click &ldquo;New Project&rdquo; to add your first one.</p>
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name (FR)</th>
              <th>Name (AR)</th>
              <th>City</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.name_fr}</strong></td>
                <td>{p.name_ar}</td>
                <td>{p.city_fr}</td>
                <td>
                  <span
                    className={styles.statusBadge}
                    style={{ background: STATUS_COLORS[p.status] || '#6b7280' }}
                  >
                    {STATUS_LABELS[p.status] || p.status}
                  </span>
                </td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/admin/${p.id}`} className={styles.btnSecondary}>✏️ Edit</Link>
                    <button
                      className={styles.btnDanger}
                      onClick={() => handleDelete(p.id, p.name_fr)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  )
}
