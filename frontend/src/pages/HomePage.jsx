import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/layout/Header'
import {
  Sparkles,
  Search,
  ShieldCheck,
  Cpu,
  MapPin,
  Layers,
  ArrowRight,
  CheckCircle2,
  Eye,
  Zap,
  Scan,
  Database,
  Lock
} from 'lucide-react'

const features = [
  {
    step: '01',
    title: 'Multimodal OpenCLIP AI',
    desc: 'Joint image and semantic text embeddings identify items even when the keywords do not match.',
    icon: Cpu,
    tag: 'Vision + Text'
  },
  {
    step: '02',
    title: 'Vector Similarity Ranking',
    desc: 'Cos-similarity matching powered by FAISS & pgvector ranks candidate objects with transparent confidence scores.',
    icon: Layers,
    tag: 'pgvector / FAISS'
  },
  {
    step: '03',
    title: 'Geo-Spatial Relevance',
    desc: 'Interactive map picker and location context filter noise so recoveries match the actual geographic zone.',
    icon: MapPin,
    tag: 'Location Aware'
  },
  {
    step: '04',
    title: 'Zero-Knowledge Human Verification',
    desc: 'Owner challenge questions and private claims guarantee safe return before physical handover occurs.',
    icon: ShieldCheck,
    tag: 'Verified Claims'
  },
]

function MatchSimulationCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      {/* Decorative ambient lights */}
      <div className="absolute -inset-4 sm:-inset-8 rounded-[40px] bg-gradient-to-tr from-cyan-500/20 via-violet-600/20 to-blue-600/10 blur-3xl" />

      <div className="relative rounded-3xl border border-white/10 bg-[#090e1f]/90 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-cyan-300">Neural Engine v2</p>
              <p className="text-xs font-semibold text-white">Cross-Modal Candidate Match</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold text-cyan-300">
            <Zap className="w-3 h-3 text-cyan-400" />
            96.4% Match
          </span>
        </div>

        {/* Source item card */}
        <div className="mt-5 rounded-2xl border border-white/[0.08] bg-slate-900/50 p-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 px-3 py-1 bg-cyan-500/20 text-cyan-300 border-b border-l border-cyan-500/30 rounded-bl-xl text-[10px] font-bold">
            LOST REPORT #892
          </div>
          <div className="flex gap-4 items-center">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 text-3xl shadow-inner">
              💻
            </div>
            <div className="min-w-0 pr-12">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Query</span>
              <h3 className="truncate font-semibold text-white text-sm sm:text-base">Space Gray MacBook Pro 14"</h3>
              <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                Library 2nd Floor Study Cubicles
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="rounded-md bg-white/[0.06] border border-white/[0.05] px-2 py-0.5 text-[10px] text-slate-300">Electronics</span>
                <span className="rounded-md bg-white/[0.06] border border-white/[0.05] px-2 py-0.5 text-[10px] text-slate-300">Apple</span>
                <span className="rounded-md bg-white/[0.06] border border-white/[0.05] px-2 py-0.5 text-[10px] text-slate-300">Space Gray</span>
              </div>
            </div>
          </div>
        </div>

        {/* Neural Vector Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-violet-500/40" />
          <div className="flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-[10px] font-semibold text-violet-300 shadow-sm">
            <Scan className="w-3 h-3 animate-pulse text-cyan-400" />
            <span>OPENCLIP VECTOR COSINE SIMILARITY</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-cyan-500/30 to-violet-500/40" />
        </div>

        {/* Candidate matched item */}
        <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 via-violet-950/15 to-transparent p-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid place-items-center w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">Found Item In Vault</p>
                <h4 className="text-sm font-semibold text-white">Apple Laptop (Covered with stickers)</h4>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                96.4%
              </span>
              <p className="text-[9px] uppercase tracking-wider text-slate-400">Confidence</p>
            </div>
          </div>

          {/* Similarity progress bar */}
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900 border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '96.4%' }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-500 shadow-lg shadow-cyan-500/30"
              />
            </div>
          </div>

          {/* Metric breakdown badges */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: 'Vision Model', val: '98.1%', color: 'text-cyan-400' },
              { label: 'Text Semantic', val: '95.2%', color: 'text-violet-400' },
              { label: 'Geo Proximity', val: '96.0%', color: 'text-emerald-400' },
            ].map((metric) => (
              <div key={metric.label} className="rounded-xl bg-slate-900/80 border border-white/[0.06] p-2.5 text-center">
                <p className="text-[10px] font-medium text-slate-400">{metric.label}</p>
                <p className={`mt-0.5 text-xs font-bold ${metric.color}`}>{metric.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live CTA button */}
        <Link
          to="/explore"
          className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 py-2.5 text-xs font-semibold text-cyan-300 transition"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Simulate Live Vector Search</span>
        </Link>
      </div>
    </motion.div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#030712] text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32">
        {/* Glow backdrop circles */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="pointer-events-none absolute right-10 top-40 h-[400px] w-[500px] rounded-full bg-violet-600/10 blur-[130px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            {/* Pill Tag */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>NEXT-GEN MULTIMODAL RECOVERY</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-[1.05]">
              Lost something? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400">
                Let AI retrieve it.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-300">
              4O4 FOUND combines OpenCLIP computer vision, Sentence Transformers, and pgvector spatial indexing to connect lost reports with found items instantaneously.
            </p>

            {/* Action buttons */}
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link
                to="/report/lost"
                className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Report Lost Item</span>
                <ArrowRight className="w-4 h-4 text-slate-950 transition group-hover:translate-x-1" />
              </Link>

              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Explore Live Items</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/[0.08] pt-8 max-w-lg">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-cyan-400">96.8%</p>
                <p className="mt-1 text-xs text-slate-400">Cross-modal accuracy</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">&lt; 150ms</p>
                <p className="mt-1 text-xs text-slate-400">Vector search latency</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-violet-400">100%</p>
                <p className="mt-1 text-xs text-slate-400">Verified ownership</p>
              </div>
            </div>
          </motion.div>

          <MatchSimulationCard />
        </div>
      </section>

      {/* Architecture & Tech Stack Banner */}
      <section className="border-y border-white/[0.08] bg-slate-950/60 py-10 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">
            Powered by Modern Intelligent Infrastructure
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 text-sm font-semibold">
            <span className="flex items-center gap-2 hover:text-white transition"><Cpu className="w-4 h-4 text-cyan-400" /> OpenCLIP & BLIP</span>
            <span className="flex items-center gap-2 hover:text-white transition"><Database className="w-4 h-4 text-cyan-400" /> PostgreSQL & pgvector</span>
            <span className="flex items-center gap-2 hover:text-white transition"><Zap className="w-4 h-4 text-violet-400" /> FastAPI REST API</span>
            <span className="flex items-center gap-2 hover:text-white transition"><Layers className="w-4 h-4 text-cyan-400" /> React & Tailwind CSS</span>
            <span className="flex items-center gap-2 hover:text-white transition"><Lock className="w-4 h-4 text-violet-400" /> JWT & SHA-256 Auth</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 relative" id="how">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Intelligent Pipeline</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
              From loss to reunion in three streamlined steps
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
              No endless message boards or manual scrolling. Our system extracts dense vectors from images and queries for instant automated discovery.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                num: '01',
                title: 'Capture & Ingest',
                desc: 'Upload an image or text description with optional location tags. Our edge upload service computes visual embeddings immediately.',
                icon: '📸',
                color: 'from-cyan-500/20 to-transparent'
              },
              {
                num: '02',
                title: 'Multimodal Matching',
                desc: 'Text queries match against image embeddings and vice versa, evaluating color, shape, category, and semantic context.',
                icon: '🧠',
                color: 'from-violet-500/20 to-transparent'
              },
              {
                num: '03',
                title: 'Verify & Recover',
                desc: 'The finder specifies a security question. When the claimant answers correctly, contacts and drop-off coordinates are revealed.',
                icon: '🛡️',
                color: 'from-emerald-500/20 to-transparent'
              }
            ].map((step) => (
              <div
                key={step.num}
                className="group relative rounded-3xl border border-white/[0.08] bg-slate-900/50 p-7 transition duration-300 hover:border-cyan-500/40 hover:-translate-y-1 hover:bg-slate-900/80"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{step.icon}</span>
                  <span className="text-xs font-bold tracking-widest text-slate-500 group-hover:text-cyan-400 transition">{step.num}</span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-white group-hover:text-cyan-300 transition">{step.title}</h3>
                <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 border-t border-white/[0.08] bg-gradient-to-b from-transparent via-slate-950/40 to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Technical Highlights</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold">Engineered for accuracy & speed</h2>
            </div>
            <Link
              to="/team"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
            >
              <span>Meet the Engineering Team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feat) => {
              const Icon = feat.icon
              return (
                <div
                  key={feat.step}
                  className="rounded-2xl border border-white/[0.08] bg-[#090e1f]/60 p-6 backdrop-blur-sm transition duration-300 hover:border-cyan-500/40 hover:bg-[#0b1329]"
                >
                  <div className="flex items-center justify-between">
                    <div className="grid place-items-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-bold text-white">{feat.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{feat.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="relative overflow-hidden py-24 border-t border-white/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-violet-600/10 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Ready to find your belonging?
          </span>
          <h2 className="mt-5 text-3xl sm:text-5xl font-black tracking-tight">
            Stop losing hope. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400">
              Start recovering with 4O4 FOUND.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-slate-400 leading-relaxed">
            Submit a lost report or list a found item to trigger instant AI similarity matching across the network.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <Link
              to="/report/lost"
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:brightness-105 transition"
            >
              Report Lost Item Now
            </Link>
            <Link
              to="/report/found"
              className="rounded-xl border border-white/15 bg-white/[0.06] px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/[0.1] transition"
            >
              I Found an Item
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="border-t border-white/[0.08] bg-[#02050e] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs">4</div>
            <span className="font-semibold text-slate-400">4O4 FOUND AI Inc.</span>
            <span>·</span>
            <span>Multimodal Recovery Engine</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/explore" className="hover:text-slate-300 transition">Explore Index</Link>
            <Link to="/team" className="hover:text-slate-300 transition">Team</Link>
            <Link to="/login" className="hover:text-slate-300 transition">Organization Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
