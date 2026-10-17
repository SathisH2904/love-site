// ===== Central configuration: edit everything here =====

// ---- COUNTDOWN TIME ----------------------------------------------------
// Option A (testing):  countdownMinutes: 2  -> goes to the home page after 2 minutes
//                      (timer starts on first open and survives page refresh)
// Option B (real day): countdownMinutes: 0  and set targetDate to the exact moment,
//                      e.g. '2026-10-16T00:00:00'  (your local time)
// Quick override without editing code: open the site with  ?mins=5  at the end of the URL.
const SETTINGS = {
  countdownMinutes: 0,
  targetDate: '2026-10-18T00:00:00',
}

function resolveTarget() {
  let mins = SETTINGS.countdownMinutes
  try {
    const q = new URLSearchParams(window.location.search)
    if (q.get('mins')) mins = Number(q.get('mins'))
  } catch { /* ignore */ }
  if (!mins || mins < 0) return new Date(SETTINGS.targetDate)

  const KEY = 'love-countdown-2'
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) || 'null')
    if (saved && saved.mins === mins && Number.isFinite(saved.target)) return new Date(saved.target)
  } catch { /* ignore */ }
  const target = Date.now() + mins * 60 * 1000
  try { sessionStorage.setItem(KEY, JSON.stringify({ mins, target })) } catch { /* ignore */ }
  return new Date(target)
}

export const config = {
  name: 'Thangoo',
  targetDate: resolveTarget(),
  // The day you two met -> drives the live "together since" counter. Set to June 10, 2024.
  metDate: new Date('2024-06-10T00:00:00'),
  // No skipping the countdown: the surprise stays locked until the time is up.
  previewMode: false,
  audioSrc: '/audio/romantic-music.mp3',
  // true = wrong answers must be retried; false = wrong answers move on after the popup
  retryWrongAnswers: true,
}

export const text = {
  countdownTitle: 'Something special is waiting for you...',
  countdownHint: 'Stay right here, my love. It opens by itself the moment time is up ❤️',
  countdownOpening: 'Here it comes... 💖',
  greetingTitle: 'Happy Birthday',
  greetingName: `${config.name} ❤️`,
  greetingLines: [
    'Today the world got its most beautiful gift,',
    'and I got the luckiest seat in your life.',
    'Every smile of yours is my favourite sunrise.',
  ],
  // Rotates under the title on the home page
  wishes: [
    'May every dream you hold close come running to you 🌸',
    'You are my peace, my laughter, my home 🏡',
    'I fall for you a little more with every sunrise 🌅',
    'Your smile is the reason my days feel like magic ✨',
    'Whatever tomorrow brings, I choose you. Always. 💍',
    'You make the whole world softer just by being in it 🦋',
  ],
  wishTitle: 'Make a wish, my love',
  wishHint: 'Close your eyes, think of your dream, then blow out the candles 🕯️',
  wishDone: 'Your wish is in the stars now. I will spend my life helping it come true ✨',
  togetherTitle: 'Since the day I met you',
  togetherSub: 'Every second of it, I would choose again.',
  reasonsTitle: 'Reasons I love you',
  reasonsHint: 'Tap the heart 💗',
  reasons: [
    'The way you laugh at your own jokes before you finish them',
    'You make me feel safe, even when the world is loud',
    'Your care shows in the smallest things you do',
    'You believe in me more than I believe in myself',
    'Your smile fixes my worst days in one second',
    'You stayed, every single time it was hard',
    'With you, even silence feels like home',
    'Because you are simply you, and that is my favourite thing',
  ],
  promisesTitle: 'My promises to you',
  promises: [
    'I will hold your hand, in every season of life',
    'I will choose you, on the good days and the bad days',
    'I will make you laugh when you want to cry',
    'I will listen, even to the things you do not say',
    'I will love you more tomorrow than I do today',
  ],
  proposalTitle: 'Will you marry me? 💍',
  proposalSub: 'Be my forever, Thangoo ❤️',
  proposalTease: [
    '',
    'Hehe, that button is shy 😜',
    'Nice try! It only wants to say yes 💕',
    'You cannot catch it, my love 🙈',
    'Only one answer works here 😘',
  ],
  proposalYes: 'She said yes! 🎉 You just made me the happiest person alive 💖',
  letterTitle: 'A little letter for you...',
  letterGreeting: `Dear ${config.name},`,
  letterDate: 'Since the day I met you',
  letterSign: 'Yours forever,',
  letterBody: [
    "Ever since I met you, my world quietly changed, and I still remember that day. I never imagined one person could become my whole world.",
    'Since I met you, you have been my best friend, my comfort, my home and my biggest reason to smile. Through every laugh, every fight, every silence and every late-night talk, you stayed, and I fall in love with you again every single day.',
    'Thank you for loving me even at my worst, for believing in me, and for making the most ordinary days feel like a celebration.',
    'On your birthday, I wish you endless happiness, peace in your heart and every dream you hold coming true. You deserve all the love this world has, and I promise to give you mine, today and on every birthday to come.',
    'Here is to every beautiful day since I met you, and to forever together.',
    `Happy Birthday, my ${config.name}. I love you, always. ❤️`,
  ],
}
