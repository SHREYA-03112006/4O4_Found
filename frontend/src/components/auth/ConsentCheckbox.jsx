import { useTranslation } from '../../hooks/useTranslation'

export default function ConsentCheckbox({ checked, onChange, disabled }) {
  const t = useTranslation()

  return (
    <label className="flex items-start gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      />
      <span className="text-sm text-gray-600">
        {t('auth.emailConsent')}
      </span>
    </label>
  )
}