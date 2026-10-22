import { useCallback, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Menu, X } from 'lucide-react'
import { Intro } from './components/Intro'
import { VideoModal } from './components/VideoModal'
import { About, Contact, Hero, Marquee, Portfolio, Process, Services, Showreel, Wordmark } from './components/Sections'
import type { VideoSource } from './data/site'

gsap.registerPlugin(ScrollTrigger)
const links = [['Work', '#work'], ['Services', '#services'], ['Process', '#process'], ['About', '#about'], ['Contact', '#contact']]

export default function App() {
  const [intro, setIntro] = useState(true)
  const [menu, setMenu] = useState(false)
  const [modal, setModal] = useState<{ title: string; video?: VideoSource | null } | null>(null)
  const done = useCallback(() => setIntro(false), [])
  const open = useCallback((title: string, video?: VideoSource | null) => setModal({ title, video }), [])

  useEffect(() => { document.body.style.overflow = intro ? 'hidden' : '' }, [intro])

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) =>
        gsap.fromTo(el, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }))
      gsap.utils.toArray<HTMLElement>('.process-list li').forEach((el) =>
        gsap.fromTo(el, { x: -40, opacity: 0.15 }, { x: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 55%', scrub: true } }))
      gsap.fromTo('.process-line', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.process-list', start: 'top 70%', end: 'bottom 70%', scrub: true } })
    })
    return () => mm.revert()
  }, [])

  return (
    <>
      {intro && <Intro onDone={done} />}
      <header className="nav">
        <a href="#top" aria-label="CRAPP EDITS home"><Wordmark /></a>
        <button className="icon-btn burger" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Toggle menu">{menu ? <X /> : <Menu />}</button>
        <nav className={menu ? 'open' : ''} aria-label="Main">
          {links.map(([l, h]) => <a key={h} href={h} onClick={() => setMenu(false)}>{l}</a>)}
        </nav>
      </header>
      <main>
        <Hero go={!intro} />
        <Marquee />
        <Showreel open={open} />
        <Portfolio open={open} />
        <Services />
        <Process />
        <About />
        <Contact />
      </main>
      <footer className="foot"><Wordmark /><span>© {new Date().getFullYear()} CRAPP EDITS</span></footer>
      <VideoModal open={!!modal} title={modal?.title ?? ''} video={modal?.video} onClose={() => setModal(null)} />
    </>
  )
}
