import { useState } from 'react'
import IntroScreen from './components/IntroScreen'
import GameScreen from './components/GameScreen'

export default function App() {
  const [screen, setScreen] = useState('intro')

  return (
    <div className="w-screen h-screen overflow-hidden" style={{ background: '#050510' }}>
      {screen === 'intro' && <IntroScreen onStart={() => setScreen('game')} />}
      {screen === 'game'  && (
        <GameScreen
          onWin={() => setScreen('result')}
          onLose={() => setScreen('result')}
        />
      )}
    </div>
  )
}