import { motion } from 'motion/react'
import GlassCard from './GlassCard'
import { text } from '../data/content'

export default function Promises({ onNext }) {
  const n = text.promises.length
  return (
    <GlassCard className="card-md">
      <h2 className="script lg glow">{text.promisesTitle}</h2>
      <ol className="promises">
        {text.promises.map((p, i) => (
          <motion.li key={i} initial={{ opacity: 0, x: i % 2 ? 30 : -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 1.1, duration: 0.8 }}>
            <span className="pnum">{i + 1}</span><span>{p}</span>
          </motion.li>
        ))}
      </ol>
      <motion.button className="btn pink" onClick={onNext} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + n * 1.1 + 0.3 }} whileTap={{ scale: 0.95 }}>Open my letter 💌</motion.button>
    </GlassCard>
  )
}
