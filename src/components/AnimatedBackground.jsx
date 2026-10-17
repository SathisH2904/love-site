import { useEffect, useRef } from 'react'
import useReducedMotion from '../hooks/useReducedMotion'

const COLORS = ['#FF2D96', '#FF9BCB', '#E7B6D8', '#ff5d8f']
const rnd = (a, b) => a + Math.random() * (b - a)

function heart(c, x, y, s) {
  c.beginPath(); c.moveTo(x, y + s * 0.3)
  c.bezierCurveTo(x, y - s * 0.3, x - s, y - s * 0.3, x - s, y + s * 0.1)
  c.bezierCurveTo(x - s, y + s * 0.6, x, y + s * 0.8, x, y + s * 1.1)
  c.bezierCurveTo(x, y + s * 0.8, x + s, y + s * 0.6, x + s, y + s * 0.1)
  c.bezierCurveTo(x + s, y - s * 0.3, x, y - s * 0.3, x, y + s * 0.3); c.fill()
}
function make(w, h, type, anywhere = true) {
  const t = type
  return {
    t, x: rnd(0, w), y: anywhere ? rnd(0, h) : h + 20,
    s: t === 'star' ? rnd(0.5, 1.5) : t === 'streak' ? rnd(14, 30) : rnd(4, 9),
    vx: t === 'star' ? 0 : t === 'streak' ? 0 : rnd(-0.25, 0.25),
    vy: t === 'star' ? 0 : t === 'streak' ? -rnd(0.8, 1.6) : t === 'heart' ? -rnd(0.15, 0.5) : rnd(0.15, 0.5),
    a: rnd(0.3, 0.9), r: rnd(0, 6.28), vr: rnd(-0.01, 0.01), ph: rnd(0, 6.28),
    col: t === 'spark' ? '#FFD76A' : COLORS[(Math.random() * COLORS.length) | 0],
  }
}

export default function AnimatedBackground({ light = false }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const cv = ref.current, c = cv.getContext('2d'); let raf, ps = [], w = 0, h = 0
    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth; h = window.innerHeight
      cv.width = w * dpr; cv.height = h * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0)
      const k = Math.min(1, (w * h) / 900000) * (reduced || light ? 0.45 : 1)
      const n = (base) => Math.max(4, Math.round(base * k))
      ps = [
        ...Array.from({ length: n(90) }, () => make(w, h, 'star')),
        ...Array.from({ length: n(14) }, () => make(w, h, 'heart')),
        ...Array.from({ length: n(26) }, () => make(w, h, 'petal')),
        ...Array.from({ length: n(10) }, () => make(w, h, 'spark')),
        ...Array.from({ length: n(8) }, () => make(w, h, 'streak')),
      ]
    }
    let last = 0
    const tick = (time) => {
      raf = requestAnimationFrame(tick)
      if (time - last < 33) return // ~30fps is plenty for slow drifting particles
      last = time
      c.clearRect(0, 0, w, h)
      for (const p of ps) {
        const sp = reduced ? 0.4 : 1
        p.x += p.vx * sp; p.y += p.vy * sp; p.r += p.vr * sp
        if (p.y < -40 || p.y > h + 40 || p.x < -40 || p.x > w + 40) {
          Object.assign(p, make(w, h, p.t, false)); if (p.vy > 0) p.y = -20
        }
        const tw = p.t === 'star' || p.t === 'spark' ? 0.5 + 0.5 * Math.sin(time / 700 + p.ph) : 1
        c.globalAlpha = p.a * tw; c.fillStyle = p.col
        if (p.t === 'star' || p.t === 'spark') {
          c.fillStyle = p.t === 'star' ? '#FFF5FB' : p.col
          c.beginPath(); c.arc(p.x, p.y, p.s * (p.t === 'spark' ? 1.6 : 1), 0, 6.28); c.fill()
        } else if (p.t === 'streak') {
          const g = c.createLinearGradient(p.x, p.y, p.x, p.y + p.s * 2)
          g.addColorStop(0, '#FF2D96'); g.addColorStop(1, 'rgba(255,45,150,0)')
          c.fillStyle = g; c.fillRect(p.x, p.y, 2, p.s * 2)
        } else {
          c.save(); c.translate(p.x, p.y); c.rotate(p.r)
          if (p.t === 'heart') heart(c, 0, -p.s / 2, p.s)
          else { c.beginPath(); c.ellipse(0, 0, p.s * 0.55, p.s, 0, 0, 6.28); c.fill() }
          c.restore()
        }
      }
      c.globalAlpha = 1
    }
    init(); raf = requestAnimationFrame(tick)
    window.addEventListener('resize', init)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', init) }
  }, [reduced, light])
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-glow" />
      <canvas ref={ref} className="bg-canvas" />
    </div>
  )
}
