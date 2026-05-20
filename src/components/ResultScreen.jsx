import { useEffect, useState } from 'react'
import StarField from './StarField'
import { calcStars, getHighScore } from '../utils/scoreUtils'

function Stars({ count }) {
  return (
    <div className="flex gap-2 justify-center mt-2 mb-1">
      {[1,2,3].map(i => (
        <span key={i} style={{
          fontSize: '2rem',
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
    <div className="flex justify-between items-center gap-6">
      <span className="font-body text-sm" style={{ color: '#556677' }}>{label}</span>
      <span className={`font-display text-sm ${bold ? 'text-base' : ''}`} style={{ color, fontWeight: bold ? 700 : 400 }}>
        {value > 0 ? '+' : ''}{value.toLocaleString()}
      </span>
    </div>
  )
}

export default function ResultScreen({ won, score, timeLeft, onPlayAgain, onMenu }) {
  const [visible,   setVisible]   = useState(false)
  const [newRecord, setNewRecord] = useState(false)

  const stars     = won ? calcStars(timeLeft, 30) : 0
  const highScore = getHighScore()

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true)
      if (score > 0 && score >= highScore) setNewRecord(true)
    }, 60)
    return () => clearTimeout(t)
  }, [])

  const winMessage = stars === 3 ? 'Perfect run! 🌟' : stars === 2 ? 'Great job! ✨' : 'Squeaked through! 💫'

  return (
    <div
      className="relative w-full h-screen flex flex-col items-center justify-center gap-8 overflow-hidden"
      style={{ background: '#050510' }}
    >
      <StarField />

      <div className="absolute pointer-events-none" style={{
        width: '600px', height: '600px', borderRadius: '50%',
        background: won
          ? 'radial-gradient(circle, rgba(0,255,100,0.07) 0%, transparent 65%)'
          : 'radial-gradient(circle, rgba(255,60,60,0.07) 0%, transparent 65%)',
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
      }} />

      <div
        className="relative z-10 text-center px-6 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-60px)' }}
      >
        <div style={{ fontSize: '5rem', animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>
          {won ? '🏆' : '🌌'}
        </div>

        {won && <Stars count={stars} />}

        <h1 className="font-display font-black uppercase tracking-widest mt-2" style={{
          fontSize: 'clamp(1.8rem, 6vw, 3rem)',
          color:      won ? '#00ff88' : '#ff6666',
          textShadow: won ? '0 0 30px rgba(0,255,100,0.4)' : '0 0 30px rgba(255,60,60,0.4)',
        }}>
          {won ? 'You Did It!' : 'So Close!'}
        </h1>

        <p className="font-body text-lg mt-2 mx-auto" style={{ color: won ? '#aaffcc' : '#ffaaaa', maxWidth: '310px' }}>
          {won
            ? `All 4 pairs found! ${winMessage}`
            : "Oops — you didn't find them all in time."}
        </p>

        <div
          className="mt-5 inline-flex flex-col gap-1.5 px-6 py-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', minWidth: '220px' }}
        >
          <ScoreLine label="Match points" value={score - (won ? timeLeft * 12 : 0)} color="#00d4ff" />
          {won && <ScoreLine label={`Time bonus (+${timeLeft}s)`} value={timeLeft * 12} color="#FFD700" />}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />
          <ScoreLine label="Total score" value={score} color={won ? '#00ff88' : '#ff6666'} bold />

          {newRecord && (
            <div className="mt-1 text-center">
              <span
                className="font-display text-xs font-bold tracking-widest px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid #FFD70060', color: '#FFD700' }}
              >
                🏆 NEW RECORD!
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        className="relative z-10 flex flex-col items-center gap-3 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(100px)',
          transitionDelay: visible ? '250ms' : '0ms',
        }}
      >
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
  )
}