import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import GlassCard from './GlassCard'
import { memories } from '../data/memories'

function Photo({ m, className }) {
  return (
    <div className={`m-photo ${className || ''}`}>
      {m.img ? <img src={m.img} alt={m.title} loading="lazy" /> : <span className="m-emoji">{m.emoji}</span>}
    </div>
  )
}

function Lightbox({ m, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose])
  // Portal: the glass card uses backdrop-filter, which would trap a fixed overlay inside the card.
  return createPortal(
    <motion.div className="lb-back" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="lb" role="dialog" aria-modal="true" aria-label={m.title} onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
        <button className="lb-close" onClick={onClose} aria-label="Close memory">✕</button>
        <Photo m={m} className="lb-photo" />
        <span className="lb-date">{m.date}</span>
        <h3 className="script lg glow">{m.title}</h3>
        <p className="lb-text">{m.text}</p>
        <button className="btn pink tiny" onClick={onClose}>Close 💕</button>
      </motion.div>
    </motion.div>,
    document.body,
  )
}

export default function MemoryGarden({ onNext }) {
  const [open, setOpen] = useState(null)
  const [seen, setSeen] = useState(() => new Set())
  const show = (i) => { setOpen(i); setSeen((s) => new Set(s).add(i)) }
  return (
    <GlassCard className="card-wall">
      <h2 className="script lg glow">Our Memory Wall 🦋</h2>
      <p className="hint" aria-live="polite">Tap a memory to open it · {seen.size}/{memories.length} opened</p>
      <ul className="wall">
        {memories.map((m, i) => (
          <motion.li key={i} initial={{ opacity: 0, y: 26, rotate: i % 2 ? 3 : -3 }} animate={{ opacity: 1, y: 0, rotate: i % 2 ? 1.6 : -1.6 }}
            transition={{ delay: 0.15 + i * 0.12, type: 'spring', stiffness: 140, damping: 16 }}>
            <motion.button className={`tile ${seen.has(i) ? 'seen' : ''}`} onClick={() => show(i)}
              whileHover={{ y: -6, rotate: 0, scale: 1.04 }} whileTap={{ scale: 0.97 }} aria-label={`Open memory: ${m.title}`}>
              <Photo m={m} />
              <span className="tile-title">{m.title}</span>
              <span className="tile-date">{seen.has(i) ? '💗 ' : ''}{m.date}</span>
            </motion.button>
          </motion.li>
        ))}
      </ul>
      <motion.button className="btn pink big" onClick={onNext} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 + memories.length * 0.12 }} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
        I Love You 💖
      </motion.button>
      <AnimatePresence>{open !== null && <Lightbox key="lb" m={memories[open]} onClose={() => setOpen(null)} />}</AnimatePresence>
    </GlassCard>
  )
}
