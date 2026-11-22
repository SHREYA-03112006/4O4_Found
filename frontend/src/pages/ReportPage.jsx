import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import ImageUploader from '../components/search/ImageUploader'
import DescriptionInput from '../components/search/DescriptionInput'
import MapPicker from '../components/item/MapPicker'
import { createItem } from '../services/api'
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Send,
  Loader2,
  AlertCircle,
  FilePlus2,
  Search
} from 'lucide-react'
import confetti from 'canvas-confetti'

export default function ReportPage({ type }) {
  const found = type === 'found'
  const [image, setImage] = useState(null)
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [pickup, setPickup] = useState(null)
  const [contact, setContact] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!image && !description.trim()) return
    setSaving(true)
    setError('')
    try {
      await createItem({
        status: found ? 'found' : 'lost',
        image_path: image?.imagePath || null,
        description: description.trim() || null,
        location_description: location.trim() || null,
        drop_location: found ? location.trim() || null : null,
        pickup_lat: pickup?.lat || null,
        pickup_lng: pickup?.lng || null,
        finder_contact: found ? contact.trim() || null : null,
        verification_question: found ? question.trim() || null : null,
        verification_answer: found ? answer.trim() || null : null,
      })
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } })
      setDone(true)
    } catch (err) {
      setError(err.message || 'Could not create the report. Please make sure the backend is running.')
    } finally {
      setSaving(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#030712] text-white">
        <Header />
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <p className="mt-6 text-xs uppercase font-bold tracking-[0.2em] text-emerald-400">
            Report Indexed & Vectorized
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black">
            {found ? 'Found item is now live!' : 'Lost report created successfully!'}
          </h1>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            Our multimodal engine is now comparing your submission against existing records. Any matching candidate will trigger an instant notification.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/explore"
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 px-6 py-3 text-xs font-bold text-slate-950 shadow-md hover:brightness-105"
            >
              Explore Potential Matches →
            </Link>
            <button
              onClick={() => setDone(false)}
              className="rounded-xl border border-white/10 bg-white/[0.05] px-6 py-3 text-xs font-semibold text-slate-300 hover:bg-white/[0.1]"
            >
              Submit Another Item
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <Header />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Title Heading */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300 mb-2">
              {found ? <FilePlus2 className="w-3.5 h-3.5 text-cyan-400" /> : <Search className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{found ? 'CUSTODIAN / FINDER SUBMISSION' : 'OWNER LOSS NOTIFICATION'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {found ? 'List a Found Item' : 'Report a Missing Belonging'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Provide visual and semantic details. Our AI builds a multimodal fingerprint for vector matching.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-900/60 p-1.5 rounded-2xl border border-white/10">
            <Link
              to="/report/lost"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${!found
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              Lost Item
            </Link>
            <Link
              to="/report/found"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${found
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              Found Item
            </Link>
          </div>
        </div>

        {/* Form Grid */}
        <form onSubmit={submit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.25fr]">
          {/* Left: Image & Visual Analysis */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/[0.08] bg-[#090e1f]/80 p-5 sm:p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Item Photograph
                </span>
                <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  Required or Desired
                </span>
              </div>
              <ImageUploader onImageProcessed={setImage} />
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-[#090e1f]/80 p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Pin Geo-Coordinates (Optional)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Click on the map to tag the exact physical spot where the item was lost or found.
              </p>
              <MapPicker onPinned={setPickup} onClear={() => setPickup(null)} />
            </div>
          </div>

          {/* Right: Text description and security verification */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#090e1f]/80 p-6 sm:p-7 shadow-xl backdrop-blur-xl space-y-5">
            <DescriptionInput value={description} onChange={setDescription} />

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                {found ? 'Where was it found?' : 'Where was it lost?'}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Central Library 2nd Floor, Room 204, or Student Cafe"
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
              />
            </div>

            {found && (
              <div className="space-y-4 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    Finder Verification Security Challenge
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Set a question that only the real owner can answer (e.g. "What sticker is on the back?" or "What color is the pouch?").
                </p>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Your Contact Email / Phone
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g. finder@university.edu or +1 (555) 234-5678"
                    className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Verification Question
                    </label>
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="e.g. What is inside the front zipper?"
                      className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Expected Secret Answer
                    </label>
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="e.g. Blue student ID card"
                      className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving || (!image && !description.trim())}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 py-3.5 font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:brightness-105 active:scale-[0.99] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span className="text-sm">Creating Embeddings & Registering…</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-slate-950" />
                    <span className="text-sm">
                      {found ? 'Publish Found Item to Vault' : 'Submit Lost Report'}
                    </span>
                  </>
                )}
              </div>
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
