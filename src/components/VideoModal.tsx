import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { VideoSource } from '../data/site'

export function embedUrl(v: VideoSource) {
  if (v.type === 'youtube') {
    const id = v.src.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1] ?? v.src
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
  }
  if (v.type === 'vimeo') return `https://player.vimeo.com/video/${v.src.match(/(\d{6,})/)?.[1] ?? v.src}?autoplay=1`
  return v.src
}

type Props = { open: boolean; title: string; video?: VideoSource | null; onClose: () => void }

export function VideoModal({ open, title, video, onClose }: Props) {
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    box.current?.querySelector<HTMLElement>('button')?.focus()
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab' || !box.current) return
      const f = box.current.querySelectorAll<HTMLElement>('button,[href],video,iframe,[tabindex]:not([tabindex="-1"])')
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus() }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div ref={box} className="modal-box" role="dialog" aria-modal="true" aria-label={title}
            initial={{ y: 40, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.98 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-bar"><span className="modal-title">{title}</span>
              <button className="icon-btn" onClick={onClose} aria-label="Close video"><X size={22} /></button></div>
            <div className="modal-stage">
              {!video ? (
                <p className="modal-empty">No video connected yet.<br /><span>Add a YouTube, Vimeo or MP4 source in <code>src/data/site.ts</code>.</span></p>
              ) : video.type === 'mp4' ? (
                <video src={video.src} controls autoPlay playsInline />
              ) : (
                <iframe src={embedUrl(video)} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
