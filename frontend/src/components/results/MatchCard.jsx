import { Eye, Bookmark, BookmarkCheck, MapPin, Tag, Cpu } from 'lucide-react'

export default function MatchCard({ item, onSelect, inTray = false, onTrayToggle }) {
  const rawScore = item.score ?? item.confidence ?? 0
  const score = Math.round(rawScore * 100)

  // Determine badge styling based on score
  const getBadgeStyle = () => {
    if (score >= 80) return 'from-emerald-400 to-cyan-400 border-emerald-400/40 text-emerald-300 bg-emerald-950/40'
    if (score >= 60) return 'from-cyan-400 to-blue-400 border-cyan-400/40 text-cyan-300 bg-cyan-950/40'
    return 'from-amber-400 to-orange-400 border-amber-400/40 text-amber-300 bg-amber-950/40'
  }

  return (
    <article className="group relative rounded-2xl border border-white/[0.08] bg-[#0b1329]/70 p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/40 hover:bg-[#0f1d3d]/80 hover:shadow-xl hover:shadow-cyan-950/30 hover:-translate-y-1">
      <div className="flex gap-4 sm:gap-5">
        {/* Item image or fallback */}
        <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-900/80">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.description || 'Item candidate'}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-3xl bg-gradient-to-br from-slate-800 to-slate-900 text-slate-400">
              📦
            </div>
          )}
          <span className="absolute bottom-1.5 left-1.5 rounded-md bg-slate-950/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-300 backdrop-blur-xs border border-white/10">
            {item.status || 'Candidate'}
          </span>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  AI Candidate Match
                </span>
                <h3 className="mt-0.5 truncate text-sm sm:text-base font-bold text-white group-hover:text-cyan-200 transition">
                  {item.description || 'Unlabeled Registered Item'}
                </h3>
              </div>

              {/* Confidence Badge */}
              <div className={`shrink-0 rounded-xl px-2.5 py-1 border text-xs font-black shadow-sm ${getBadgeStyle()}`}>
                {score}%
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{item.location_description || 'No location specified'}</span>
            </p>

            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {item.category && (
                <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.05] border border-white/[0.06] px-2 py-0.5 text-[10px] text-slate-300">
                  <Tag className="w-2.5 h-2.5 text-slate-400" />
                  {item.category}
                </span>
              )}
              {item.color && (
                <span className="rounded-md bg-white/[0.05] border border-white/[0.06] px-2 py-0.5 text-[10px] text-slate-300">
                  {item.color}
                </span>
              )}
              {item.brand && (
                <span className="rounded-md bg-white/[0.05] border border-white/[0.06] px-2 py-0.5 text-[10px] text-slate-300">
                  {item.brand}
                </span>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
            <div className="flex gap-2">
              <button
                onClick={() => onSelect(item)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-sm transition hover:brightness-110 active:scale-95"
              >
                <Eye className="w-3.5 h-3.5 text-slate-950" />
                <span>Verify Details</span>
              </button>

              <button
                onClick={() => onTrayToggle?.(item.item_id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium border transition ${
                  inTray
                    ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300 font-semibold'
                    : 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
                }`}
              >
                {inTray ? (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>In Saved Tray</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                    <span>Save Candidate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress similarity line */}
      <div className="mt-3.5 h-1 w-full overflow-hidden rounded-full bg-slate-950">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-700"
          style={{ width: `${Math.max(8, Math.min(100, score))}%` }}
        />
      </div>
    </article>
  )
}
