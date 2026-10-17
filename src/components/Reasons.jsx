import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import GlassCard from './GlassCard'
import { text } from '../data/content'

export default function Reasons({ onNext }) {
  const [i, setI] = useState(-1)
  const [pops, setPops] = useState([])
  const lastTap = useRef(0)
  const total = text.reasons.length
  const done = i >= total - 1
  const tap = () => {
    if (done || performance.now() - lastTap.current < 750) return // ignore taps mid-transition so no reason is skipped unseen
    lastTap.current = performance.now()
    setI((v) => v + 1)
    const id = Date.now()
    const burst = Array.from({ length: 6 }, (_, k) => ({ id: id + k, x: (k - 2.5) * 26, c: ['💗', '💖', '💕'][k % 3] }))
    setPops((p) => [...p, ...burst])
    setTimeout(() => setPops((p) => p.filter((b) => b.id < id || b.id > id + 6)), 1400)
  }
  return (
    <GlassCard className="card-md">
      <h2 className="script lg glow">{text.reasonsTitle}</h2>
      <div className="heartwrap">
        <motion.button className="reason-heart" onClick={tap} aria-label="Reveal a reason" whileTap={{ scale: 0.85 }} animate={done ? {} : { scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}>💗</motion.button>
        {pops.map((b) => (
          <motion.span key={b.id} className="pop" initial={{ opacity: 1, y: 0, x: 0, scale: 0.6 }} animate={{ opacity: 0, y: -110, x: b.x, scale: 1.1 }} transition={{ duration: 1.3, ease: 'easeOut' }}>{b.c}</motion.span>
        ))}
      </div>
      <div className="reason-box">
        <AnimatePresence mode="wait">
          {i < 0
            ? <motion.p key="h" className="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{text.reasonsHint}</motion.p>
            : <motion.p key={i} className="reason" initial={{ opacity: 0, y: 14, filter: 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.45 }}>{text.reasons[i]}</motion.p>}
        </AnimatePresence>
      </div>
      <div className="dots" aria-hidden="true">{text.reasons.map((_, k) => <i key={k} className={k <= i ? 'on' : ''} />)}</div>
      {done && <motion.button className="btn pink" onClick={onNext} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileTap={{ scale: 0.95 }}>And one more thing... 💍</motion.button>}
    </GlassCard>
  )
}
