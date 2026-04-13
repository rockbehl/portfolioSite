// ─────────────────────────────────────────────────────────────
// navigation.js — street navigation controls
// Phase 1: basic left/right walk with keyboard + mouse drag.
// Phase 2: depth-of-field, building hover, progress strip.
// ─────────────────────────────────────────────────────────────

import * as THREE from 'three'
import { BUILDINGS } from './buildings.js'

const STREET_MIN_X = -10   // left end of walkable street
const STREET_MAX_X =  10   // right end
const WALK_SPEED   =  4    // units per second (keyboard)
const DRAG_SPEED   =  0.018

export function initNavigation(camera, buildings) {
  let targetX  = camera.position.x
  let isDragging  = false
  let dragStartX  = 0
  let dragOriginX = 0
  let activeIdx   = 2   // centre building (Camera Emporium) on load

  // ── Progress strip dots ───────────────────────────────────
  const strip = document.getElementById('progress-strip')
  const dotsEl = strip?.querySelector('.dots')
  const labelEl = strip?.querySelector('.building-label')

  const dots = BUILDINGS.map((_, i) => {
    const d = document.createElement('div')
    d.className = 'dot'
    dotsEl?.appendChild(d)
    return d
  })

  function updateStrip(idx) {
    dots.forEach((d, i) => d.classList.toggle('active', i === idx))
    if (labelEl) labelEl.textContent = BUILDINGS[idx]?.name ?? ''
  }
  updateStrip(activeIdx)

  // ── Nearest building to camera ────────────────────────────
  function getNearestBuilding(x) {
    let nearest = 0
    let minDist = Infinity
    BUILDINGS.forEach((b, i) => {
      const dist = Math.abs(b.x - x)
      if (dist < minDist) { minDist = dist; nearest = i }
    })
    return nearest
  }

  // ── Keyboard ──────────────────────────────────────────────
  const keys = {}
  window.addEventListener('keydown', (e) => { keys[e.key] = true })
  window.addEventListener('keyup',   (e) => { keys[e.key] = false })

  // ── Mouse drag ────────────────────────────────────────────
  window.addEventListener('mousedown', (e) => {
    isDragging  = true
    dragStartX  = e.clientX
    dragOriginX = targetX
  })
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return
    const delta = (dragStartX - e.clientX) * DRAG_SPEED
    targetX = THREE.MathUtils.clamp(dragOriginX + delta * 4, STREET_MIN_X, STREET_MAX_X)
  })
  window.addEventListener('mouseup',  () => { isDragging = false })

  // ── Touch swipe ───────────────────────────────────────────
  let touchStartX = 0
  let touchOriginX = 0
  window.addEventListener('touchstart', (e) => {
    touchStartX  = e.touches[0].clientX
    touchOriginX = targetX
  }, { passive: true })
  window.addEventListener('touchmove', (e) => {
    const delta = (touchStartX - e.touches[0].clientX) * DRAG_SPEED
    targetX = THREE.MathUtils.clamp(touchOriginX + delta * 4, STREET_MIN_X, STREET_MAX_X)
  }, { passive: true })

  // ── Scroll wheel ──────────────────────────────────────────
  window.addEventListener('wheel', (e) => {
    targetX = THREE.MathUtils.clamp(targetX + e.deltaY * 0.01, STREET_MIN_X, STREET_MAX_X)
  }, { passive: true })

  // ── Update (called every frame) ───────────────────────────
  function update(elapsed) {
    // Keyboard walk
    if (keys['ArrowLeft']  || keys['a']) targetX -= WALK_SPEED * 0.016
    if (keys['ArrowRight'] || keys['d']) targetX += WALK_SPEED * 0.016
    targetX = THREE.MathUtils.clamp(targetX, STREET_MIN_X, STREET_MAX_X)

    // Smooth camera follow
    camera.position.x += (targetX - camera.position.x) * 0.08

    // Update progress strip
    const nearest = getNearestBuilding(camera.position.x)
    if (nearest !== activeIdx) {
      activeIdx = nearest
      updateStrip(activeIdx)
    }
  }

  return { update, getActiveBuilding: () => buildings[activeIdx], getActiveIdx: () => activeIdx }
}
