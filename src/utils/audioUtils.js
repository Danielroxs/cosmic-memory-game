let _ctx = null

function getCtx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)()
  return _ctx
}

export function playTick() {
  const c = getCtx()
  if (c.state === 'suspended') return
  const now = c.currentTime
  const osc  = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain)
  gain.connect(c.destination)
  osc.type = 'square'
  osc.frequency.value = 880
  gain.gain.setValueAtTime(0.18, now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07)
  osc.start(now)
  osc.stop(now + 0.08)
}

export function resumeAudioCtx() {
  if (_ctx && _ctx.state === 'suspended') _ctx.resume()
}