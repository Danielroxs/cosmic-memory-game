import { useState, useCallback } from 'react'
import IntroScreen  from './components/IntroScreen'
import GameScreen   from './components/GameScreen'
import ResultScreen from './components/ResultScreen'
import PixelGrid    from './components/PixelGrid'
import { usePixelTransition } from './hooks/usePixelTransition'

export default function App() {
  const [screen, setScreen] = useState('intro')
  const [result, setResult] = useState({ won: false, score: 0, timeLeft: 0 })

  const { gridRef, transition } = usePixelTransition()

  const navigate = useCallback((to, data = {}) => {
    transition(() => {
      if (data.won !== undefined) setResult(r => ({ ...r, ...data }))
      setScreen(to)
    })
  }, [transition])

  return (
    <div className="w-screen h-screen overflow-hidden" style={{ background: '#050510' }}>
      <PixelGrid ref={gridRef} />

      {screen === 'intro' && (
        <IntroScreen onStart={(diff) => {
          setResult(r => ({ ...r, difficulty: diff }))
          navigate('game', { difficulty: diff })
        }} />
      )}
      {screen === 'game' && (
        <GameScreen
          difficulty={result.difficulty}
          onWin={(score, timeLeft) => navigate('result', { won: true, score, timeLeft })}
          onLose={(score) => navigate('result', { won: false, score, timeLeft: 0 })}
          onMenu={() => navigate('intro')}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          won={result.won}
          score={result.score}
          timeLeft={result.timeLeft}
          onPlayAgain={() => navigate('game')}
          onMenu={() => navigate('intro')}
        />
      )}
    </div>
  )
}