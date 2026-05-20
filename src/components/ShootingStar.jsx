import { useEffect } from 'react'

const DURATION = 3000

export default function ShootingStar({ id, side, y, onCatch, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, DURATION + 50)
    return () => clearTimeout(t)
  }, [])

  const sideStyle = side === 'left'
    ? { left: 'clamp(6px, 2vw, 32px)' }
    : { right: 'clamp(6px, 2vw, 32px)' }

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 200 }}>
      <div style={{ position: 'absolute', top: `${y}%`, transform: 'translateY(-50%)', ...sideStyle }}>
        <div
          style={{
            pointerEvents: 'all',
            cursor: 'pointer',
            animation: `star-appear ${DURATION}ms ease-in-out forwards`,
            filter: 'drop-shadow(0 0 10px #FFD700) drop-shadow(0 0 22px #FFD70077)',
          }}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            onCatch()
            onDone()
          }}
        >
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <polygon
              points="36,3 44,26 68,26 49,41 56,64 36,50 16,64 23,41 4,26 28,26"
              fill="#FFD700"
              stroke="#FFF8C0"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="36,12 41,26 56,26 44,35 49,50 36,42 23,50 28,35 16,26 31,26"
              fill="#FFF0A0"
              opacity="0.5"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
