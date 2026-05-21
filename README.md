# 🌌 Cosmic Memory Game

A space-themed card memory game built with React and Vite. Flip cards to find matching pairs before the timer runs out. Features three difficulty modes, a combo scoring system, and several gameplay mechanics layered on top of the core loop.

## Live Demo

[https://cosmic-memory-game.vercel.app/](https://cosmic-memory-game.vercel.app/)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
git clone https://github.com/Danielroxs/cosmic-memory-game.git
cd cosmic-memory-game
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
npm run build
```

Output goes to `dist/`. Preview the production build locally with:

```bash
npm run preview
```

---

## Project Structure

```
cosmic-memory-game/
├── public/
│   ├── audio/          # Sound effect files
│   ├── cards/          # Pixel art card face assets (.webp)
│   └── images/         # Logo and UI images
├── src/
│   ├── components/     # All React components (screens, cards, UI)
│   ├── hooks/          # Custom React hooks
│   └── utils/          # Score calculation, difficulty config, helpers
├── index.html
├── vite.config.js
└── tailwind.config.js
```

---

## Technical Decisions

### React 18 + Vite

I chose React because the game has several distinct screens — intro, game, win, lose — all sharing state like score, difficulty, and mute preference. A simple state machine in `App.jsx` felt cleaner than reaching for a router for something this self-contained. Lifting state up gave me clean, predictable data flow without the overhead of a global store.

Vite over CRA was a no-brainer. CRA was already deprecated territory, and Vite's HMR is nearly instant — critical when you're iterating on CSS animations and card timing. Every second of feedback loop matters when the thing you're adjusting is a 300ms flip transition.

### Tailwind CSS v3

Tailwind handles the structural stuff — layout, spacing, flex/grid — but I hit its limits quickly. Difficulty colors, animation states tied to game logic, dynamic opacity: these don't work with generated Tailwind classes because the class names need to exist statically at build time. So anything driven by runtime values went to inline styles or CSS custom properties. I didn't fight the tool — I just used it where it's genuinely faster and fell back to plain CSS where it isn't.

### 3D Card Flip — Pure CSS

I considered using a JS animation library here, but the flip is fundamentally a toggle between two states — face-down and face-up — which is exactly what a CSS class transition is built for. `transform-style: preserve-3d`, `rotateY(180deg)`, `backface-visibility: hidden` on both faces. The browser handles the interpolation and it's GPU-accelerated by default. Adding a library would've been complexity for zero gain. The non-obvious part: the inner card element does the rotation, not the outer wrapper, so the click target stays stable and doesn't shift during the flip.

### Web Audio API

I didn't want to ship audio files. Licensing gets weird fast, file size adds up, and formats have inconsistent browser support. The Web Audio API lets me synthesize sounds at runtime with oscillators and gain envelopes — match sound, mismatch buzz, win fanfare, lose tone — all generated in code. The bundle stays light and I have full control over the exact feel of each sound. The tricky part was getting the gain envelope timing right so sounds don't clip or feel abrupt. A few iterations on the attack and release curves got it where I wanted.

### Canvas — StarField & Warp Effect

The star field needed to run continuously and respond to game state without remounting. A `<canvas>` with `requestAnimationFrame` was the right call — React's reconciler shouldn't own something that repaints 60 times a second. The non-obvious decision was using refs to pass state into the RAF loop instead of reading from props or re-registering the loop. That kept the canvas mounted across screen transitions and made the warp effect seamless: when the player wins, the same loop that was drawing slow-drifting stars switches into warp mode, elongating them into streaks with a cubic ease-in over 1.5 seconds before the win screen appears. If I'd let React re-render the canvas on state change, that transition would've stuttered or reset.

### GSAP Pixel Transition

This was my one deliberate external dependency, and I added it specifically because I couldn't get a pixel-dissolve transition to feel right in pure CSS. CSS can handle fades and slides, but the chunky pixel grid dissolve between screens needed sequential tile reveals with staggered timing — that's GSAP's `stagger` utility doing real work. Everything else in the project is CSS or canvas. I kept it scoped to just this one transition so I wasn't pulling in a full animation library to do things CSS already handles fine.

---

## Gameplay Mechanics

### Peek Phase

Showing the cards at the start wasn't just a nice-to-have — it's what separates the game from pure luck. Without a peek, you're flipping blind for the first several turns, and that's not fun, it's frustrating. The peek gives you a window to actually build a mental map. The challenge then becomes holding that map in your head as the timer counts down. That's the game. I tuned the duration so it's long enough to register a few positions but short enough that you can't memorize everything — around 3 seconds on Normal. Hard cuts it shorter on purpose.

### Timer Pause on Modal

Pausing the timer when a modal appears was a fairness call, not a technical one. If the win or lose check fires mid-interaction and the timer keeps running while the modal animates in, the player gets penalized for latency they had no control over. It also felt wrong to show a score summary while the number was still ticking. The timer freezes the moment the modal opens, so the score you see is the score you earned — no ambiguity.

### Combo System

Consecutive matches multiply your points. The multiplier resets the moment you flip two cards that don't match. That one rule does a lot of design work: it rewards players who actually remember the layout and punishes guessing. If you're just randomly flipping, you'll rarely chain more than two matches. If you retained the peek positions and played deliberately, you can run the whole board. The multiplier isn't capped high — it's more about the momentum feeling than the numbers — but it makes perfect runs feel meaningfully different from sloppy ones.

### Hint System

I struggled with this one. The hint briefly highlights a random unmatched pair in gold, which sounds generous, but the timing was the hard part. Too frequent and it trivializes the game; too rare and players forget it exists. I landed on a cooldown tied to elapsed time rather than match count, so the hint becomes available more often the longer a player is stuck. It's a passive safety net more than an active tool — it won't appear unless you've been playing for a while without matching. The gold flash is short enough that you have to be paying attention to catch it.

### Bonus Time Star

The star gives time, not points. That was a deliberate choice. Points at the end of a round feel abstract — you don't really feel them while you're playing. But extra seconds when you're at 8 seconds left? That's visceral. I wanted the bonus to change how the next 20 seconds feel, not just inflate a number at the score screen. The star appears at a random position mid-game and disappears if you ignore it long enough, so there's a real micro-decision: do I stop focusing on the cards to chase the star, or do I stay locked in on the next match?

### Warp Effect on Win

The warp replaces the standard screen transition entirely on a win. I didn't want a fade or a slide — those communicate "this is over," which is flat. The star field accelerating into hyperspace communicates *you did it, and the universe noticed*. It's a payoff. The same canvas that's been quietly drifting stars in the background for the whole game suddenly goes full throttle for 1.5 seconds before the win screen appears. That continuity matters — it's not a cut, it's a crescendo. On a loss, you just get the normal transition. The contrast is intentional.

### Difficulty Affects UI Color

The color shift isn't just cosmetic — it's a constant ambient signal about what mode you're in. Easy is green, Normal is cyan, Hard is red. Once you've played a few rounds, you feel the color before you consciously read the difficulty label. I also wanted the UI to reflect the stakes. A red tint on Hard makes everything feel slightly more urgent without adding any explicit UI pressure. It's a small thing, but small things accumulate.

---

## Features

### Core

- 4×4 card grid with 8 unique pairs
- Flip-to-match mechanic with a peek phase at game start
- Countdown timer per difficulty
- Win / lose screens with score summary and star rating

### Bonus

- **Difficulty selector** — Easy (60s), Normal (30s), Hard (20s)
- **Peek mechanic** — Cards briefly reveal at the start, then flip back
- **Score system** — Points per match, time bonus at game end
- **Combo multiplier** — Consecutive matches increase point value
- **Warp speed effect** — Star field warps into hyperspace on win
- **Hint system** — A random pair briefly highlights gold mid-game
- **Bonus time star** — A star appears on screen; clicking it adds seconds to the timer
- **Pixel art assets** — Custom `.webp` card faces and logo
- **Responsive design** — Playable on mobile and desktop
- **localStorage high score** — Best score persists between sessions
- **Animated logo** — Float and shimmer animation on the intro screen

---

## Deploy

The project deploys to Vercel without any extra configuration.

1. Push the repo to GitHub
2. Import it in [vercel.com](https://vercel.com)
3. Vercel auto-detects Vite — leave the default settings
4. Click **Deploy**

For subsequent deploys, pushing to `main` triggers a new build automatically.