import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  Search, 
  FilePlus2, 
  LayoutDashboard, 
  Users, 
  LogOut, 
  LogIn, 
  Menu, 
  X,
  Compass
} from 'lucide-react'

export default function Header({ mode, onModeChange }) {
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const nav = [
    { to: '/explore', label: 'Explore Matches', icon: Compass },
    { to: '/report/lost', label: 'Report Lost', icon: Search },
    { to: '/report/found', label: 'Report Found', icon: FilePlus2 },
    { to: '/team', label: 'Engineers', icon: Users },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#030712]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[74px] flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3.5 group shrink-0">
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 opacity-70 blur-sm group-hover:opacity-100 transition duration-300" />
            <div className="relative grid place-items-center w-10 h-10 rounded-xl bg-[#090d1a] border border-white/20 text-white font-black shadow-inner">
              <span className="text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-violet-400 text-lg">
                4
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-white group-hover:text-cyan-300 transition">
                4O4 FOUND
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AI 2.0
              </span>
            </div>
            <span className="block text-[9px] font-medium tracking-[0.24em] text-slate-400 uppercase">
              Multimodal Recovery
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/40 p-1.5 rounded-2xl border border-white/[0.06]">
          {nav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 to-violet-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {mode && onModeChange && location.pathname === '/explore' && (
            <div className="hidden lg:flex items-center bg-slate-900/60 rounded-xl p-1 border border-white/10 text-xs">
              <button
                onClick={() => onModeChange('lost')}
                className={`px-3 py-1.5 rounded-lg transition font-medium ${
                  mode === 'lost'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Find Lost Item
              </button>
              <button
                onClick={() => onModeChange('found')}
                className={`px-3 py-1.5 rounded-lg transition font-medium ${
                  mode === 'found'
                    ? 'bg-violet-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Match Found Item
              </button>
            </div>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="relative group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 shadow-md shadow-cyan-500/20 transition duration-200"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#070b19]/95 backdrop-blur-2xl px-5 py-4 space-y-2">
          {nav.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.08]"
              >
                <Icon className="w-4 h-4 text-cyan-400" />
                <span>{item.label}</span>
              </Link>
            )
          })}
          {isAuthenticated && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.08]"
            >
              <LayoutDashboard className="w-4 h-4 text-violet-400" />
              <span>Workspace Dashboard</span>
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
