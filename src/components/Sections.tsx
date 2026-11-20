import { lazy, Suspense, useRef, useState } from 'react'
import { ArrowUpRight, Instagram, Mail, MessageCircle, Phone, Play } from 'lucide-react'
import { categories, process, projects, site, type Project, type VideoSource } from '../data/site'
import { VideoModal } from './VideoModal'

const Hero3D = lazy(() => import('./Hero3D'))
const hasWebGL = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false } }

export function Wordmark() {
  return <span className="wordmark"><span className="wm-crapp">CRAPP</span><span className="wm-media">MEDIA</span></span>
}

export function Hero({ go, open }: { go: boolean; open?: (t: string, v?: VideoSource | null) => void }) {
  const [webgl] = useState(hasWebGL)
  const { poster, video } = site.showreel
  return (
    <section className={`hero light ${go ? 'go' : ''}`} id="top">
      <div className="hero-copy">
        <h1 className="display hero-title" aria-label="Creativity in every frame.">
          <span className="line"><span>WE MAKE</span></span>
          <span className="line"><span className="outline">BRAND IMPOSSIBLE</span></span>
          <span className="line"><span className="red">TO IGNORE</span></span>
        </h1>
        <p className="lede">Creating cinematic visuals and compelling stories that elevate your brand identity.</p>
        <div className="btn-row">
          <a className="btn btn-red" href="#work">Explore our work</a>
          <a className="btn btn-ghost" href="#contact">Start a project</a>
        </div>
      </div>

      {/* Mobile-only Showreel filling the empty hero space */}
      <div className="hero-mobile-reel" aria-label="Showreel">
        <button className="reel" onClick={() => open?.('CRAPP MEDIA Showreel', video)} aria-label="Play showreel">
          {poster ? <img src={poster} alt="Showreel poster" loading="lazy" /> : <span className="reel-ph"><b>CRAPP</b><em>placeholder poster — add yours in site.ts</em></span>}
          <span className="play"><Play size={30} fill="currentColor" /></span>
        </button>
      </div>

      {webgl ? <Suspense fallback={null}><Hero3D /></Suspense> : (
        <div className="hero3d fallback" aria-hidden="true"><i /><i /><i /></div>
      )}
    </section>
  )
}

export function Showreel({ open }: { open: (t: string, v?: VideoSource | null) => void }) {
  const { poster, video } = site.showreel
  return (
    <section className="dark section showreel-section" id="showreel">
      <div className="showreel-ambient-glow" aria-hidden="true" />
      <h2 className="display h2" data-reveal>THE <span className="brush">showreel</span></h2>
      <div className="reel-container">
        <button className="reel" onClick={() => open('CRAPP MEDIA Showreel', video)} aria-label="Play showreel">
          {poster ? <img src={poster} alt="Showreel poster" loading="lazy" /> : <span className="reel-ph"><b>CRAPP</b><em>placeholder poster — add yours in site.ts</em></span>}
          <span className="play"><Play size={34} fill="currentColor" /></span>
        </button>
      </div>
    </section>
  )
}

function Card({ p, i, open, style }: { p: Project; i: number; open: (t: string, v?: VideoSource | null) => void; style?: React.CSSProperties }) {
  const ref = useRef<HTMLButtonElement>(null)
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 12}deg`)
    ref.current.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 12}deg`)
  }
  const leave = () => { ref.current?.style.setProperty('--rx', '0deg'); ref.current?.style.setProperty('--ry', '0deg') }
  return (
    <button ref={ref} className="card" data-scroll-card style={style} onPointerMove={move} onPointerLeave={leave} onClick={() => open(p.title, p.video)} aria-label={`Open ${p.title}`}>
      <span className="thumb">
        {p.thumbnail ? <img src={p.thumbnail} alt="" loading="lazy" className="thumb-img" /> : <span className="thumb-ph">{String(i + 1).padStart(2, '0')}</span>}
        {p.placeholder && <span className="tag">Placeholder</span>}
        <span className="play sm"><Play size={20} fill="currentColor" /></span>
      </span>
      <span className="cat">{p.category}{p.client ? ` · ${p.client}` : ''}</span>
      <span className="card-title">{p.title}</span>
      <span className="card-desc">{p.description}</span>
    </button>
  )
}

