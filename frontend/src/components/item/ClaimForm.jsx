import { useState } from 'react'
import { CheckCircle2, AlertCircle, X, Lock, Send, Loader2 } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function ClaimForm({ item, onSubmit, onCancel }) {
  const [message, setMessage] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [approved, setApproved] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()

    if (!message.trim() || !answer.trim()) return

    setLoading(true)
    setError('')

    try {
      const result = await onSubmit({
        item_id: item.item_id,
        message: message.trim(),
        verification_answer: answer.trim(),
      })

      if (result.status === 'approved') {
        setApproved(true)
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        })
      }

      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Failed to submit claim')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/80 p-4 backdrop-blur-md">
        <div className="w-full max-w-md rounded-3xl border border-cyan-500/30 bg-[#090e1f] p-7 text-center shadow-2xl">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <p className="mt-5 text-xs uppercase font-bold tracking-[0.2em] text-emerald-400">
            {approved ? 'Verification Passed' : 'Claim Queued'}
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            {approved ? 'Item Verified Successfully!' : 'Claim Sent for Review'}
          </h2>

          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-400">
            {approved
              ? 'Your security challenge answer matched the finder’s record! The item status has been updated to Recovered.'
              : 'Your verification message has been registered with the organization. You will receive an update once reviewed.'}
          </p>

          <button
            onClick={onCancel}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 py-3 text-xs font-bold text-slate-950 shadow-md transition hover:brightness-105"
          >
            Back to Recovery Hub
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/80 p-4 backdrop-blur-md">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border border-white/15 bg-[#090e1f] p-6 sm:p-7 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Owner Claim Verification</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3.5 text-xs text-slate-300">
            <span className="font-semibold text-cyan-300">Item: </span>
            {item.description || 'Target Item'}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Verification Challenge Answer
            </label>
            <input
              type="text"
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="e.g. Serial number, desktop wallpaper, sticker color"
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Provide unique details that only the authentic owner would know.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Message to Finder / Custodian
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mention your contact email/phone, preferred collection time, or location..."
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-white/10 py-3 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.05]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !answer.trim() || !message.trim()}
              className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 py-3 text-xs font-bold text-slate-950 shadow-md hover:brightness-105 disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying…</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-slate-950" />
                  <span>Submit Claim</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
