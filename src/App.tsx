import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
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
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => { document.body.style.overflow = intro ? 'hidden' : '' }, [intro])

  /* ── Lenis smooth scroll ── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    })
    lenisRef.current = lenis

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  /* ── GSAP scroll-triggered animations ── */
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Section headings reveal
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) =>
        gsap.fromTo(el, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }))

      // Process list items slide in
      gsap.utils.toArray<HTMLElement>('.process-list li').forEach((el) =>
        gsap.fromTo(el, { x: -40, opacity: 0.15 }, { x: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 55%', scrub: true } }))

      // Process timeline line
      gsap.fromTo('.process-line', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.process-list', start: 'top 70%', end: 'bottom 70%', scrub: true } })

      // Cards stagger reveal
      gsap.utils.toArray<HTMLElement>('.card').forEach((el, i) =>
        gsap.fromTo(el, { y: 60, opacity: 0, scale: 0.95 }, {
          y: 0, opacity: 1, scale: 1, duration: 0.7, delay: (i % 3) * 0.1,
          ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%' }
        }))

      // Services list items
      gsap.utils.toArray<HTMLElement>('.services li').forEach((el, i) =>
        gsap.fromTo(el, { x: -30, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.6, delay: i * 0.08,
          ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%' }
        }))

      // About section
      gsap.fromTo('.about-lede', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.about-lede', start: 'top 85%' }
      })

      // Facts stagger
      gsap.utils.toArray<HTMLElement>('.facts div').forEach((el, i) =>
        gsap.fromTo(el, { x: 30, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.5, delay: i * 0.1,
          ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' }
        }))

      // Contact section bounce in
      gsap.fromTo('.contact-links', { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.contact-links', start: 'top 88%' }
      })

      // Parallax marquee speed-up on scroll
      gsap.to('.marquee>div', {
        scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true },
        x: '-=120', ease: 'none'
      })
    })
    return () => mm.revert()
  }, [])

  /* ── Handle anchor clicks with Lenis ── */
  const handleAnchor = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href')
    if (href?.startsWith('#') && lenisRef.current) {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) lenisRef.current.scrollTo(target as HTMLElement, { offset: -70 })
    }
    setMenu(false)
  }, [])

  return (
    <>
      {intro && <Intro onDone={done} />}
      <header className="nav">
        <a href="#top" onClick={handleAnchor} aria-label="CRAPP EDITS home"><Wordmark /></a>
        <button className="icon-btn burger" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Toggle menu">{menu ? <X /> : <Menu />}</button>
        <nav className={menu ? 'open' : ''} aria-label="Main">
          {links.map(([l, h]) => <a key={h} href={h} onClick={handleAnchor}>{l}</a>)}
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
