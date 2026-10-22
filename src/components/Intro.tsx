import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import logo from '../assets/logo.jpg'

// Full logo reveal in a single transition without splitting into separate parts
export function Intro({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { onDone(); return }
    const tl = gsap.timeline({ onComplete: onDone })
    tl.fromTo(
      imgRef.current,
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.inOut' }
    )
      .to(root.current, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, '+=0.45')
    return () => { tl.kill() }
  }, [onDone])

  return (
    <div className="intro" ref={root} role="presentation">
      <div className="intro-logo">
        <img ref={imgRef} className="intro-logo-img" src={logo} alt="CRAPP EDITS" />
      </div>
    </div>
  )
}
