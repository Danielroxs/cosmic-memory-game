let _ctx = null;
let _bgAudio = null;

function getCtx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  return _ctx;
}

function tone(freq, type, t0, dur, vol = 0.3) {
  const c    = getCtx();
  const osc  = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.start(t0);
  osc.stop(t0 + dur + 0.01);
}

export function playFlip() {
  const c = getCtx();
  if (c.state === 'suspended') return;
  const now = c.currentTime;
  const osc  = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain); gain.connect(c.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
  osc.start(now); osc.stop(now + 0.15);
}

export function playCorrect() {
  const c = getCtx();
  if (c.state === 'suspended') return;
  const now = c.currentTime;
  [523.25, 659.25, 783.99, 1046.50].forEach((f, i) =>
    tone(f, 'sine', now + i * 0.11, 0.45, 0.35),
  );
}

export function playIncorrect() {
  const c = getCtx();
  if (c.state === 'suspended') return;
  const now = c.currentTime;
  tone(370, 'sawtooth', now, 0.3, 0.22);
  tone(277, 'sawtooth', now + 0.22, 0.4, 0.22);
}

export function playTick() {
  const c = getCtx();
  if (c.state === 'suspended') return;
  const now = c.currentTime;
  const osc  = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain); gain.connect(c.destination);
  osc.type = 'square'; osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
  osc.start(now); osc.stop(now + 0.08);
}

export function playWin() {
  setTimeout(() => {
    const audio = new Audio('/audio/win.mp3');
    audio.volume = 0.8;
    audio.play().catch(() => {});
  }, 700);
}

export function startBgMusic() {
  if (_bgAudio) return;
  _bgAudio = new Audio('/audio/background.mp3');
  _bgAudio.loop = true;
  _bgAudio.volume = 0.4;
  _bgAudio.play().catch(() => { _bgAudio = null; });
}

export function stopBgMusic() {
  if (_bgAudio) {
    _bgAudio.pause();
    _bgAudio.currentTime = 0;
    _bgAudio = null;
  }
}

export function resumeAudioCtx() {
  if (_ctx && _ctx.state === 'suspended') _ctx.resume();
}

export function playLose() {
  const audio = new Audio('/audio/lose.mp3')
  audio.volume = 0.8
  audio.play().catch(() => {})
}