import { Bookmark, Trash2, ArrowRight } from 'lucide-react'

export default function TrayPanel({ items = [], onRemove, onSelect }) {
  return (
    <aside className="rounded-3xl border border-white/[0.08] bg-[#0b1329]/70 p-5 backdrop-blur-md sticky top-24">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Saved Candidates
          </h3>
        </div>
        <span className="grid place-items-center h-5 px-2 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-black">
          {items.length}
        </span>
      </div>

      {!items.length ? (
        <div className="py-8 text-center">
          <p className="text-2xl opacity-60">📑</p>
          <p className="mt-2 text-xs font-medium text-slate-300">Tray is empty</p>
          <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
            Click "Save" on candidate cards to pin and compare them here side-by-side.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
          {items.map((i) => (
            <div
              key={i.item_id}
              className="group rounded-2xl border border-white/[0.08] bg-slate-900/60 p-3 hover:border-cyan-500/30 transition"
            >
              <button
                onClick={() => onSelect(i)}
                className="w-full text-left"
              >
                <div className="flex items-start justify-between gap-1">
                  <p className="truncate text-xs font-bold text-white group-hover:text-cyan-300 transition">
                    {i.description || 'Found Candidate'}
                  </p>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 shrink-0 mt-0.5" />
                </div>
                <p className="mt-1 text-[10px] text-slate-400 truncate">
                  {i.location_description || 'Location not specified'}
                </p>
              </button>
              <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.06] pt-2">
                <span className="text-[10px] font-semibold text-cyan-400">
                  {Math.round((i.score ?? i.confidence ?? 0) * 100)}% match
                </span>
                <button
                  onClick={() => onRemove(i)}
                  className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-red-400 transition"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}
