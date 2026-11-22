import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import { fetchItems } from '../services/api'
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ArrowUpRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react'

export default function DashboardPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await fetchItems({ limit: 60 })
        setReports(data || [])
      } catch (error) {
        console.error('Failed to load reports:', error)
      } finally {
        setLoading(false)
      }
    }
    loadReports()
  }, [])

  const lost = reports.filter((item) => item.status?.toLowerCase() === 'lost').length
  const found = reports.filter((item) => item.status?.toLowerCase() === 'found').length
  const recovered = reports.filter((item) => item.status?.toLowerCase() === 'recovered').length
  const total = reports.length

  const filteredReports = reports.filter((r) => {
    if (filterType === 'all') return true
    return r.status?.toLowerCase() === filterType
  })

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Workspace Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/[0.08] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
              <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
              <span>ORGANIZATION INTELLIGENCE</span>
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
              Recovery Operations Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Real-time monitoring of lost claims, custody vault inventory, and verification milestones.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/report/lost"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:brightness-105 transition"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Log Lost Item</span>
            </Link>

            <Link
              to="/report/found"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] hover:bg-white/[0.1] px-4 py-2.5 text-xs font-semibold text-white transition"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Register Found Item</span>
            </Link>
          </div>
        </div>

        {/* Metric Statistics Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/[0.08] bg-[#090e1f]/70 p-6 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/30 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Cataloged</span>
              <div className="grid place-items-center w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-4 text-4xl font-black text-white">{total}</p>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-cyan-300">
              <TrendingUp className="w-3 h-3 text-cyan-400" />
              <span>Active multimodal index records</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[#090e1f]/70 p-6 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/30 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Lost Inquiries</span>
              <div className="grid place-items-center w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400">
                <Search className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-4 text-4xl font-black text-amber-400">{lost}</p>
            <p className="mt-2 text-[11px] text-slate-400">Actively scanning for match candidates</p>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[#090e1f]/70 p-6 backdrop-blur-xl relative overflow-hidden group hover:border-violet-500/30 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Vault Inventory</span>
              <div className="grid place-items-center w-8 h-8 rounded-xl bg-violet-500/10 text-violet-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-4 text-4xl font-black text-violet-400">{found}</p>
            <p className="mt-2 text-[11px] text-slate-400">Items securely stored awaiting owner claim</p>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[#090e1f]/70 p-6 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/30 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Returns</span>
              <div className="grid place-items-center w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-4 text-4xl font-black text-emerald-400">{recovered}</p>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Full challenge verification passed</span>
            </div>
          </div>
        </div>

        {/* Inventory Table Section */}
        <div className="mt-10 rounded-3xl border border-white/[0.08] bg-[#090e1f]/70 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
            <div>
              <h2 className="text-xl font-bold text-white">Item Records Registry</h2>
              <p className="mt-1 text-xs text-slate-400">
                Browse, filter, and inspect registered items across your organization.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 text-xs">
              {[
                { key: 'all', label: 'All Items' },
                { key: 'lost', label: 'Lost Only' },
                { key: 'found', label: 'Found Only' },
                { key: 'recovered', label: 'Recovered' },
              ].map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setFilterType(btn.key)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition ${
                    filterType === btn.key
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400">
              Loading workspace records…
            </div>
          ) : !filteredReports.length ? (
            <div className="py-16 text-center">
              <p className="text-3xl">📭</p>
              <h4 className="mt-3 text-base font-bold text-white">No items found</h4>
              <p className="mt-1 text-xs text-slate-400">
                No reports matching the selected category filter currently exist.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <th className="pb-3 pl-2">Item</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Location Details</th>
                    <th className="pb-3">Created</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredReports.map((item) => {
                    const isFound = item.status?.toLowerCase() === 'found'
                    const isRecovered = item.status?.toLowerCase() === 'recovered'
                    return (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition">
                        <td className="py-3.5 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-900 flex items-center justify-center">
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-base">📦</span>
                              )}
                            </div>
                            <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                              <p className="truncate font-bold text-white">
                                {item.description || 'Unlabeled item'}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                ID: {item.id?.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              isRecovered
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                : isFound
                                ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
                                : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                            }`}
                          >
                            {item.status || 'Active'}
                          </span>
                        </td>

                        <td className="py-3.5 text-slate-300">
                          {item.category || 'General'}
                        </td>

                        <td className="py-3.5 text-slate-400 truncate max-w-[180px]">
                          {item.location_description || 'Not specified'}
                        </td>

                        <td className="py-3.5 text-slate-500 font-mono text-[11px]">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                        </td>

                        <td className="py-3.5 text-right pr-2">
                          <Link
                            to="/explore"
                            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold"
                          >
                            <span>Find Matches</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
