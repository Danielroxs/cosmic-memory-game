import { useState } from 'react'
import IntroScreen from './components/IntroScreen'
import GameScreen from './components/GameScreen'
import ResultScreen from './components/ResultScreen'

export default function App() {
  const [screen, setScreen] = useState('intro')
  const [won, setWon] = useState(false)

  return (
    <div className="w-screen h-screen overflow-hidden" style={{ background: '#050510' }}>
      {screen === 'intro' && (
        <IntroScreen onStart={() => setScreen('game')} />
      )}
      {screen === 'game' && (
        <GameScreen
          onWin={() => { setWon(true); setScreen('result') }}
          onLose={() => { setWon(false); setScreen('result') }}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          won={won}
          onPlayAgain={() => setScreen('game')}
        />
      )}
    </div>
  )
}