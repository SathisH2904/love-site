import { useCallback, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import AnimatedBackground from './components/AnimatedBackground'
import MusicToggle from './components/MusicToggle'
import Countdown from './components/Countdown'
import BirthdayGreeting from './components/BirthdayGreeting'
import MemoryGarden from './components/MemoryGarden'
import Proposal from './components/Proposal'
import LoveQuiz from './components/LoveQuiz'
import LoveLetter from './components/LoveLetter'

import CandleWish from './components/CandleWish'
import Together from './components/Together'
import Reasons from './components/Reasons'
import Promises from './components/Promises'

const STAGES = ['countdown', 'greeting', 'wish', 'together', /* 'memories', */ 'reasons', 'proposal', 'quiz', 'promises', 'letter']
export default function App() {
  const [i, setI] = useState(0)
  const next = useCallback(() => setI((v) => Math.min(v + 1, STAGES.length - 1)), [])
  // Replay restarts from the home page (the countdown is a one-time lock)
  const replay = useCallback(() => setI(1), [])
  const s = STAGES[i]
  return (
    <>
      <AnimatedBackground light={s === 'letter'} />
      <MusicToggle />
      <main className="stage">
        <AnimatePresence mode="wait">
          {s === 'countdown' && <Countdown key={s} onDone={next} />}
          {s === 'greeting' && <BirthdayGreeting key={s} onNext={next} />}
          {s === 'wish' && <CandleWish key={s} onNext={next} />}
          {s === 'together' && <Together key={s} onNext={next} />}
          {s === 'reasons' && <Reasons key={s} onNext={next} />}
          {s === 'promises' && <Promises key={s} onNext={next} />}
          {/* s === 'memories' && <MemoryGarden key={s} onNext={next} /> */}
          {s === 'proposal' && <Proposal key={s} onNext={next} />}
          {s === 'quiz' && <LoveQuiz key={s} onNext={next} />}
          {s === 'letter' && <LoveLetter key={s} onReplay={replay} />}
        </AnimatePresence>
      </main>
    </>
  )
}
