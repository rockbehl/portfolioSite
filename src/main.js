// ─────────────────────────────────────────────────────────────
// main.js — entry point
// Top-level await: initScene is async (font loads, sign textures).
// ─────────────────────────────────────────────────────────────

import './styles/base.css'
import './styles/interior.css'
import { initScene }        from './gully/scene.js'
import {
  initTransition,
  enterBuilding,
  exitBuilding,
  getIsTransitioning,
  getIsInside,
} from './interior/transition.js'
import * as THREE from 'three'

// ── DOM refs ──────────────────────────────────────────────────
const canvas        = document.getElementById('gully-canvas')
const muteToggle    = document.getElementById('mute-toggle')
const progressStrip = document.getElementById('progress-strip')

// ── "Click to enter" prompt ───────────────────────────────────
const enterPrompt = document.createElement('div')
enterPrompt.id = 'enter-prompt'
enterPrompt.textContent = 'click to enter'
document.body.appendChild(enterPrompt)

// ── Boot scene (async — awaits font + sign texture loads) ─────
const scene = await initScene(canvas)

// Show HUD after scene is fully ready
muteToggle.hidden    = false
progressStrip.hidden = false

// ── Transition system ─────────────────────────────────────────
initTransition({
  camera:      scene.camera,
  nav:         scene.nav,
  lookAtTarget: scene.lookAtTarget,
})

// ── Click / tap to enter building ────────────────────────────
// We distinguish a drag (>5 px) from a click so street panning
// doesn't accidentally trigger a building entry.
const raycaster  = new THREE.Raycaster()
const clickMouse = new THREE.Vector2()
let   pointerDownAt = null

canvas.addEventListener('mousedown', (e) => {
  pointerDownAt = { x: e.clientX, y: e.clientY }
})

canvas.addEventListener('mouseup', (e) => {
  if (!pointerDownAt) return
  const dx = e.clientX - pointerDownAt.x
  const dy = e.clientY - pointerDownAt.y
  pointerDownAt = null

  // Ignore drags
  if (Math.sqrt(dx * dx + dy * dy) > 5) return
  if (getIsTransitioning() || getIsInside()) return

  clickMouse.x =  (e.clientX / window.innerWidth)  * 2 - 1
  clickMouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(clickMouse, scene.camera)
  const hits = raycaster.intersectObjects(scene.buildings, true)

  if (hits.length > 0) {
    let hitObj = hits[0].object
    while (hitObj.parent && !hitObj.userData.interactive) hitObj = hitObj.parent
    if (hitObj.userData.interactive) enterBuilding(hitObj)
  }
})

// Touch tap
canvas.addEventListener('touchend', (e) => {
  if (e.changedTouches.length !== 1) return
  if (getIsTransitioning() || getIsInside()) return

  const t = e.changedTouches[0]
  clickMouse.x =  (t.clientX / window.innerWidth)  * 2 - 1
  clickMouse.y = -(t.clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(clickMouse, scene.camera)
  const hits = raycaster.intersectObjects(scene.buildings, true)

  if (hits.length > 0) {
    let hitObj = hits[0].object
    while (hitObj.parent && !hitObj.userData.interactive) hitObj = hitObj.parent
    if (hitObj.userData.interactive) enterBuilding(hitObj)
  }
}, { passive: true })

// ── Keyboard: Enter → enter building, Escape → exit ──────────
window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !getIsTransitioning() && !getIsInside()) {
    const activeBuilding = scene.nav.getActiveBuilding()
    if (activeBuilding) enterBuilding(activeBuilding)
  }
  if (e.key === 'Escape' && getIsInside() && !getIsTransitioning()) {
    exitBuilding()
  }
})

// ── Audio unlock — first user gesture ────────────────────────
// Tone.start() must be called inside a user interaction handler.
let audioStarted = false

async function unlockAudio() {
  if (audioStarted) return
  audioStarted = true

  enterPrompt.style.opacity    = '0'
  enterPrompt.style.transition = 'opacity 0.4s'
  setTimeout(() => enterPrompt.remove(), 400)

  const { startSoundscape } = await import('./audio/soundscape.js')
  const shouldMute = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  startSoundscape({ muted: shouldMute })
}

canvas.addEventListener('click',    unlockAudio, { once: true })
canvas.addEventListener('keydown',  unlockAudio, { once: true })
canvas.addEventListener('touchend', unlockAudio, { once: true })

// ── Mute toggle ───────────────────────────────────────────────
muteToggle.addEventListener('click', async () => {
  muteToggle.classList.toggle('muted')
  const { toggleMute } = await import('./audio/soundscape.js')
  toggleMute(muteToggle.classList.contains('muted'))
})

export { scene }
