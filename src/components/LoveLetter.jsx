import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import GlassCard from './GlassCard'
import BirthdayFinale from './BirthdayFinale'
import { text } from '../data/content'
const FULL = [text.letterGreeting, ...text.letterBody].join('\n\n')
export default function LoveLetter({ onReplay }) {
  const [open, setOpen] = useState(false)
  const [n, setN] = useState(0)
  const [finale, setFinale] = useState(false)
  const done = n >= FULL.length
  useEffect(() => {
    if (!open || done) return
    const id = setTimeout(() => setN((v) => v + 1), 38)
    return () => clearTimeout(id)
  }, [open, n, done])
  // The paper grows as the letter is written; keep the newest line in view
  useEffect(() => { if (open && (n % 10 === 0 || done)) window.scrollTo(0, document.documentElement.scrollHeight) }, [open, n, done])

  // Finale shows on its own, without the letter behind it. "Read letter again" brings the letter back.
  if (finale) return <AnimatePresence><BirthdayFinale key="fin" onClose={() => setFinale(false)} onReplay={onReplay} /></AnimatePresence>

  if (!open) return (
    <GlassCard className="card-sm">
      <h2 className="script sm glow">{text.letterTitle}</h2>
      <motion.button className="envelope" onClick={() => setOpen(true)} aria-label="Open the letter" whileHover={{ scale: 1.05, rotate: -2 }} whileTap={{ scale: 0.96 }}>
        <span className="env-flap" /><span className="env-seal">❤</span>
      </motion.button>
      <p className="hint">Tap the envelope to open it 💌</p>
    </GlassCard>
  )
  return (
    <motion.section className="paper" initial={{ opacity: 0, scaleY: 0.1, y: 40 }} animate={{ opacity: 1, scaleY: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
      <div className="paper-bg" />
      <div className="paper-grain" />
      <div className="paper-date">{text.letterDate}</div>
      <div className="letter">
        {FULL.slice(0, n)}{!done && <span className="caret">|</span>}
        {done && <div className="sign"><span>{text.letterSign}</span><em>❤</em></div>}
      </div>
      <AnimatePresence>{done && (
        <motion.button className="btn pink" onClick={() => setFinale(true)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>🎉 Happy Birthday</motion.button>
      )}</AnimatePresence>
    </motion.section>
  )
}
