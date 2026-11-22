import { useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { Mail, Lock, LogIn, Loader2, AlertCircle } from 'lucide-react'

export default function LoginForm({ onSubmit, loading }) {
  const t = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError(t('auth.emailRequired') || 'Email is required')
      return
    }
    if (!password) {
      setError(t('auth.passwordRequired') || 'Password is required')
      return
    }
    try {
      await onSubmit(email, password)
    } catch (err) {
      setError(err.message || t('auth.invalidCredentials') || 'Invalid email or password')
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
          Account Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500/60 focus:bg-slate-900/90"
            placeholder="admin@organization.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500/60 focus:bg-slate-900/90"
            placeholder="••••••••••••"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 py-3.5 text-xs font-bold text-slate-950 shadow-md transition hover:brightness-105 active:scale-[0.99] disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            <span>Authenticating…</span>
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4 text-slate-950" />
            <span>Sign In to Dashboard</span>
          </>
        )}
      </button>
    </form>
  )
}
