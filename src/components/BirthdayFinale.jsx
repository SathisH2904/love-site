import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { config, text } from '../data/content'

const COLORS = ['#FF2D96', '#FF9BCB', '#FFD76A', '#E7B6D8', '#ffffff', '#ff5d8f']
const EMOJI = ['💖', '🎈', '✨', '🌸', '🎉', '💕', '🦋', '🌹']

export default function BirthdayFinale({ onClose, onReplay }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setW((v) => (v + 1) % text.wishes.length), 3200)
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { clearInterval(id); window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose])

  const confetti = useMemo(() => Array.from({ length: 46 }, (_, i) => ({
    left: (i * 23 + 7) % 100, color: COLORS[i % COLORS.length], w: 6 + (i % 4) * 3, h: 10 + (i % 3) * 5,
    dur: 4 + (i % 7) * 0.6, delay: (i % 12) * 0.35, round: i % 3 === 0,
  })), [])
  const rising = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    ch: EMOJI[i % EMOJI.length], left: (i * 31 + 4) % 96, size: 18 + (i * 5) % 20, dur: 6 + (i % 5), delay: (i * 0.5) % 5,
  })), [])

  const words = ['Happy', 'Birthday']
  return createPortal(
    <motion.div className="fin" role="dialog" aria-modal="true" aria-label="Happy Birthday"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <div className="fin-rings" aria-hidden="true"><i /><i /><i /></div>
      {confetti.map((c, i) => (
        <span key={i} className="confetti" aria-hidden="true"
          style={{ left: `${c.left}%`, width: c.w, height: c.h, background: c.color, borderRadius: c.round ? '50%' : 2, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }} />
      ))}
      {rising.map((r, i) => (
        <span key={i} className="floater fin-float" aria-hidden="true" style={{ left: `${r.left}%`, fontSize: r.size, animationDuration: `${r.dur}s`, animationDelay: `${r.delay}s` }}>{r.ch}</span>
      ))}

      <div className="fin-body">
        <motion.div className="fin-cake" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 10, delay: 0.3 }}>🎂</motion.div>

        {words.map((word, wi) => (
          <div key={wi} className="fin-word" aria-hidden={wi > 0}>
            {[...word].map((ch, ci) => (
              <motion.span key={ci} className="greet-ch fin-ch" initial={{ opacity: 0, y: 60, scale: 0.2, rotate: ci % 2 ? 25 : -25 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 11, delay: 0.7 + (wi * 5 + ci) * 0.09 }}>{ch}</motion.span>
            ))}
          </div>
        ))}

        <motion.div className="fin-name" initial={{ opacity: 0, scale: 0.4, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ delay: 1.9, duration: 1 }}>
          {config.name} <span className="beat" style={{ display: 'inline-block' }}>❤️</span>
        </motion.div>

        <div className="fin-wish">
          <AnimatePresence mode="wait">
            <motion.p key={w} initial={{ opacity: 0, y: 14, filter: 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(5px)' }} transition={{ duration: 0.5 }}>{text.wishes[w]}</motion.p>
          </AnimatePresence>
        </div>

        <motion.div className="fin-actions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6 }}>
          <button className="btn soft" onClick={onClose}>💌 Read letter again</button>
          <button className="btn pink" onClick={onReplay}>🔁 Love Loop</button>
        </motion.div>
      </div>
    </motion.div>,
    document.body,
  )
}
