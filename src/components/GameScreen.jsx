import { useState, useEffect, useRef } from 'react'
import Card from './Card'
import Modal from './Modal'
import StarField from './StarField'
import { createDeck } from '../utils/cardData'
import { calcMatchPoints, calcTimeBonus, saveHighScore } from '../utils/scoreUtils'
import { playFlip, playCorrect, playIncorrect, playTick, playWin, playLose, startBgMusic, stopBgMusic, pauseBgMusic, resumeBgMusic, resumeAudioCtx } from '../utils/audioUtils'

function MuteIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <line x1="23" y1="9" x2="17" y2="15"/>
      <line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
  )
}

function SoundIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>
  )
}

function QuitIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}

const TOTAL_TIME   = 30
const PEEK_SECONDS = 3

export default function GameScreen({ onWin, onLose, onMenu }) {
  const [cards,      setCards]      = useState(() => createDeck())
  const [flipped,    setFlipped]    = useState([])
  const [locked,     setLocked]     = useState(true)
  const [muted,      setMuted]      = useState(false)
  const [modal,      setModal]      = useState(null)
  const [timer,      setTimer]      = useState(TOTAL_TIME)
  const [timeUp,     setTimeUp]     = useState(false)
  const [score,      setScore]      = useState(0)
  const [combo,      setCombo]      = useState(0)
  const [comboToast, setComboToast] = useState(null)
  const [phase,      setPhase]      = useState('peek')
  const [peekCount,  setPeekCount]  = useState(PEEK_SECONDS)

  const matchCount = cards.filter(c => c.isMatched).length

  const [displayScore, setDisplayScore] = useState(0)
  const displayScoreRef = useRef(0)

  const mutedRef  = useRef(muted)
  const comboRef  = useRef(combo)
  const scoreRef  = useRef(score)

  useEffect(() => {
    const start = displayScoreRef.current
    const diff = score - start
    if (diff <= 0) return
    const steps = 16
    let step = 0
    const id = setInterval(() => {
      step++
      const val = step >= steps ? score : Math.round(start + (diff * step) / steps)
      displayScoreRef.current = val
      setDisplayScore(val)
      if (step >= steps) clearInterval(id)
    }, 350 / steps)
    return () => clearInterval(id)
  }, [score])

  useEffect(() => { mutedRef.current = muted }, [muted])
  useEffect(() => { comboRef.current = combo }, [combo])
  useEffect(() => { scoreRef.current = score }, [score])

  useEffect(() => {
    if (phase !== 'peek') return
    setCards(prev => prev.map(c => ({ ...c, isFlipped: true })))
    let count = PEEK_SECONDS
    const id = setInterval(() => {
      count--
      setPeekCount(count)
      if (count <= 0) {
        clearInterval(id)
        setCards(prev => prev.map(c => ({ ...c, isFlipped: false })))
        setTimeout(() => { setPhase('playing'); setLocked(false) }, 650)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [phase])

  useEffect(() => {
    startBgMusic()
    return () => stopBgMusic()
  }, [])

  useEffect(() => {
    if (muted) pauseBgMusic()
    else resumeBgMusic()
  }, [muted])

  useEffect(() => {
    if (phase !== 'playing' || timeUp) return
    const id = setInterval(() => {
      setTimer(prev => {
        const next = prev - 1
        if (next <= 10 && next > 0 && !mutedRef.current) playTick()
        if (next <= 0) { clearInterval(id); setTimeUp(true); return 0 }
        return next
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase, timeUp])

  useEffect(() => {
    if (timeUp) {
      stopBgMusic()
      setTimeout(() => { if (!mutedRef.current) playLose() }, 100)
      saveHighScore(scoreRef.current)
      setTimeout(() => onLose(scoreRef.current), 700)
    }
  }, [timeUp])

  function handleQuit() {
    stopBgMusic()
    onMenu()
  }

  function handleCardClick(card) {
    resumeAudioCtx()
    if (locked || timeUp) return
    if (!mutedRef.current) playFlip()

    setCards(prev => prev.map(c => c.uid === card.uid ? { ...c, isFlipped: true } : c))
    const newFlipped = [...flipped, card.uid]
    setFlipped(newFlipped)
    if (newFlipped.length < 2) return
    setLocked(true)

    setTimeout(() => {
      setCards(prev => {
        const first = prev.find(c => c.uid === newFlipped[0])
        const isMatch = first && first.id === card.id

        if (isMatch) {
          if (!mutedRef.current) playCorrect()
          setModal('match')
          const pts = calcMatchPoints(comboRef.current)
          const newCombo = comboRef.current + 1
          setScore(s => s + pts)
          setCombo(newCombo)
          const updated = prev.map(c =>
            newFlipped.includes(c.uid) ? { ...c, isFlipped: false, isMatched: true } : c
          )
          const allMatched = updated.every(c => c.isMatched)
          setTimeout(() => {
            setModal(null); setFlipped([]); setLocked(false)
            if (newCombo >= 2) {
              setComboToast({ pts, multi: newCombo })
              setTimeout(() => setComboToast(null), 1200)
            }
            if (allMatched) {
              stopBgMusic()
              if (!mutedRef.current) playWin()
              const bonus = calcTimeBonus(timer)
              const finalScore = scoreRef.current + bonus
              saveHighScore(finalScore)
              setTimeout(() => onWin(finalScore, timer), 400)
            }
          }, 750)
          return updated
        } else {
          if (!mutedRef.current) playIncorrect()
          setModal('nomatch')
          setCombo(0)
          setTimeout(() => {
            setModal(null)
            setCards(c => c.map(x => newFlipped.includes(x.uid) ? { ...x, isFlipped: false } : x))
            setFlipped([]); setLocked(false)
          }, 1500)
          return prev
        }
      })
    }, 560)
  }

  const timerPct = (timer / TOTAL_TIME) * 100

  return (
    <div
      className="relative w-full h-screen flex flex-col overflow-hidden"
      style={{ background: '#050510' }}
    >
      <StarField />

      <div
        className="relative z-10 w-full flex flex-col px-6"
        style={{ paddingTop: 'clamp(40px, 6vh, 70px)', maxWidth: '800px', margin: '0 auto', width: '100%' }}
      >
        <div className="w-full rounded-full mb-2" style={{ height: '6px', background: '#0f1f2f' }}>
          <div
            className="h-full rounded-full transition-[width] duration-[980ms] linear"
            style={{ width: `${timerPct}%`, background: 'linear-gradient(90deg, #00d4ff, #7c4dff)' }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="font-display font-bold tabular-nums" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', color: '#00d4ff' }}>
            {String(timer).padStart(2, '0')}s
          </span>

          <div className="text-center px-4 py-2 rounded-xl" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <p className="font-body text-xs tracking-widest uppercase" style={{ color: '#334455' }}>Score</p>
            <p className="font-display font-bold tabular-nums" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: '#00d4ff' }}>
              {displayScore.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center" style={{ gap: 'clamp(6px, 1.5vw, 12px)' }}>
            {[0,1,2,3].map(i => (
              <div key={i} className="rounded-full transition-all duration-300" style={{
                width: 'clamp(10px, 2vw, 14px)',
                height: 'clamp(10px, 2vw, 14px)',
                background: i < matchCount ? '#00d4ff' : '#0f1f2f',
                boxShadow: i < matchCount ? '0 0 8px #00d4ff' : 'none',
              }} />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted(m => !m)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: muted ? '#2a3a4a' : '#00d4ff' }}
            >
              {muted ? <MuteIcon /> : <SoundIcon />}
            </button>
            <button
              onClick={handleQuit}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: '#2a3a4a' }}
            >
              <QuitIcon />
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center w-full px-6" style={{ paddingBottom: 'clamp(16px, 4vh, 40px)' }}>
        <div
          className="grid grid-cols-4 w-full"
          style={{ gap: 'clamp(8px, 2vw, 20px)', maxWidth: 'min(90vh, 700px)' }}
        >
          {cards.map(card => (
            <Card
              key={card.uid}
              card={card}
              onClick={handleCardClick}
              disabled={locked || timeUp || card.isMatched}
            />
          ))}
        </div>
      </div>

      {phase === 'peek' && peekCount > 0 && (
        <div key={peekCount} className="absolute inset-x-0 flex justify-center pointer-events-none z-30" style={{ top: '55%', transform: 'translateY(-50%)' }}>
          <div style={{ animation: 'peekToast 0.95s ease-out forwards', textAlign: 'center' }}>
            <p className="font-display font-black" style={{
              fontSize: 'clamp(1.4rem, 4vw, 2rem)',
              color: '#00d4ff',
              textShadow: '0 0 24px #00d4ffbb',
              letterSpacing: '0.08em',
            }}>
              Memorize!
            </p>
            <p className="font-display font-black" style={{
              fontSize: 'clamp(3.5rem, 10vw, 5rem)',
              color: '#00d4ff',
              textShadow: '0 0 40px #00d4ff, 0 0 80px #00d4ff55',
              lineHeight: 1,
            }}>
              {peekCount}
            </p>
          </div>
        </div>
      )}

      {comboToast && (
        <div className="absolute inset-x-0 flex justify-center pointer-events-none z-30" style={{ top: '40%' }}>
          <div style={{ animation: 'comboToast 1.2s ease-out forwards' }}>
            <p className="font-display font-black text-center" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: '#FFD700', textShadow: '0 0 20px #FFD70088' }}>
              🔥 ×{comboToast.multi} COMBO
            </p>
            <p className="font-display text-base text-center" style={{ color: '#FFD70099' }}>
              +{comboToast.pts} pts
            </p>
          </div>
        </div>
      )}

      {modal && <Modal type={modal} />}

      <style>{`
        @keyframes peekToast {
          0%   { opacity: 0; transform: scale(0.5); }
          12%  { opacity: 1; transform: scale(1.2); }
          28%  { transform: scale(1); }
          68%  { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.85); }
        }
        @keyframes comboToast {
          0%   { opacity: 0; transform: translateY(10px) scale(0.8); }
          20%  { opacity: 1; transform: translateY(-20px) scale(1.1); }
          70%  { opacity: 1; transform: translateY(-30px) scale(1); }
          100% { opacity: 0; transform: translateY(-60px) scale(0.9); }
        }
      `}</style>
    </div>
  )
}