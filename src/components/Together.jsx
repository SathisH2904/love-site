import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import GlassCard from './GlassCard'
import { config, text } from '../data/content'

// Calendar difference (years / months / days) plus a ticking hh:mm:ss
function since(from, now) {
  let y = now.getFullYear() - from.getFullYear()
  let m = now.getMonth() - from.getMonth()
  let d = now.getDate() - from.getDate()
  if (d < 0) { m -= 1; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate() }
  if (m < 0) { y -= 1; m += 12 }
  const s = Math.floor((now - from) / 1000)
  return { y: Math.max(y, 0), m, d, h: Math.floor(s / 3600) % 24, mi: Math.floor(s / 60) % 60, s: s % 60 }
}
const pad = (n) => String(n).padStart(2, '0')

export default function Together({ onNext }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id) }, [])
  const t = since(config.metDate, now)
  const days = Math.floor((now - config.metDate) / 86400000)
  const big = [['Years', t.y], ['Months', t.m], ['Days', t.d]]
  const small = [['Hours', pad(t.h)], ['Minutes', pad(t.mi)], ['Seconds', pad(t.s)]]
  return (
    <GlassCard className="card-md together">
      <div className="orbit" aria-hidden="true">
        <i /><i /><i />
        <motion.span className="orbit-heart beat" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 9 }}>💞</motion.span>
      </div>
      <p className="eyebrow">Together</p>
      <h2 className="script lg glow">{text.togetherTitle}</h2>
      <div className="tg-big">
        {big.map(([label, v], i) => (
          <motion.div key={label} className="tg-card" initial={{ opacity: 0, y: 18, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.3 + i * 0.15 }}>
            <b>{v}</b><span>{label}</span>
          </motion.div>
        ))}
      </div>
      <div className="tg-small">
        {small.map(([label, v], i) => (
          <motion.div key={label} className="tg-pill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + i * 0.12 }}>
            <b>{v}</b><span>{label}</span>
          </motion.div>
        ))}
      </div>
      <motion.p className="total" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>That is <b>{days.toLocaleString()}</b> days of loving you ❤️</motion.p>
      <p className="hint">{text.togetherSub}</p>
      <motion.button className="btn pink" onClick={onNext} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} whileTap={{ scale: 0.95 }}>Continue 💕</motion.button>
    </GlassCard>
  )
}
