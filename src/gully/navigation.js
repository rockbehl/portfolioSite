// ─────────────────────────────────────────────────────────────
// navigation.js — street navigation + building hover detection
// Phase 2: mouse tracking, raycaster hover, outline pass wiring.
// ─────────────────────────────────────────────────────────────

import * as THREE from 'three'
import { BUILDINGS } from './buildings.js'

const STREET_MIN_X = -10
const STREET_MAX_X =  10
const WALK_SPEED   =  4      // units per second (keyboard)
const DRAG_SPEED   =  0.018

export function initNavigation(camera, buildings, outlinePass) {
  let targetX    = camera.position.x
  let isDragging = false
  let dragStartX = 0
  let dragOriginX = 0
  let activeIdx  = 2   // Camera Emporium centred on load

  // ── Mouse position (normalised device coords for raycaster) ─
  const mouse     = new THREE.Vector2(0, 0)
  const raycaster = new THREE.Raycaster()
  let hoveredGroup = null

  window.addEventListener('mousemove', (e) => {
    mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  })

  // ── Outline pass defaults (restored on hover exit) ──────────
  const DEFAULT_STRENGTH = 2.2
  const DEFAULT_COLOR    = new THREE.Color(0xe8c87a)
  const HOVER_STRENGTH   = 3.8
  const HOVER_COLOR      = new THREE.Color(0xffd090)

  // ── Progress strip ───────────────────────────────────────────
  const strip  = document.getElementById('progress-strip')
  const dotsEl = strip?.querySelector('.dots')
  const labelEl = strip?.querySelector('.building-label')

  const dots = BUILDINGS.map(() => {
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

  // ── Nearest building to camera ────────────────────────────────
  function getNearestBuilding(x) {
    let nearest = 0, minDist = Infinity
    BUILDINGS.forEach((b, i) => {
      const dist = Math.abs(b.x - x)
      if (dist < minDist) { minDist = dist; nearest = i }
    })
    return nearest
  }

  // ── Keyboard ──────────────────────────────────────────────────
  const keys = {}
  window.addEventListener('keydown', (e) => { keys[e.key] = true })
  window.addEventListener('keyup',   (e) => { keys[e.key] = false })

  // ── Mouse drag ────────────────────────────────────────────────
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
  window.addEventListener('mouseup', () => { isDragging = false })

  // ── Touch swipe ───────────────────────────────────────────────
  let touchStartX = 0, touchOriginX = 0
  window.addEventListener('touchstart', (e) => {
    touchStartX  = e.touches[0].clientX
    touchOriginX = targetX
  }, { passive: true })
  window.addEventListener('touchmove', (e) => {
    const delta = (touchStartX - e.touches[0].clientX) * DRAG_SPEED
    targetX = THREE.MathUtils.clamp(touchOriginX + delta * 4, STREET_MIN_X, STREET_MAX_X)
  }, { passive: true })

  // ── Scroll wheel ──────────────────────────────────────────────
  window.addEventListener('wheel', (e) => {
    targetX = THREE.MathUtils.clamp(targetX + e.deltaY * 0.01, STREET_MIN_X, STREET_MAX_X)
  }, { passive: true })

  // ── update (called each frame) ────────────────────────────────
  function update(elapsed, currentOutlinePass) {
    // Keyboard walk
    if (keys['ArrowLeft']  || keys['a']) targetX -= WALK_SPEED * 0.016
    if (keys['ArrowRight'] || keys['d']) targetX += WALK_SPEED * 0.016
    targetX = THREE.MathUtils.clamp(targetX, STREET_MIN_X, STREET_MAX_X)

    // Smooth camera follow
    camera.position.x += (targetX - camera.position.x) * 0.08

    // Progress strip — update nearest building indicator
    const nearest = getNearestBuilding(camera.position.x)
    if (nearest !== activeIdx) {
      activeIdx = nearest
      updateStrip(activeIdx)
    }

    // ── Hover raycasting ──────────────────────────────────────
    const op = currentOutlinePass || outlinePass
    if (!op) return

    raycaster.setFromCamera(mouse, camera)
    const hits = raycaster.intersectObjects(buildings, true)

    if (hits.length > 0) {
      // Walk up to the Group (building root)
      let hitObj = hits[0].object
      while (hitObj.parent && !hitObj.userData.interactive) {
        hitObj = hitObj.parent
      }
      const hitGroup = hitObj.userData.interactive ? hitObj : null

      if (hitGroup && hitGroup !== hoveredGroup) {
        hoveredGroup = hitGroup
        op.selectedObjects = [hitGroup]
        op.visibleEdgeColor.copy(HOVER_COLOR)
        op.edgeStrength = HOVER_STRENGTH
        document.body.style.cursor = 'pointer'
      }
    } else {
      if (hoveredGroup !== null) {
        hoveredGroup = null
        // Restore all buildings at default strength
        op.selectedObjects = buildings
        op.visibleEdgeColor.copy(DEFAULT_COLOR)
        op.edgeStrength = DEFAULT_STRENGTH
        document.body.style.cursor = 'default'
      }
    }
  }

  return {
    update,
    getActiveBuilding: () => buildings[activeIdx],
    getActiveIdx:      () => activeIdx,
  }
}
