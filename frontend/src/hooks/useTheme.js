import { useMemo } from 'react'
import { useBranding } from '../context/BrandingContext'

export function useTheme() {
  const { branding } = useBranding()
  const { colors, borderRadius, fontFamily } = branding

  return useMemo(() => ({
    colors,
    fontFamily,
    borderRadius,
    btn: (variant = 'primary') => {
      const base = 'px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed'
      if (variant === 'primary') {
        return `${base} text-white`
      }
      if (variant === 'secondary') {
        return `${base} border text-gray-700 hover:bg-gray-50`
      }
      if (variant === 'danger') {
        return `${base} text-white`
      }
      return base
    },
    link: `transition-colors`,
    brandName: branding.logo
      ? () => <img src={branding.logo} alt={branding.name} className="h-8" />
      : () => branding.name,
  }), [branding])
}