import { motion } from 'motion/react'
// `framed` = the glass card look (countdown only). Everything else floats freely on the background.
export default function GlassCard({ children, className = '', framed = false, ...rest }) {
  return (
    <motion.section
      className={`${framed ? 'glass' : 'glass free'} ${className}`}
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      {...rest}
    >{children}</motion.section>
  )
}
