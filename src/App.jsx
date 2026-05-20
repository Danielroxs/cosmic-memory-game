import IntroScreen from './components/IntroScreen'

export default function App() {
  return (
    <div className="w-screen h-screen overflow-hidden" style={{ background: '#050510' }}>
      <IntroScreen onStart={() => {}} />
    </div>
  )
}
