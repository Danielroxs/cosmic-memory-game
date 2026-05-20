import { useState } from 'react'
import IntroScreen from './components/IntroScreen'
import GameScreen from './components/GameScreen'
import ResultScreen from './components/ResultScreen'

export default function App() {
  const [screen, setScreen] = useState('intro')
  const [result, setResult] = useState({ won: false, score: 0, timeLeft: 0 })

  return (
    <div className="w-screen h-screen overflow-hidden" style={{ background: '#050510' }}>
      {screen === 'intro' && (
        <IntroScreen onStart={() => setScreen('game')} />
      )}
      {screen === 'game' && (
        <GameScreen
          onWin={(score, timeLeft) => { setResult({ won: true, score, timeLeft }); setScreen('result') }}
          onLose={(score) => { setResult({ won: false, score, timeLeft: 0 }); setScreen('result') }}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          won={result.won}
          score={result.score}
          onPlayAgain={() => setScreen('game')}
        />
      )}
    </div>
  )
}