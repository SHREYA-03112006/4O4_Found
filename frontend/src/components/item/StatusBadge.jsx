export default function StatusBadge({ status }) {
  const colors = {
    lost: 'bg-red-100 text-red-700',
    found: 'bg-green-100 text-green-700',
    recovered: 'bg-blue-100 text-blue-700',
  }

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}