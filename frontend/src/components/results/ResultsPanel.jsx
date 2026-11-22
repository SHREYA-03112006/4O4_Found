import MatchCard from './MatchCard'
import { Search, Loader2, Sparkles, RefreshCw } from 'lucide-react'

export default function ResultsPanel({
  results = [],
  loading,
  onSelect,
  onLoadMore,
  hasMore,
  trayItems = [],
  onTrayToggle,
}) {
  return (
    <div className="space-y-4">
      {/* Loading state */}
      {loading && (
        <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-12 text-center backdrop-blur-md">
          <div className="relative mx-auto h-12 w-12">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
            <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-violet-400 animate-pulse" />
          </div>
          <h4 className="mt-4 text-base font-bold text-white">Analyzing Multimodal Embeddings</h4>
          <p className="mt-1 text-xs text-slate-400">
            Querying vector indexes, calculating cosine similarities, and ranking matched candidates...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !results.length && (
        <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/30 p-12 text-center backdrop-blur-sm">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="mt-4 text-base font-bold text-white">No Matched Items Yet</h4>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            Upload an image or type a detailed description above to search across all registered lost and found records.
          </p>
        </div>
      )}

      {/* Results List */}
      {!loading && results.length > 0 && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-400">
              Found <strong className="text-cyan-400 font-bold">{results.length}</strong> potential candidates
            </span>
            <span className="text-[11px] text-slate-500">Sorted by Vector Relevance</span>
          </div>

          {results.map((item) => (
            <MatchCard
              key={item.item_id}
              item={item}
              onSelect={onSelect}
              inTray={trayItems.includes(item.item_id)}
              onTrayToggle={onTrayToggle}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 py-3.5 text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition disabled:opacity-50"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load More Candidates</span>
        </button>
      )}
    </div>
  )
}
