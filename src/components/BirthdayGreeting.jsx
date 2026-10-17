import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import GlassCard from './GlassCard'
import { config, text } from '../data/content'

const FLOATERS = ['🎈', '💖', '✨', '🌸', '🎉', '💕', '🦋']

export default function BirthdayGreeting({ onNext }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setW((v) => (v + 1) % text.wishes.length), 3400)
    return () => clearInterval(id)
  }, [])

  // Stable random-looking confetti that rises behind the card
  const floaters = useMemo(() => Array.from({ length: 16 }, (_, i) => ({
    ch: FLOATERS[i % FLOATERS.length],
    left: (i * 37 + 8) % 96,
    size: 16 + ((i * 7) % 18),
    dur: 7 + ((i * 5) % 6),
    delay: (i * 0.7) % 6,
  })), [])

  const words = text.greetingTitle.split(' ')
  const lineDelay = 1.9
  return (
    <GlassCard className="card-lg pulse greet">
      {floaters.map((f, i) => (
        <span key={i} className="floater" style={{ left: `${f.left}%`, fontSize: f.size, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} aria-hidden="true">{f.ch}</span>
      ))}

      <motion.div className="cake" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 11, delay: 0.2 }}>🎂</motion.div>

      <h1 className="greet-title" aria-label={`${text.greetingTitle} ${text.greetingName}`}>
        {words.map((word, wi) => (
          <span key={wi} className="greet-word">
            {[...word].map((ch, ci) => (
              <motion.span key={ci} className="greet-ch" initial={{ opacity: 0, y: 30, rotate: -12, scale: 0.4 }} animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.5 + (wi * 6 + ci) * 0.06 }}>{ch}</motion.span>
            ))}
          </span>
        ))}
      </h1>

      <motion.div className="greet-name" initial={{ opacity: 0, scale: 0.6, filter: 'blur(8px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ delay: 1.3, duration: 0.9 }}>
        {config.name} <span className="beat" style={{ display: 'inline-block' }}>❤️</span>
      </motion.div>

      <div className="lines">
        {text.greetingLines.map((l, i) => (
          <motion.p key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: lineDelay + i * 0.8, duration: 0.7 }}>{l}</motion.p>
        ))}
      </div>

      <motion.div className="wish" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: lineDelay + text.greetingLines.length * 0.8 }}>
        <AnimatePresence mode="wait">
          <motion.p key={w} initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }} transition={{ duration: 0.5 }}>
            {text.wishes[w]}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      <motion.button className="btn pink big" onClick={onNext} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: lineDelay + text.greetingLines.length * 0.8 + 0.4 }} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
        Make a wish 🎂
      </motion.button>
    </GlassCard>
  )
}
