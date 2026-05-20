import { useState, useEffect, useRef } from 'react'
import Card from './Card'
import Modal from './Modal'
import StarField from './StarField'
import { createDeck } from '../utils/cardData'
import { playFlip, playCorrect, playIncorrect, playTick, playWin, startBgMusic, stopBgMusic, resumeAudioCtx } from '../utils/audioUtils'

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

const TOTAL_TIME = 30

export default function GameScreen({ onWin, onLose }) {
  const [cards, setCards] = useState(() => createDeck())
  const [flipped, setFlipped] = useState([])
  const [locked, setLocked] = useState(false)
  const [muted, setMuted] = useState(false)
  const [modal, setModal] = useState(null)
  const [timer, setTimer] = useState(TOTAL_TIME)
  const [timeUp, setTimeUp] = useState(false)

  const mutedRef = useRef(muted)
  useEffect(() => { mutedRef.current = muted }, [muted])

  useEffect(() => {
    if (!muted) { resumeAudioCtx(); startBgMusic(); }
    else stopBgMusic();
    return () => stopBgMusic();
  }, [muted])

  useEffect(() => {
    if (timeUp) return
    const id = setInterval(() => {
      setTimer(prev => {
        const next = prev - 1
        if (next <= 10 && next > 0 && !mutedRef.current) playTick()
        if (next <= 0) {
          clearInterval(id)
          setTimeUp(true)
          return 0
        }
        return next
      })
    }, 1000)
    return () => clearInterval(id)
  }, [timeUp])

  useEffect(() => {
    if (timeUp) {
      stopBgMusic()
      setTimeout(() => onLose(), 700)
    }
  }, [timeUp])

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
          const updated = prev.map(c =>
            newFlipped.includes(c.uid) ? { ...c, isFlipped: false, isMatched: true } : c
          )
          const allMatched = updated.every(c => c.isMatched)
          setTimeout(() => {
            setModal(null)
            setFlipped([])
            setLocked(false)
            if (allMatched) {
              stopBgMusic()
              if (!mutedRef.current) playWin()
              setTimeout(() => onWin(), 400)
            }
          }, 1500)
          return updated
        } else {
          if (!mutedRef.current) playIncorrect()
          setModal('nomatch')
          setTimeout(() => {
            setModal(null)
            setCards(c => c.map(x =>
              newFlipped.includes(x.uid) ? { ...x, isFlipped: false } : x
            ))
            setFlipped([])
            setLocked(false)
          }, 1500)
          return prev
        }
      })
    }, 560)
  }

  const timerPct = (timer / TOTAL_TIME) * 100

  return (
    <div
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#050510' }}
    >
      <StarField />

      <div className="relative z-10 w-full flex flex-col items-center px-4" style={{ maxWidth: '520px' }}>
        <div className="w-full px-4 mb-6">
          <div className="w-full rounded-full mb-1" style={{ height: '5px', background: '#0f1f2f' }}>
            <div
              className="h-full rounded-full transition-[width] duration-[980ms] linear"
              style={{
                width: `${timerPct}%`,
                background: 'linear-gradient(90deg, #00d4ff, #7c4dff)',
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="font-display font-bold text-lg tabular-nums" style={{ color: '#00d4ff' }}>
              {String(timer).padStart(2, '0')}s
            </span>
            <button
              onClick={() => setMuted(m => !m)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: muted ? '#2a3a4a' : '#00d4ff' }}
            >
              {muted ? <MuteIcon /> : <SoundIcon />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 w-full">
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

      {modal && <Modal type={modal} />}
    </div>
  )
}