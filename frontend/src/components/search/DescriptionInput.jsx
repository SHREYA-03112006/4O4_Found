import { FileText, Sparkles } from 'lucide-react'

export default function DescriptionInput({ value, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Natural Language Description</span>
        </label>
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Sentence Transformers
        </span>
      </div>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe your item in detail: e.g. Black Dell Inspiron laptop with a GitHub sticker on the top cover, blue wireless mouse inside a padded sleeve..."
          rows={4}
          className="w-full rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-white placeholder-slate-500 backdrop-blur-md outline-none transition focus:border-cyan-500/60 focus:bg-slate-900/90 focus:ring-2 focus:ring-cyan-500/15"
        />
        <div className="absolute right-3 bottom-3 text-[10px] text-slate-500 font-mono">
          {value.length} chars
        </div>
      </div>
    </div>
  )
}
