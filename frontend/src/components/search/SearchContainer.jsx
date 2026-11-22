import { useState } from 'react'
import ImageUploader from './ImageUploader'
import DescriptionInput from './DescriptionInput'
import { Sparkles, ArrowRight, Search, MapPin } from 'lucide-react'

export default function SearchContainer({
  onSearch,
  onReport,
  mode = 'lost'
}) {
  const [imageData, setImageData] = useState(null)
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')

  const submit = () => {
    if (!imageData && !description.trim()) {
      return
    }

    const data = {
      imagePath: imageData?.imagePath || null,
      description: description.trim(),
      location_description: location.trim(),
    }

    if (mode === 'found') {
      onReport?.(data)
    } else {
      onSearch?.(data)
    }
  }

  const hasInput = !!imageData || !!description.trim()

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr] items-start">
      {/* Left Column: Image Upload */}
      <div className="space-y-3">
        <ImageUploader onImageProcessed={setImageData} />
      </div>

      {/* Right Column: Description & Filters */}
      <div className="space-y-5">
        <DescriptionInput
          value={description}
          onChange={setDescription}
        />

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>{mode === 'found' ? 'Location Found' : 'Estimated Location Lost'}</span>
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Science Complex 3rd Floor, Student Center Cafeteria"
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 backdrop-blur-md outline-none transition focus:border-cyan-500/60 focus:bg-slate-900/90 focus:ring-2 focus:ring-cyan-500/15"
          />
        </div>

        <button
          onClick={submit}
          disabled={!hasInput}
          className="relative group w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 py-3.5 px-6 font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/35 hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <div className="flex items-center justify-center gap-2">
            <Search className="w-4 h-4 text-slate-950" />
            <span className="text-sm font-black tracking-tight">
              {mode === 'found' ? 'Index Found Item' : 'Run Multimodal Match Search'}
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </button>

        <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Cross-references dense CLIP embeddings against vector storage</span>
        </p>
      </div>
    </div>
  )
}
