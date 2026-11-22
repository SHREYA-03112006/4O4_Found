export function truncate(str, len = 100) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '...' : str
}

export function formatConfidence(score) {
  return `${(score * 100).toFixed(0)}%`
}

export function validateImage(file) {
  const errors = []
  if (!file.type.startsWith('image/')) {
    errors.push('File must be an image')
  }
  if (file.size > 5 * 1024 * 1024) {
    errors.push('Image must be under 5MB')
  }
  return errors
}

export function validateText(value, label, maxLen) {
  const errors = []
  if (!value || !value.trim()) {
    errors.push(`${label} is required`)
  }
  if (value && value.length > maxLen) {
    errors.push(`${label} must be under ${maxLen} characters`)
  }
  return errors
}