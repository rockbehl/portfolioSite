// ─────────────────────────────────────────────────────────────
// main.js — entry point
// Boots the Three.js gully scene, wires up audio unlock,
// and hands off to interior spreads on building entry.
// ─────────────────────────────────────────────────────────────

import './styles/base.css'
import { initScene } from './gully/scene.js'

// ── DOM refs ─────────────────────────────────────────────────
const canvas      = document.getElementById('gully-canvas')
const muteToggle  = document.getElementById('mute-toggle')
const progressStrip = document.getElementById('progress-strip')

// ── "Click to enter" prompt ──────────────────────────────────
const enterPrompt = document.createElement('div')
enterPrompt.id = 'enter-prompt'
enterPrompt.textContent = 'click to enter'
document.body.appendChild(enterPrompt)

// ── Boot scene ───────────────────────────────────────────────
const scene = initScene(canvas)

// Show HUD once scene is ready
muteToggle.hidden  = false
progressStrip.hidden = false

// ── Audio unlock — first user gesture ───────────────────────
// Tone.start() must be called inside a user interaction handler.
// We set it up lazily to avoid import-time audio context creation.
let audioStarted = false

async function unlockAudio() {
  if (audioStarted) return
  audioStarted = true

  enterPrompt.style.opacity = '0'
  enterPrompt.style.transition = 'opacity 0.4s'
  setTimeout(() => enterPrompt.remove(), 400)

  // Dynamically import Tone and the soundscape only after user gesture
  const { startSoundscape } = await import('./audio/soundscape.js')
  const shouldMute = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  startSoundscape({ muted: shouldMute })
}

canvas.addEventListener('click',    unlockAudio, { once: true })
canvas.addEventListener('keydown',  unlockAudio, { once: true })
canvas.addEventListener('touchend', unlockAudio, { once: true })

// ── Mute toggle ──────────────────────────────────────────────
muteToggle.addEventListener('click', async () => {
  muteToggle.classList.toggle('muted')
  const { toggleMute } = await import('./audio/soundscape.js')
  toggleMute(muteToggle.classList.contains('muted'))
})

// ── Export scene reference for interior module ───────────────
export { scene }
