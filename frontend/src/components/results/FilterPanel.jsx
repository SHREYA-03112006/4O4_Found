import { Filter, SlidersHorizontal } from 'lucide-react'

export default function FilterPanel({
  filters,
  onChange,
  confidenceMin,
  onConfidenceChange,
}) {
  const set = (k, v) => onChange({ ...filters, [k]: v })

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0b1329]/70 p-4 sm:p-5 backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Filter Inputs */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mr-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Refine Criteria:</span>
          </div>

          <input
            value={filters.category || ''}
            onChange={(e) => set('category', e.target.value)}
            placeholder="Category (e.g. Bag, Electronics)"
            className="filter-input rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500/50 outline-none"
          />

          <input
            value={filters.color || ''}
            onChange={(e) => set('color', e.target.value)}
            placeholder="Color (e.g. Black, Silver)"
            className="filter-input rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500/50 outline-none"
          />

          <input
            value={filters.brand || ''}
            onChange={(e) => set('brand', e.target.value)}
            placeholder="Brand (e.g. Apple, Sony)"
            className="filter-input rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500/50 outline-none"
          />
        </div>

        {/* Confidence slider */}
        <div className="flex items-center gap-3 bg-slate-900/60 rounded-xl px-3.5 py-2 border border-white/[0.06] self-start md:self-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-xs font-medium text-slate-300 whitespace-nowrap">
            Min Similarity
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={confidenceMin}
            onChange={(e) => onConfidenceChange(Number(e.target.value))}
            className="w-24 sm:w-28 accent-cyan-400 cursor-pointer"
          />
          <span className="w-10 text-right text-xs font-black text-cyan-400 font-mono">
            {Math.round(confidenceMin * 100)}%
          </span>
        </div>
      </div>
    </div>
  )
}
