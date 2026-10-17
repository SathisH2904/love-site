import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import GlassCard from './GlassCard'
import QuizFeedback from './QuizFeedback'
import ProgressIndicator from './ProgressIndicator'
import { quizQuestions as Q } from '../data/quizQuestions'
import { config } from '../data/content'
export default function LoveQuiz({ onNext }) {
  const [i, setI] = useState(0)
  const [sel, setSel] = useState(null)
  const [fb, setFb] = useState(null) // null | {correct}
  const [finished, setFinished] = useState(false)
  const q = Q[i]
  const check = () => setFb({ correct: sel === q.answer })
  const advance = () => {
    const ok = fb.correct; setFb(null)
    if (!ok && config.retryWrongAnswers) { setSel(null); return }
    setSel(null)
    if (i + 1 >= Q.length) setFinished(true); else setI(i + 1)
  }
  if (finished) return (
    <GlassCard className="card-md pulse">
      <div className="bigheart beat">💞</div>
      <h2 className="script lg glow">You know us so well! 💕</h2>
      <p className="hint">Every answer proves how special you are to me.</p>
      <button className="btn pink big" onClick={onNext}>Open the Letter 💌</button>
    </GlassCard>
  )
  return (
    <GlassCard className="card-md quiz">
      <p className="hint">Love Quiz 💕 · Question {i + 1}/{Q.length}</p>
      <ProgressIndicator value={i + (fb?.correct ? 1 : 0)} max={Q.length} />
      <h2 className="qtext">{q.q}</h2>
      <div className="opts" role="radiogroup" aria-label={q.q}>
        {q.options.map((o, k) => (
          <motion.button key={`${i}-${k}`} role="radio" aria-checked={sel === k} className={`opt ${sel === k ? 'sel' : ''}`}
            onClick={() => setSel(k)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{o}</motion.button>
        ))}
      </div>
      {sel !== null && <motion.button className="btn pink" onClick={check} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Continue 💖</motion.button>}
      <AnimatePresence>{fb && <QuizFeedback correct={fb.correct} onContinue={advance} />}</AnimatePresence>
    </GlassCard>
  )
}
