import { useEffect, useState } from 'react'
const calc = (t) => {
  const ms = Math.max(0, new Date(t).getTime() - Date.now()); const s = Math.floor(ms / 1000)
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60, done: ms === 0 }
}
const same = (a, b) => a.d === b.d && a.h === b.h && a.m === b.m && a.s === b.s && a.done === b.done
export default function useCountdown(target) {
  const [v, setV] = useState(() => calc(target))
  useEffect(() => {
    // Always derived from the real clock (never decremented), so background tabs and sleeping phones stay exact.
    const tick = () => setV((prev) => { const n = calc(target); return same(prev, n) ? prev : n })
    tick()
    const id = setInterval(tick, 250)
    document.addEventListener('visibilitychange', tick)
    window.addEventListener('focus', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
      window.removeEventListener('focus', tick)
    }
  }, [target])
  return v
}
