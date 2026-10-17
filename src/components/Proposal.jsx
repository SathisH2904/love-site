import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import GlassCard from './GlassCard'
import { text } from '../data/content'

const NO_TEXT = ['No 🥺', 'Try catching me 😜', 'Are you sure? 🥹', 'Please? 💗', 'Think again 💕']

export default function Proposal({ onNext }) {
  const [yes, setYes] = useState(false)
  const [tries, setTries] = useState(0)
  const [pos, setPos] = useState(null) // viewport position of the runaway "No" button
  const slot = useRef(null)
  const btn = useRef(null)

  // Run away to a random spot anywhere on screen, staying clear of the Yes button.
  const dodge = () => {
    const bw = btn.current?.offsetWidth || 130, bh = btn.current?.offsetHeight || 46
    const pad = 12
    const maxX = Math.max(pad, window.innerWidth - bw - pad)
    const maxY = Math.max(pad, window.innerHeight - bh - pad)
    // Yes keeps growing with every try (and is mid-animation), so keep well clear of where it WILL be,
    // otherwise the runaway No can land on top of Yes and swallow the click.
    const yes = document.getElementById('yes-btn')
    const yr = yes?.getBoundingClientRect()
    const grow = 1 + Math.min(tries + 1, 6) * 0.14
    const cx = yr ? yr.left + yr.width / 2 : -999, cy = yr ? yr.top + yr.height / 2 : -999
    const hw = yes ? (yes.offsetWidth * grow) / 2 + 40 : 0
    const hh = yes ? (yes.offsetHeight * grow) / 2 + 40 : 0
    let x = pad, y = pad, best = -1
    for (let k = 0; k < 30; k++) {
      const nx = pad + Math.random() * (maxX - pad)
      const ny = pad + Math.random() * (maxY - pad)
      const dx = Math.max(0, Math.abs(nx + bw / 2 - cx) - (bw / 2 + hw))
      const dy = Math.max(0, Math.abs(ny + bh / 2 - cy) - (bh / 2 + hh))
      const clear = Math.max(dx, dy)
      if (clear > best) { best = clear; x = nx; y = ny }
      if (clear > 0) break
    }
    setPos({ x, y })
    setTries((v) => v + 1)
  }
  // Start at its own slot in the row, so the first jump animates out of the card.
  const start = () => {
    const r = slot.current?.getBoundingClientRect()
    if (r && !pos) setPos({ x: r.left, y: r.top, first: true })
  }
  const grab = (e) => { e.preventDefault?.(); if (!pos) { start(); requestAnimationFrame(dodge) } else dodge() }

  useEffect(() => {
    if (!pos) return
    const onResize = () => setPos((p) => p && ({ x: Math.min(p.x, window.innerWidth - 150), y: Math.min(p.y, window.innerHeight - 60) }))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [pos])

  if (yes) return (
    <GlassCard className="card-md pulse">
      {Array.from({ length: 22 }, (_, i) => (
        <span key={i} className="burst" style={{ left: `${(i * 7 + 5) % 100}%`, animationDelay: `${i * 0.15}s` }}>{['💖', '✨', '💍', '🌹'][i % 4]}</span>
      ))}
      <motion.div className="bigheart" initial={{ scale: 0 }} animate={{ scale: [0, 1.5, 1] }} transition={{ duration: 0.8 }}><span className="beat" style={{ display: 'inline-block' }}>💖</span></motion.div>
      <h2 className="script lg glow">{text.proposalYes}</h2>
      <button className="btn pink big" onClick={onNext}>Take the Love Quiz 💕</button>
    </GlassCard>
  )

  const noLabel = NO_TEXT[tries % NO_TEXT.length]
  const runaway = pos && createPortal(
    <motion.button ref={btn} className="btn soft runaway" aria-label="No"
      initial={pos.first ? { left: pos.x, top: pos.y } : false} animate={{ left: pos.x, top: pos.y }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      onPointerEnter={dodge} onPointerDown={grab} onTouchStart={grab} onFocus={dodge} onClick={grab}>
      {noLabel}
    </motion.button>,
    document.body,
  )

  return (
    <GlassCard className="card-md pulse">
      <div className="bigheart beat">💖</div>
      <h2 className="script lg glow">{text.proposalTitle}</h2>
      <p className="hint">{text.proposalSub}</p>
      <div className="row">
        <motion.button id="yes-btn" className="btn pink" animate={{ scale: 1 + Math.min(tries, 6) * 0.14 }} onClick={() => setYes(true)} whileTap={{ scale: 0.95 }}>Yes 💖</motion.button>
        {/* Placeholder keeps the layout stable once the real No button starts running around */}
        <span ref={slot} className="no-slot">
          {!pos && (
            <button ref={btn} className="btn soft" onPointerEnter={grab} onPointerDown={grab} onTouchStart={grab} onFocus={grab} onClick={grab}>{noLabel}</button>
          )}
        </span>
      </div>
      <p className="tease" aria-live="polite">{text.proposalTease[Math.min(tries, text.proposalTease.length - 1)]}</p>
      {runaway}
    </GlassCard>
  )
}
