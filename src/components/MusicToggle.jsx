import { useRef, useState } from 'react'
import { Music, VolumeX } from 'lucide-react'
import { config } from '../data/content'
export default function MusicToggle() {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  const [missing, setMissing] = useState(false)
  const toggle = async () => {
    const a = ref.current; if (!a) return
    if (on) { a.pause(); setOn(false); return }
    try { await a.play(); setOn(true) } catch { setMissing(true); setOn(false) }
  }
  return (
    <>
      <audio ref={ref} src={config.audioSrc} loop preload="none" onError={() => setMissing(true)} />
      <button className={`music ${on ? 'on' : ''}`} onClick={toggle} aria-pressed={on}
        aria-label={on ? 'Pause music' : 'Play music'}
        title={missing ? 'Add public/audio/romantic-music.mp3 to enable music' : on ? 'Pause music' : 'Play music'}>
        {missing ? <VolumeX size={16} /> : <Music size={16} />}
      </button>
    </>
  )
}
