import { useEffect, useState } from 'react'
import StarField from './StarField'
import Confetti from './Confetti'
import { calcStars, getHighScore } from '../utils/scoreUtils'

function Stars({ count }) {
  return (
    <div className="flex gap-3 justify-center">
      {[1,2,3].map(i => (
        <span key={i} style={{
          fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
          filter:    i <= count ? 'drop-shadow(0 0 10px #FFD700)' : 'none',
          opacity:   i <= count ? 1 : 0.18,
          animation: i <= count ? `starPop 0.4s ${(i-1)*0.15}s cubic-bezier(0.22,1,0.36,1) both` : 'none',
        }}>⭐</span>
      ))}
    </div>
  )
}

function ScoreLine({ label, value, color, bold }) {
  return (
    <div className="flex justify-between items-center gap-8">
      <span className="font-body" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', color: '#556677' }}>{label}</span>
      <span className="font-display" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color, fontWeight: bold ? 700 : 400 }}>
        {value > 0 ? '+' : ''}{value.toLocaleString()}
      </span>
    </div>
  )
}

export default function ResultScreen({ won, score, timeLeft, onPlayAgain, onMenu }) {
  const [visible,      setVisible]      = useState(false)
  const [newRecord,    setNewRecord]    = useState(false)
  const [confetti,     setConfetti]     = useState(false)
  const [displayScore, setDisplayScore] = useState(0)

  const stars     = won ? calcStars(timeLeft, 30) : 0
  const highScore = getHighScore()

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true)
      if (won) setTimeout(() => setConfetti(true), 200)
      if (score > 0 && score >= highScore) setNewRecord(true)
    }, 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!visible || score === 0) return
    const duration = 1200
    const steps = 60
    const increment = score / steps
    let current = 0
    let step = 0
    const id = setInterval(() => {
      step++
      current += increment
      setDisplayScore(Math.floor(current))
      if (step >= steps) {
        clearInterval(id)
        setDisplayScore(score)
      }
    }, duration / steps)
    return () => clearInterval(id)
  }, [visible, score])

  const winMessage       = stars === 3 ? 'Perfect run! 🌟' : stars === 2 ? 'Great job! ✨' : 'Squeaked through! 💫'
  const matchPts         = score - (won ? timeLeft * 12 : 0)
  const displayMatchPts  = Math.min(displayScore, matchPts)
  const displayTimeBonus = Math.max(0, displayScore - matchPts)

  return (
    <div
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#050510' }}
    >
      <StarField />
      <Confetti active={confetti} />

      <div className="absolute pointer-events-none" style={{
        width: '600px', height: '600px', borderRadius: '50%',
        background: won
          ? 'radial-gradient(circle, rgba(0,255,100,0.07) 0%, transparent 65%)'
          : 'radial-gradient(circle, rgba(255,60,60,0.07) 0%, transparent 65%)',
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
      }} />

      <div
        className="relative z-10 flex flex-col items-center w-full"
        style={{
          gap: 'clamp(14px, 3vh, 26px)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-40px)',
          transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {won ? (
          <div className="flex flex-col items-center" style={{ gap: 'clamp(14px, 3vh, 26px)' }}>
            <img
                src="/images/win.webp"
                alt="You Win"
                className="lg:-mb-16"
                style={{
                  width: 'clamp(180px, 30vw, 280px)',
                  imageRendering: 'pixelated',
                  animation: 'float 3s ease-in-out infinite',
                }}
              />
            <Stars count={stars} />
            <h1 className="font-display font-black uppercase tracking-widest" style={{
              fontSize: 'clamp(2rem, 7vw, 3.5rem)',
              color: '#00ff88',
              textShadow: '0 0 30px rgba(0,255,100,0.4)',
            }}>
              You Did It!
            </h1>
          </div>
        ) : (
          <>
            <img
              src="/images/gameOver.webp"
              alt="Game Over"
              style={{
                width: 'clamp(340px, 80vw, 750px)',
                imageRendering: 'pixelated',
                animation: 'float 3s ease-in-out infinite',
                marginBottom: '-110px',
              }}
            />
            <h1 className="font-display font-black uppercase tracking-widest" style={{
              fontSize: 'clamp(1.2rem, 4vw, 2rem)',
              color: '#ff6666',
              textShadow: '0 0 30px rgba(255,60,60,0.4)',
            }}>
              So Close!
            </h1>
          </>
        )}

        <div className="flex flex-col items-center w-full px-6" style={{ maxWidth: '520px', gap: 'clamp(14px, 3vh, 26px)' }}>
          <p className="font-body text-center" style={{
            fontSize: 'clamp(1rem, 3vw, 1.2rem)',
            color: won ? '#aaffcc' : '#ffaaaa',
            maxWidth: '340px',
          }}>
            {won ? `All 4 pairs found! ${winMessage}` : "Oops — you didn't find them all in time."}
          </p>

          <div
            className="flex flex-col w-full rounded-2xl px-6 py-5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              gap: 'clamp(10px, 2vw, 14px)',
            }}
          >
            <ScoreLine label="Match points" value={displayMatchPts} color="#00d4ff" />
            {won && <ScoreLine label={`Time bonus (+${timeLeft}s)`} value={displayTimeBonus} color="#FFD700" />}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <ScoreLine label="Total score" value={displayScore} color={won ? '#00ff88' : '#ff6666'} bold />

            {newRecord && (
              <div className="text-center" style={{
                opacity: displayScore === score ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}>
                <span
                  className="font-display text-xs font-bold tracking-widest px-3 py-1 rounded-full"
                  style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid #FFD70060', color: '#FFD700' }}
                >
                  🏆 NEW RECORD!
                </span>
              </div>
            )}
          </div>

          <button
            className="btn-primary"
            onClick={onPlayAgain}
            style={won ? { background: 'linear-gradient(135deg,#00ff88,#00d4ff)', color: '#050510' } : {}}
          >
            Play Again
          </button>

          <button
            onClick={onMenu}
            className="font-body text-sm tracking-widest uppercase transition-colors hover:text-white"
            style={{ color: '#334455', letterSpacing: '0.15em' }}
          >
            ← Main Menu
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes starPop {
          0%   { opacity: 0; transform: scale(0) rotate(-30deg); }
          70%  { transform: scale(1.3) rotate(5deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  )}