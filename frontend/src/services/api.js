const BACKEND_URL = import.meta.env.VITE_API_URL || ''
const API_BASE = `${BACKEND_URL}/api`

export async function fetchItems(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`${API_BASE}/items?${qs}`)
  if (!res.ok) throw new Error('Failed to fetch items')
  return res.json()
}

export async function getItem(id) {
  const res = await fetch(`${API_BASE}/items/${id}`)
  if (!res.ok) throw new Error('Item not found')
  return res.json()
}

export async function uploadImage(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${API_BASE}/upload-image`, { method: 'POST', body: form })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Upload failed')
  }
  return res.json()
}

export async function createItem(data) {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create item')
  return res.json()
}

export async function searchItems(params) {
  const res = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}

export async function trayAdd(sessionId, itemId) {
  const res = await fetch(`${API_BASE}/tray/add?session_id=${sessionId}&item_id=${itemId}`, { method: 'POST' })
  return res.json()
}

export async function trayRemove(sessionId, itemId) {
  const res = await fetch(`${API_BASE}/tray/remove?session_id=${sessionId}&item_id=${itemId}`, { method: 'POST' })
  return res.json()
}

export async function getTray(sessionId) {
  const res = await fetch(`${API_BASE}/tray?session_id=${sessionId}`)
  return res.json()
}

export async function submitClaim(data) {
  const res = await fetch(`${API_BASE}/claim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      item_id: data.item_id,
      session_id: data.session_id,
      claimant_message: data.message,
      verification_answer: data.verification_answer || null,
    }),
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.detail || 'Failed to submit claim')
  }

  return result
}