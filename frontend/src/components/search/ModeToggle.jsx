export default function ModeToggle({ mode, onChange }) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
      <button
        onClick={() => onChange('lost')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          mode === 'lost'
            ? 'bg-red-500 text-white shadow'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        I Lost
      </button>
      <button
        onClick={() => onChange('found')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          mode === 'found'
            ? 'bg-green-500 text-white shadow'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        I Found
      </button>
    </div>
  )
}