export function Portfolio({ open }: { open: (t: string, v?: VideoSource | null) => void }) {
  const [filter, setFilter] = useState<string>('All Projects')
  const list = filter === 'All Projects' ? projects : projects.filter((p) => p.category === filter)
  return (
    <section className="light section" id="work">
      <h2 className="display h2" data-reveal>OUR <span className="outline">SERVICES</span></h2>
      <div className="filters" role="group" aria-label="Filter projects">
        {['All Projects', ...categories].map((c) => (
          <button key={c} className={`chip ${filter === c ? 'on' : ''}`} aria-pressed={filter === c} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>
      <div className="grid" key={filter}>
        {list.map((p, i) => <Card key={p.id} p={p} i={projects.indexOf(p)} open={open} style={{ animationDelay: `${Math.min(i, 8) * 0.035}s` }} />)}
        {!list.length && <p className="empty">Project is in work...</p>}
      </div>
    </section>
  )
}

export function Process() {
  return (
    <section className="dark section" id="process">
      <h2 className="display h2" data-reveal>WHAT WE <span className="red" >DO</span></h2>
      <ol className="process-list">
        <span className="process-line" aria-hidden="true">
          <span className="process-glow-node" />
        </span>
        {process.map((s, i) => (
          <li key={s.title} className="process-item">
            <span className="step-n">{i + 1}</span>
            <div className="step-body">
              <h2 className="display">{s.title}</h2>
              <p>{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function About() {
  const a = site.about
  const facts: [string, string][] = [['Owner', a.owner], ['Team', a.team], ['Location', a.location], ['Experience', a.experience]]
  return (
    <section className="light section about" id="about">
      <h2 className="display h2" data-reveal>ABOUT <Wordmark /></h2>
      <div className="about-grid">
        <p className="about-lede" data-scroll-about>CRAPP MEDIA is a video shooting, editing and promotional reel agency. {a.approach}</p>
        <dl className="facts">
          {facts.map(([k, v]) => (
            <div key={k} className="fact-item"><dt>{k}</dt><dd className={v ? '' : 'todo'}>{v || `Add in site.ts`}</dd></div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function Contact() {
  const c = site.contact
  const links = [
    c.instagram && { icon: <Instagram size={18} />, label: 'Instagram', href: `https://instagram.com/${c.instagram.replace('@', '')}` },
    c.whatsapp && { icon: <MessageCircle size={18} />, label: 'WhatsApp', href: `https://wa.me/${c.whatsapp.replace(/\D/g, '')}` },
    c.phone && { icon: <Phone size={18} />, label: c.phone, href: `tel:${c.phone.replace(/[^\d+]/g, '')}` },
    c.email && { icon: <Mail size={18} />, label: c.email, href: `mailto:${c.email}` },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; href: string }[]
  return (
    <section className="redsec section" id="contact">
      <h2 className="display huge contact-title" data-reveal>GOT A VISION?<br /><span className="contact-accent">let's make it REAL...</span></h2>
      <div className="contact-links">
        {links.length ? links.map((l) => (
          <a key={l.href} className="btn btn-black contact-btn" href={l.href} target="_blank" rel="noreferrer">
            {l.icon}
            <span className="contact-label">{l.label}</span>
            <ArrowUpRight size={16} className="contact-arrow" />
          </a>  
        )) : <p className="todo-box">Contact links are not configured yet. Add your Instagram, WhatsApp, phone and email in <code>src/data/site.ts</code>.</p>}
      </div>
    </section>
  )
}
