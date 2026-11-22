

export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return (
    <div
      className={`${sizes[size]} rounded-full animate-spin`}
      style={{ border: '2px solid var(--brand-primary)', borderTopColor: 'transparent' }}
    />
  )
}

export function EmptyState({ icon = '🔍', title, message }) {
  return (
    <div className="text-center py-12">
      <p className="text-3xl mb-3">{icon}</p>
      <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--brand-text)' }}>{title || 'Nothing here'}</h3>
      <p className="text-sm" style={{ color: 'var(--brand-textMuted)' }}>{message || 'Content will appear here'}</p>
    </div>
  )
}

export function Button({ children, onClick, disabled, variant = 'primary', className = '', type = 'button' }) {
  const base = 'px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}