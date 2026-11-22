import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginForm from '../components/auth/LoginForm'
import GoogleLoginButton from '../components/auth/GoogleLoginButton'
import ConsentCheckbox from '../components/auth/ConsentCheckbox'
import { 
  Building2, 
  User, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from 'lucide-react'

export default function LoginPage() {
  const { login, register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [emailConsent, setEmailConsent] = useState(true)
  const [regError, setRegError] = useState('')

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const handleLogin = async (email, password) => {
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setRegError('')
    try {
      const f = e.target
      const email = f.email.value.trim()
      const password = f.password.value
      await register({
        org_name: orgName.trim(),
        admin_email: email,
        admin_password: password,
        display_name: displayName.trim(),
        email_consent: emailConsent,
      })
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setRegError(error?.message || 'Could not create the workspace account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-center">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl lg:grid-cols-2">
        {/* Left Side: Brand Narrative */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden border-r border-white/[0.08] bg-[#070c1a]/70 p-12 lg:p-16 backdrop-blur-2xl">
          {/* Ambient light glow */}
          <div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-cyan-500/15 blur-[120px]" />
          <div className="pointer-events-none absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />

          <Link to="/" className="relative flex items-center gap-3.5 group">
            <div className="relative grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 text-white font-black shadow-lg shadow-cyan-500/20">
              <span className="text-xl">4</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-white group-hover:text-cyan-300 transition">
                  4O4 FOUND
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  AI 2.0
                </span>
              </div>
              <span className="block text-[10px] font-medium tracking-[0.2em] text-slate-400 uppercase">
                Multimodal Recovery Engine
              </span>
            </div>
          </Link>

          <div className="relative my-auto max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Next-Generation Organization Lost & Found</span>
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl font-black leading-tight tracking-tight">
              Centralized recovery <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400">
                powered by deep AI.
              </span>
            </h1>

            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Equip your university, airport, transit hub, or corporate campus with OpenCLIP vision embeddings, automatic item tagging, and zero-leakage verification.
            </p>

            <div className="mt-8 space-y-3">
              {[
                'Instant cross-modal text & image indexing',
                'Zero-leakage challenge verification before release',
                'Real-time analytics and recovery audit logs',
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-between text-xs text-slate-500 border-t border-white/[0.06] pt-6">
            <span>© 2026 4O4 FOUND Inc.</span>
            <span>FastAPI · PostgreSQL · OpenCLIP</span>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="flex items-center justify-center p-6 sm:p-12 lg:p-16">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <div className="rounded-3xl border border-white/[0.08] bg-[#090e1f]/85 p-7 sm:p-9 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-cyan-400">
                    {isRegister ? 'New Organization Workspace' : 'Welcome Back'}
                  </p>
                  <h2 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-white">
                    {isRegister ? 'Create Account' : 'Sign in to 4O4 FOUND'}
                  </h2>
                </div>
              </div>

              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                {isRegister
                  ? 'Set up your campus or enterprise workspace to manage reports.'
                  : 'Enter your credentials to access your administrative dashboard.'}
              </p>

              <div className="mt-6">
                {isRegister ? (
                  <form onSubmit={handleRegister} className="space-y-4">
                    {regError && (
                      <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-300">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                        <span>{regError}</span>
                      </div>
                    )}

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                        Organization / Campus Name
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                        <input
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          placeholder="e.g. Stanford University or City Metro"
                          required
                          className="w-full rounded-xl border border-white/10 bg-slate-900/70 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                        Admin Display Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                        <input
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="e.g. Alex Chen"
                          required
                          className="w-full rounded-xl border border-white/10 bg-slate-900/70 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                        Admin Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                        <input
                          name="email"
                          type="email"
                          required
                          placeholder="admin@university.edu"
                          className="w-full rounded-xl border border-white/10 bg-slate-900/70 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
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
                          name="password"
                          type="password"
                          required
                          placeholder="••••••••••••"
                          className="w-full rounded-xl border border-white/10 bg-slate-900/70 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
                        />
                      </div>
                    </div>

                    <div className="pt-1">
                      <ConsentCheckbox checked={emailConsent} onChange={setEmailConsent} />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 py-3.5 text-xs font-bold text-slate-950 shadow-md hover:brightness-105 active:scale-[0.99] disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                          <span>Creating Workspace…</span>
                        </>
                      ) : (
                        <span>Create Workspace Account</span>
                      )}
                    </button>
                  </form>
                ) : (
                  <>
                    <LoginForm onSubmit={handleLogin} loading={loading} />

                    <div className="my-5 flex items-center gap-3">
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        OR
                      </span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <GoogleLoginButton />
                  </>
                )}
              </div>

              {/* Toggle switch between login and register */}
              <p className="mt-6 text-center text-xs text-slate-400">
                {isRegister ? 'Already have a registered workspace?' : "Don't have an account yet?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister((v) => !v)}
                  className="font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 ml-1"
                >
                  {isRegister ? 'Sign in' : 'Create workspace'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
