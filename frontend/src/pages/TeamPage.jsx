import Header from '../components/layout/Header'
import { 
  Users, 
  Cpu, 
  Database, 
  Palette, 
  ShieldCheck, 
  Code2, 
  Zap,
  CheckCircle2
} from 'lucide-react'

const TEAM = [
  {
    id: 'dev1',
    name: 'Lead Architect & Full-Stack Engineer',
    role: 'System Architecture & Vector Core',
    icon: Cpu,
    tag: 'Core System',
    description: 'Designed the complete end-to-end architecture: React SPA with modular components, FastAPI backend with high-concurrency RESTful endpoints, PostgreSQL schema for transactional items, and Redis + pgvector for sub-100ms vector similarity search. Implemented the hybrid search service combining cosine distance calculations with structured relational SQL filters.',
    contributions: [
      'Hybrid search engine (OpenCLIP embeddings + pgvector / Redis)',
      'FastAPI async service routing & lifecycle management',
      'Multimodal AI integration pipeline with batching',
      'Zero-knowledge verification flow without forced profile lock-in',
      'Cross-session candidate tray memory service',
    ],
    accent: 'cyan',
  },
  {
    id: 'dev2',
    name: 'Frontend Lead & Design Technologist',
    role: 'React, Tailwind & Micro-Interactions',
    icon: Palette,
    tag: 'UI/UX & Frontend',
    description: 'Engineered the modern cyber-navy responsive interface using React 19, Tailwind CSS v4, and Lucide icons. Implemented reactive state containers, dynamic confidence threshold sliders, multi-angle drag-and-drop image ingestion with preview vectors, and mobile-first glassmorphic components.',
    contributions: [
      'Futuristic dark-mode cyber design system with glowing accents',
      'Search container with multi-source upload & real-time feedback',
      'Interactive MatchCard components with similarity percentage gauges',
      'Saved candidates tray drawer with cross-page state retention',
      'Accessible, mobile-responsive layouts across all breakpoints',
    ],
    accent: 'violet',
  },
  {
    id: 'dev3',
    name: 'Backend & Database Engineer',
    role: 'SQLAlchemy Models & REST Infrastructure',
    icon: Database,
    tag: 'Data & Security',
    description: 'Crafted the PostgreSQL relational schemas for lost/found items, claim verification messages, and organization workspaces. Developed robust multipart file ingestion pipelines with file validation, MIME sanitization, and SHA-256 password hashing.',
    contributions: [
      'PostgreSQL data layer with SQLAlchemy ORM models',
      'Item lifecycle management (lost → found → matched → recovered)',
      'Secure multipart file upload service with MIME verification',
      'Challenge question and answer validation endpoints',
      'Database indexes and query performance tuning',
    ],
    accent: 'cyan',
  },
  {
    id: 'dev4',
    name: 'UI/UX & Accessibility Specialist',
    role: 'Design System & Interaction Fidelity',
    icon: ShieldCheck,
    tag: 'Accessibility & Polish',
    description: 'Audited and optimized color contrast ratios, focus ring states, and ARIA attributes according to modern design and WCAG guidelines. Integrated responsive fluid layouts, informative empty states, and feedback toasts for claim confirmations.',
    contributions: [
      'WCAG AA accessible color hierarchy & focus ring styling',
      'Clean typography and consistent vertical rhythm',
      'Success and error feedback states across all user flows',
      'Map picker integration for precise spatial coordinates',
      'Interactive confetti and celebratory animations on recovery',
    ],
    accent: 'emerald',
  },
  {
    id: 'dev5',
    name: 'AI & Machine Learning Specialist',
    role: 'Model Pipelines & Vector Space Embeddings',
    icon: Zap,
    tag: 'AI/ML & Vision',
    description: 'Configured deep neural networks for computer vision and NLP: OpenCLIP (ViT-B/32) for joint multimodal embedding spaces, BLIP for automatic image caption generation, and DETR for real-time bounding-box object classification. Designed graceful fallback heuristics for offline and rate-limited environments.',
    contributions: [
      'Multimodal OpenCLIP model pipeline integration',
      'BLIP image captioning & DETR object classification',
      'Cosine similarity scoring algorithms with threshold tuning',
      'Token budget rate limiting & offline mock fallbacks',
      'Sentence Transformers semantic text embedding extraction',
    ],
    accent: 'violet',
  },
]

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold text-cyan-300 mb-3">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>CORE ENGINEERING TEAM</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            The Minds Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">4O4 FOUND</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
            A multidisciplinary collective spanning AI research, distributed backend architecture, modern web design, and human-computer interaction.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((member) => {
            const Icon = member.icon

            return (
              <div
                key={member.id}
                className="rounded-3xl border border-white/[0.08] bg-[#090e1f]/70 p-6 sm:p-7 backdrop-blur-xl flex flex-col justify-between group hover:border-cyan-500/40 hover:bg-[#0b1329] transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid place-items-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-105 transition">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30">
                      {member.tag}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-white group-hover:text-cyan-200 transition">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-cyan-400/90 mt-0.5">
                    {member.role}
                  </p>

                  <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                    {member.description}
                  </p>

                  <div className="mt-5 border-t border-white/[0.06] pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                      Key Contributions
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {member.contributions.map((c, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>SPECIALIZATION: ACTIVE</span>
                  <span className="text-cyan-400 font-bold">4O4_FOUND</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tech Stack Banner */}
        <div className="mt-16 rounded-3xl border border-white/[0.08] bg-gradient-to-r from-slate-900/60 via-[#0b1329]/90 to-slate-900/60 p-8 backdrop-blur-xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
            Engineered with Modern Standards
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-300 font-medium">
            <span className="flex items-center gap-2"><Code2 className="w-4 h-4 text-cyan-400" /> React 19 & Tailwind CSS v4</span>
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-violet-400" /> FastAPI & Python 3.13</span>
            <span className="flex items-center gap-2"><Database className="w-4 h-4 text-cyan-400" /> PostgreSQL & pgvector</span>
            <span className="flex items-center gap-2"><Cpu className="w-4 h-4 text-emerald-400" /> OpenCLIP & Hugging Face</span>
          </div>
        </div>
      </main>
    </div>
  )
}
