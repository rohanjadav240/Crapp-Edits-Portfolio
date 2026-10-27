import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ArrowUp, Menu, X } from 'lucide-react'
import { Intro } from './components/Intro'
import { VideoModal } from './components/VideoModal'
import { About, Contact, Hero, Marquee, Portfolio, Process, Services, Showreel, Wordmark } from './components/Sections'
import type { VideoSource } from './data/site'

gsap.registerPlugin(ScrollTrigger)
const links = [['Work', '#work'], ['Services', '#services'], ['Process', '#process'], ['About', '#about'], ['Contact', '#contact']]

export default function App() {
  const [intro, setIntro] = useState(true)
  const [menu, setMenu] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [showTopBtn, setShowTopBtn] = useState(false)
  const [modal, setModal] = useState<{ title: string; video?: VideoSource | null } | null>(null)
  
  const done = useCallback(() => setIntro(false), [])
  const open = useCallback((title: string, video?: VideoSource | null) => setModal({ title, video }), [])
  
  const lenisRef = useRef<Lenis | null>(null)
  const progressBarRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { document.body.style.overflow = intro ? 'hidden' : '' }, [intro])

  /* ── Ultra-Smooth Lenis Configuration with Real-Time Progress ── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.8,
      infinite: false,
    })
    lenisRef.current = lenis

    // Sync Lenis with GSAP ScrollTrigger & track progress
    const handleScroll = (e: { progress?: number }) => {
      ScrollTrigger.update()
      
      const scrollY = window.scrollY || document.documentElement.scrollTop
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? THREE_lerp_progress(scrollY / maxScroll) : (e.progress ?? 0)
      
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`
      }
      
      setNavScrolled(scrollY > 40)
      setShowTopBtn(scrollY > 480)
    }

    function THREE_lerp_progress(p: number) {
      return Math.max(0, Math.min(1, p))
    }

    lenis.on('scroll', handleScroll)
    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    // Recalculate scroll limits when layout changes
    let rafId: number
    const ro = new ResizeObserver(() => {
      lenis.resize()
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    })
    ro.observe(document.body)

    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafId)
      gsap.ticker.remove(onTick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  /* ── GSAP scroll-triggered animations & Parallax ── */
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. Section headings reveal with 3D perspective pop
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 80, opacity: 0, rotateX: 18 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' }
          }
        )
      })

      // 2. Hero Section Parallax depth on scroll
      gsap.to('.hero-copy', {
        y: -90,
        opacity: 0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      })

      gsap.to('.hero3d', {
        y: 110,
        scale: 0.92,
        rotationZ: 3,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      })

      gsap.to('.hero-scroll-cue', {
        y: 35,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: '28% top',
          scrub: true,
        }
      })

      // 3. Dual-track Marquee Counter-Scroll Parallax
      gsap.to('.marquee-track-left', {
        x: '-=320',
        ease: 'none',
        scrollTrigger: {
          trigger: '.marquee-wrapper',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      })

      gsap.to('.marquee-track-right', {
        x: '+=320',
        ease: 'none',
        scrollTrigger: {
          trigger: '.marquee-wrapper',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      })

      // 4. Showreel Cinematic Expand & Ambient Glow
      gsap.fromTo(
        '.reel-container',
        { scale: 0.88, y: 60, opacity: 0.8 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#showreel',
            start: 'top 80%',
            end: 'top 20%',
            scrub: 0.8,
          }
        }
      )

      gsap.fromTo(
        '.showreel-ambient-glow',
        { scale: 0.7, opacity: 0.1 },
        {
          scale: 1.25,
          opacity: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#showreel',
            start: 'top 75%',
            end: 'top 30%',
            scrub: true,
          }
        }
      )

      // 5. Portfolio cards scroll entrance & image parallax
      gsap.utils.toArray<HTMLElement>('[data-scroll-card]').forEach((card) => {
        gsap.fromTo(
          card,
          { y: 55, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
            }
          }
        )

        const img = card.querySelector('.thumb-img')
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              }
            }
          )
        }
      })

      // 6. Services list items interactive slide & accent lines
      gsap.utils.toArray<HTMLElement>('.service-item').forEach((el, i) => {
        gsap.fromTo(
          el,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.75,
            delay: i * 0.05,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' }
          }
        )

        const bar = el.querySelector('.service-accent-bar')
        if (bar) {
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                end: 'top 50%',
                scrub: 0.4,
              }
            }
          )
        }
      })

      // 7. Process Timeline Line & Step nodes illumination
      gsap.fromTo(
        '.process-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.process-list',
            start: 'top 75%',
            end: 'bottom 75%',
            scrub: true,
          }
        }
      )

      gsap.utils.toArray<HTMLElement>('.process-item').forEach((el) => {
        const badge = el.querySelector('.step-n')
        const body = el.querySelector('.step-body')

        if (badge) {
          gsap.fromTo(
            badge,
            { scale: 0.75, borderColor: '#333', color: '#666' },
            {
              scale: 1,
              borderColor: '#FF2028',
              color: '#ffffff',
              duration: 0.45,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: el,
                start: 'top 78%',
                toggleActions: 'play reverse play reverse'
              }
            }
          )
        }

        if (body) {
          gsap.fromTo(
            body,
            { x: -30, opacity: 0.2 },
            {
              x: 0,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                end: 'top 55%',
                scrub: 0.5,
              }
            }
          )
        }
      })

      // 8. About section lede & facts
      gsap.fromTo(
        '.about-lede',
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.about-lede', start: 'top 85%' }
        }
      )

      gsap.utils.toArray<HTMLElement>('.fact-item').forEach((el, i) => {
        gsap.fromTo(
          el,
          { x: 35, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.55,
            delay: i * 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%' }
          }
        )
      })

      // 9. Contact typography scrub & button pop-in
      gsap.to('.contact-title', {
        x: -35,
        ease: 'none',
        scrollTrigger: {
          trigger: '#contact',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        }
      })

      gsap.utils.toArray<HTMLElement>('.contact-btn').forEach((btn, i) => {
        gsap.fromTo(
          btn,
          { y: 40, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            delay: i * 0.08,
            ease: 'back.out(1.5)',
            scrollTrigger: { trigger: '#contact', start: 'top 85%' }
          }
        )
      })
    })

    return () => mm.revert()
  }, [])

  /* ── Smooth Anchor Click Scrolling with Lenis ── */
  const handleAnchor = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href')
    if (href?.startsWith('#') && lenisRef.current) {
      e.preventDefault()
      if (href === '#top') {
        lenisRef.current.scrollTo(0, { duration: 1.4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
      } else {
        const target = document.querySelector(href)
        if (target) {
          lenisRef.current.scrollTo(target as HTMLElement, {
            offset: -70,
            duration: 1.3,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          })
        }
      }
    }
    setMenu(false)
  }, [])

  /* ── Smooth Scroll-to-top ── */
  const scrollToTop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, {
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  return (
    <>
      {intro && <Intro onDone={done} />}
      
      {/* Top scroll progress indicator line */}
      <div ref={progressBarRef} className="scroll-progress-bar" aria-hidden="true" />

      <header className={`nav ${navScrolled ? 'nav-scrolled' : ''}`}>
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
      
      {/* Floating Smooth Back-to-Top Button */}
      <button
        className={`back-to-top ${showTopBtn ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll back to top"
      >
        <ArrowUp size={18} />
        <span>TOP</span>
      </button>

      <VideoModal open={!!modal} title={modal?.title ?? ''} video={modal?.video} onClose={() => setModal(null)} />
    </>
  )
}
