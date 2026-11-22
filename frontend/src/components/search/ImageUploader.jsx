import { useState, useRef } from 'react'
import { uploadImage } from '../../services/api'
import { UploadCloud, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react'

export default function ImageUploader({ onImageProcessed }) {
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [detectedTag, setDetectedTag] = useState('')
  const inputRef = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Only image files (PNG, JPG, WEBP) are accepted')
      return
    }
    setError('')
    setPreview(URL.createObjectURL(file))
    setLoading(true)
    setDetectedTag('')

    try {
      const r = await uploadImage(file)
      const label = r.objects?.[0]?.label || 'object'
      setDetectedTag(label)
      onImageProcessed?.({
        imagePath: r.path,
        object: label,
      })
    } catch (err) {
      setError(err.message || 'Image upload or AI analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const triggerUpload = () => {
    inputRef.current?.click()
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
        id="image-upload"
      />

      <div
        onClick={triggerUpload}
        className={`group relative flex h-60 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
          preview 
            ? 'border-cyan-500/40 bg-slate-900/60 shadow-lg shadow-cyan-500/10' 
            : 'border-white/15 bg-slate-900/40 hover:border-cyan-400/50 hover:bg-cyan-500/[0.03]'
        }`}
      >
        {preview ? (
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <img
              src={preview}
              alt="Uploaded Item"
              className="h-full w-full object-contain rounded-xl"
            />
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-xs">
              <span className="rounded-xl bg-cyan-500/90 text-slate-950 px-4 py-2 text-xs font-bold shadow-md">
                Change Image
              </span>
              <p className="text-[11px] text-slate-300">Click to upload another file</p>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-tr from-cyan-500/15 to-violet-500/15 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition duration-300">
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-200">
              Upload Item Photo
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Drag & drop or click to browse (PNG, JPG, WEBP)
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-[10px] font-medium text-cyan-300">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Auto-Embed with OpenCLIP</span>
            </div>
          </div>
        )}
      </div>

      {/* Analysis feedback status */}
      {loading && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-2.5 text-xs text-cyan-300 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Processing visual embeddings and extracting features…</span>
        </div>
      )}

      {detectedTag && !loading && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>AI Feature Detected: <strong>{detectedTag}</strong></span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400/80 bg-emerald-950/60 px-2 py-0.5 rounded">
            Vectorized
          </span>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-3.5 py-2 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
