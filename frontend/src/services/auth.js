const BACKEND_URL = import.meta.env.VITE_API_URL || ''
const API_BASE = `${BACKEND_URL}/auth`

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Invalid email or password')
  }
  return res.json()
}

export async function register(data) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Registration failed' }))
    throw new Error(err.detail || 'Registration failed')
  }
  return res.json()
}

export async function refreshToken(refresh_token) {
  const res = await fetch(`${API_BASE}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token }),
  })
  if (!res.ok) throw new Error('Token refresh failed')
  return res.json()
}

export async function getMe(accessToken) {
  const res = await fetch(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error('Failed to fetch user')
  return res.json()
}

export async function updateConsent(accessToken, emailConsent) {
  const res = await fetch(`${API_BASE}/consent?email_consent=${emailConsent}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error('Failed to update consent')
  return res.json()
}

export function storeTokens(accessToken, refreshToken) {
  localStorage.setItem('access_token', accessToken)
  localStorage.setItem('refresh_token', refreshToken)
}

export function getStoredAccessToken() {
  return localStorage.getItem('access_token')
}

export function getStoredRefreshToken() {
  return localStorage.getItem('refresh_token')
}

export function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('org_id')
  localStorage.removeItem('member_id')
  localStorage.removeItem('role')
}