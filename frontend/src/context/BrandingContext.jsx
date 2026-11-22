import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const DEFAULT_BRANDING = {
  name: '4O4_Found',
  tagline: 'Lost & Found',
  logo: null,
  favicon: null,
  colors: {
    primary: '#4f46e5',
    primaryLight: '#6366f1',
    secondary: '#6366f1',
    accent: '#7c3aed',
    bg: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    textMuted: '#64748b',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    border: '#e2e8f0',
  },
  fontFamily: "'Inter', system-ui, sans-serif",
  borderRadius: '0.5rem',
  theme: 'default',
  mapProvider: 'openstreetmap',
  mapTileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  isOrg: false,
  customCss: null,
}

const BrandingContext = createContext(null)

export function BrandingProvider({ children }) {
  const [branding, setBranding] = useState(DEFAULT_BRANDING)

  const applyBranding = useCallback((branding) => {
    const root = document.documentElement
    const c = branding.colors || DEFAULT_BRANDING.colors
    Object.entries(c).forEach(([key, val]) => {
      root.style.setProperty(`--brand-${key}`, val)
    })
    if (branding.fontFamily) {
      root.style.setProperty('--brand-font-family', branding.fontFamily)
    }
    if (branding.borderRadius) {
      root.style.setProperty('--brand-radius', branding.borderRadius)
    }
    if (branding.name) {
      document.title = `${branding.name} — Lost & Found`
    }
    if (branding.customCss) {
      let el = document.getElementById('brand-custom-css')
      if (!el) {
        el = document.createElement('style')
        el.id = 'brand-custom-css'
        document.head.appendChild(el)
      }
      el.textContent = branding.customCss
    } else {
      const el = document.getElementById('brand-custom-css')
      if (el) el.remove()
    }
    if (branding.favicon) {
      let link = document.querySelector('link[rel="icon"]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = branding.favicon
    }
  }, [])

  const loadOrgBranding = useCallback(async (token) => {
    try {
      const res = await fetch('/api/v1/org/branding', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      const data = await res.json()
      const merged = {
        ...DEFAULT_BRANDING,
        name: data.name,
        logo: data.logo_url,
        favicon: data.favicon_url,
        colors: { ...DEFAULT_BRANDING.colors },
        theme: data.theme_id || 'default',
        mapProvider: data.map_provider || 'openstreetmap',
        mapTileUrl: data.map_tile_url || DEFAULT_BRANDING.mapTileUrl,
        isOrg: true,
        customCss: data.custom_css,
      }
      if (data.brand_primary_color) merged.colors.primary = data.brand_primary_color
      if (data.brand_secondary_color) merged.colors.secondary = data.brand_secondary_color
      setBranding(merged)
      applyBranding(merged)
    } catch {
      // fallback to default
    }
  }, [applyBranding])

  const resetBranding = useCallback(() => {
    setBranding(DEFAULT_BRANDING)
    applyBranding(DEFAULT_BRANDING)
  }, [applyBranding])

  useEffect(() => {
    applyBranding(branding)
  }, [])

  return (
    <BrandingContext.Provider value={{ branding, loadOrgBranding, resetBranding, applyBranding }}>
      {children}
    </BrandingContext.Provider>
  )
}

export function useBranding() {
  const ctx = useContext(BrandingContext)
  if (!ctx) throw new Error('useBranding must be used within BrandingProvider')
  return ctx
}