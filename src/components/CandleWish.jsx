import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import GlassCard from './GlassCard'
import { text } from '../data/content'

const N = 5
export default function CandleWish({ onNext }) {
  const [lit, setLit] = useState(() => Array(N).fill(true))
  const left = lit.filter(Boolean).length
  const done = left === 0
  const blow = (i) => setLit((l) => l.map((v, k) => (k === i ? false : v)))
  const blowAll = () => lit.forEach((v, i) => v && setTimeout(() => blow(i), i * 180))
  // Wish stars shoot up once every candle is out
  const stars = useMemo(() => Array.from({ length: 14 }, (_, i) => ({ x: (i - 7) * 22 + ((i * 13) % 17), d: 0.1 + (i % 7) * 0.12, s: 14 + (i % 4) * 5, c: ['✨', '⭐', '🌟', '💖'][i % 4] })), [])
  return (
    <GlassCard>
      <h2 className="script lg glow">{text.wishTitle}</h2>
      <div className="cakebox">
        <div className="cake-glow" style={{ opacity: 0.15 + (left / N) * 0.85 }} />
        <div className="candles">
          {lit.map((on, i) => (
            <button key={i} className="candle" onClick={() => blow(i)} disabled={!on} aria-label={`Blow candle ${i + 1}`}>
              <span className={`flame${on ? '' : ' out'}`} style={{ animationDelay: `${i * 0.17}s` }} />
              {!on && <span className="smoke" />}
            </button>
          ))}
        </div>
        <div className="tier t1"><i className="drip" /></div>
        <div className="tier t2"><i className="drip" /></div>
        <div className="cake-plate" />
        {done && stars.map((s, i) => (
          <motion.span key={i} className="wstar" style={{ fontSize: s.s }} aria-hidden="true"
            initial={{ opacity: 0, y: 20, x: 0 }} animate={{ opacity: [0, 1, 0], y: -170, x: s.x }} transition={{ duration: 2.2, delay: s.d, ease: 'easeOut' }}>{s.c}</motion.span>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="a" className="wish-actions" exit={{ opacity: 0 }}>
            <p className="hint">{text.wishHint}</p>
            <p className="hint">Tap each candle, or blow them all ({left} left)</p>
            <button className="btn pink big" onClick={blowAll}>Blow all the candles 🌬️</button>
          </motion.div>
        ) : (
          <motion.div key="b" className="wish-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <p className="wishdone">{text.wishDone}</p>
            <button className="btn pink" onClick={onNext}>Continue 💕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}
