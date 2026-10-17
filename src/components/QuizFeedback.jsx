import { motion } from 'motion/react'
export default function QuizFeedback({ correct, onContinue }) {
  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="alertdialog" aria-live="assertive">
      <motion.div className="fb-face" initial={{ scale: 0.3, rotate: -15 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 12 }}>
        {correct ? '🧸' : '🥹'}
      </motion.div>
      <p className={correct ? 'ok' : 'bad'}>{correct ? 'Correct Answer! 💖' : 'Answer Wrong! 🥹'}</p>
      <button className="btn pink" onClick={onContinue} autoFocus>Continue 💕</button>
    </motion.div>
  )
}
