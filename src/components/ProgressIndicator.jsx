import { motion } from 'motion/react'
export default function ProgressIndicator({ value, max }) {
  return (
    <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
      <motion.div className="progress-bar" animate={{ width: `${(value / max) * 100}%` }} transition={{ duration: 0.5 }} />
    </div>
  )
}
