import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import GlassCard from './GlassCard'
import useCountdown from '../hooks/useCountdown'
import { config, text } from '../data/content'
const p = (n) => String(n).padStart(2, '0')

function Unit({ value, label }) {
  return (
    <div className="unit">
      <div className="unit-num">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={value} initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }} transition={{ duration: 0.25 }}>
            {p(value)}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="unit-label">{label}</span>
    </div>
  )
}

export default function Countdown({ onDone }) {
  const { d, h, m, s, done } = useCountdown(config.targetDate)
  // Let the "opening" moment breathe, then glide to the home page on its own.
  useEffect(() => {
    if (!done) return
    const id = setTimeout(onDone, 1800)
    return () => clearTimeout(id)
  }, [done, onDone])
  return (
    <GlassCard framed className="card-md pulse">
      <motion.div className="bigheart beat" animate={done ? { scale: [1, 1.6, 1.2] } : {}}>💖</motion.div>
      <h2 className="script sm glow">{done ? text.countdownOpening : text.countdownTitle}</h2>
      <div className="units" role="timer" aria-live="off">
        {d > 0 && <Unit value={d} label="Days" />}
        <Unit value={h} label="Hours" />
        <Unit value={m} label="Minutes" />
        <Unit value={s} label="Seconds" />
      </div>
      <p className="hint">{done ? 'Opening your surprise...' : text.countdownHint}</p>
    </GlassCard>
  )
}
