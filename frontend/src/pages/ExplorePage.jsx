import { useState } from 'react'
import Header from '../components/layout/Header'
import SearchContainer from '../components/search/SearchContainer'
import ResultsPanel from '../components/results/ResultsPanel'
import FilterPanel from '../components/results/FilterPanel'
import TrayPanel from '../components/results/TrayPanel'
import ItemDetail from '../components/item/ItemDetail'
import ClaimForm from '../components/item/ClaimForm'
import { useSearch } from '../hooks/useSearch'
import { useTray } from '../hooks/useTray'
import { getSession } from '../services/session'
import { submitClaim } from '../services/api'
import { Compass } from 'lucide-react'

export default function ExplorePage() {
  const [mode, setMode] = useState('lost')
  const [filters, setFilters] = useState({})
  const [selected, setSelected] = useState(null)
  const [claiming, setClaiming] = useState(false)

  const {
    results,
    loading,
    confidenceMin,
    setConfidenceMin,
    performSearch,
    loadMore,
    nextCursor
  } = useSearch()

  const { trayItems, add, remove } = useTray()

  const search = async (data) => {
    setSearched(true)
    await performSearch({
      text: data.description || null,
      image_path: data.imagePath || null,
      status_filter: mode === 'lost' ? 'found' : 'lost',
      ...filters
    })
  }

  const claim = async (data) => {
    return submitClaim({
      ...data,
      session_id: getSession()
    })
  }

  const handleTrayToggle = (itemId) => {
    if (trayItems.some((i) => (typeof i === 'object' ? i.item_id : i) === itemId)) {
      remove({ item_id: itemId })
    } else {
      const match = results.find((r) => r.item_id === itemId)
      if (match) add(match)
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <Header mode={mode} onModeChange={setMode} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Banner Section */}
        <div className="relative mb-8 rounded-3xl border border-white/[0.08] bg-gradient-to-r from-slate-900/80 via-[#0b1329]/90 to-slate-900/80 p-6 sm:p-8 backdrop-blur-xl overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-[80px]" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>MULTIMODAL DISCOVERY HUB</span>
              </div>
              <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
                Explore Potential Matches
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                {mode === 'lost'
                  ? 'Searching for a lost belonging? Describe it or upload an image to find registered found items in our vault.'
                  : 'Found an item? Check recent lost reports to reunite it with its authentic owner.'}
              </p>
            </div>

            {/* Mode switch pills */}
            <div className="flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto">
              <button
                onClick={() => setMode('lost')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  mode === 'lost'
                    ? 'bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Find My Lost Item</span>
              </button>
              <button
                onClick={() => setMode('found')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  mode === 'found'
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Match a Found Item</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Query Input Card */}
        <div className="mb-8 rounded-3xl border border-white/[0.08] bg-[#090e1f]/80 p-6 sm:p-7 shadow-xl backdrop-blur-xl">
          <SearchContainer
            mode={mode}
            onSearch={search}
            onReport={search}
          />
        </div>

        {/* Filter Bar */}
        <div className="mb-8">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            confidenceMin={confidenceMin}
            onConfidenceChange={setConfidenceMin}
          />
        </div>

        {/* Results layout with Tray */}
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] items-start">
          {/* Main Results Column */}
          <div>
            <ResultsPanel
              results={results}
              loading={loading}
              onSelect={setSelected}
              onLoadMore={loadMore}
              hasMore={Boolean(nextCursor)}
              trayItems={trayItems.map((i) => (typeof i === 'object' ? i.item_id : i))}
              onTrayToggle={handleTrayToggle}
            />
          </div>

          {/* Right Sidebar Tray */}
          <div className="hidden lg:block">
            <TrayPanel
              items={trayItems}
              onSelect={setSelected}
              onRemove={(i) => remove(i)}
            />
          </div>
        </div>
      </main>

      {/* Item Detail Modal */}
      {selected && (
        <ItemDetail
          item={selected}
          onClose={() => setSelected(null)}
          onClaim={() => {
            setClaiming(true)
          }}
        />
      )}

      {/* Claim Form Modal */}
      {claiming && selected && (
        <ClaimForm
          item={selected}
          onSubmit={claim}
          onCancel={() => {
            setClaiming(false)
            setSelected(null)
          }}
        />
      )}
    </div>
  )
}
