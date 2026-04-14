// ─────────────────────────────────────────────────────────────
// transition.js — Phase 3: camera push, magazine cover, page-turn
//
// Flow (enter):
//   1. nav.setLocked(true) — freeze street navigation
//   2. GSAP: camera.position → building doorway (1200ms)
//      + lookAtTarget → building x, z=-2 (simultaneously)
//   3. Build magazine cover DOM, fade overlay in
//   4. After 600ms: page-turn animation (800ms desktop, fade mobile)
//   5. Show interior shell + back button → _isInside = true
//
// Flow (exit):
//   1. Hide interior shell
//   2. Reverse page-turn (600ms) or fade
//   3. GSAP: camera.position → (def.x, 1.7, 7) + lookAt → (0,1.7,0)
//   4. nav.setLocked(false)
// ─────────────────────────────────────────────────────────────

import gsap from 'gsap'

// ── Per-building magazine cover theming ───────────────────────
const MAGAZINE_META = {
  chai:     { name: 'Chai Quarterly',  issue: 'Vol. I',  tagline: 'warmth in a glass',     bg: '#f5efe0', fg: '#3a2a10', accent: '#c8a060' },
  reel:     { name: 'Reel',            issue: 'No. 7',   tagline: 'cinema direction',       bg: '#0e1828', fg: '#e8d0a0', accent: '#4488cc' },
  darkroom: { name: 'The Darkroom',    issue: 'No. 3',   tagline: 'process & vision',       bg: '#f0ece4', fg: '#1c1409', accent: '#8a7a50' },
  merwans:  { name: "Merwan's Table",  issue: 'No. 12',  tagline: 'other work',             bg: '#1a0e08', fg: '#f0c88a', accent: '#dd7733' },
  post:     { name: 'The Post',        issue: 'Ed. IV',  tagline: 'correspondence open',    bg: '#0e1a0a', fg: '#c8e8b0', accent: '#66aa44' },
}

// ── Module state ──────────────────────────────────────────────
let _refs            = null   // { camera, nav, lookAtTarget }
let _isTransitioning = false
let _isInside        = false
let _currentDef      = null

// ── DOM elements (built once in _buildDOM) ────────────────────
let _overlay       = null
let _coverEl       = null
let _coverFront    = null
let _coverBack     = null
let _interiorShell = null
let _backBtn       = null

// ─────────────────────────────────────────────────────────────
// initTransition — call once, after initScene() resolves
// refs: { camera, nav, lookAtTarget }
// ─────────────────────────────────────────────────────────────
export function initTransition(refs) {
  _refs = refs
  _buildDOM()
}

function _buildDOM() {
  // Root overlay — sits above canvas, pointer-events disabled until .visible
  _overlay = document.createElement('div')
  _overlay.id = 'interior-overlay'
  _overlay.setAttribute('aria-hidden', 'true')

  // Perspective wrapper — perspective must be on the PARENT of the
  // rotating element, not the element itself (iOS Safari requirement)
  const coverWrapper = document.createElement('div')
  coverWrapper.id = 'cover-wrapper'

  // Magazine cover — the page that flips
  _coverEl = document.createElement('div')
  _coverEl.id = 'magazine-cover'

  _coverFront = document.createElement('div')
  _coverFront.id = 'cover-front'
  _coverFront.className = 'cover-face'

  _coverBack = document.createElement('div')
  _coverBack.id = 'cover-back'
  _coverBack.className = 'cover-face'

  _coverEl.appendChild(_coverFront)
  _coverEl.appendChild(_coverBack)
  coverWrapper.appendChild(_coverEl)
  _overlay.appendChild(coverWrapper)

  // Interior shell — Phase 4 will inject spread content here
  _interiorShell = document.createElement('div')
  _interiorShell.id = 'interior-shell'
  _interiorShell.setAttribute('aria-live', 'polite')
  _interiorShell.hidden = true
  _overlay.appendChild(_interiorShell)

  // Back button
  _backBtn = document.createElement('button')
  _backBtn.id = 'back-btn'
  _backBtn.setAttribute('aria-label', 'Back to street')
  _backBtn.innerHTML = '<span aria-hidden="true">←</span> back to street'
  _backBtn.hidden = true
  _backBtn.addEventListener('click', exitBuilding)
  _overlay.appendChild(_backBtn)

  document.body.appendChild(_overlay)
}

// ─────────────────────────────────────────────────────────────
// enterBuilding — triggered by click/tap/Enter on a building group
// group must have .buildingDef and .userData.interactive === true
// ─────────────────────────────────────────────────────────────
export function enterBuilding(group) {
  if (_isTransitioning || _isInside || !_refs) return
  _isTransitioning = true

  const def  = group.buildingDef
  const meta = MAGAZINE_META[def.id] ?? MAGAZINE_META.chai
  _currentDef = def

  const { camera, nav, lookAtTarget } = _refs
  nav.setLocked(true)

  // Target z: just in front of the building's front face.
  // Facade geometry is BoxGeometry centred at (0, h/2, -depth/2)
  // in group-local space, so the front face is at world z = +depth/2.
  // We stop 0.3 units in front of it.
  const targetZ = def.depth / 2 + 0.3

  const tl = gsap.timeline({ onComplete: () => _showCover(def, meta) })

  // Camera push
  tl.to(camera.position, {
    x:        def.x,
    y:        1.7,
    z:        targetZ,
    duration: 1.2,
    ease:     'power2.inOut',
  }, 0)

  // Animate lookAt: follow building x, lean slightly behind façade
  tl.to(lookAtTarget, {
    x:        def.x,
    z:        -2,
    duration: 1.2,
    ease:     'power2.inOut',
  }, 0)
}

// ── Build and show magazine cover ─────────────────────────────
function _showCover(def, meta) {
  // Populate cover front
  _coverFront.innerHTML = ''
  _coverFront.style.setProperty('--cover-bg',     meta.bg)
  _coverFront.style.setProperty('--cover-fg',     meta.fg)
  _coverFront.style.setProperty('--cover-accent', meta.accent)
  _coverFront.dataset.magazine = def.id

  const spine = document.createElement('div')
  spine.className = 'cover-spine'

  const issueEl = document.createElement('span')
  issueEl.className = 'cover-issue'
  issueEl.textContent = meta.issue

  const titleEl = document.createElement('h1')
  titleEl.className = 'cover-title'
  titleEl.textContent = meta.name

  const taglineEl = document.createElement('p')
  taglineEl.className = 'cover-tagline'
  taglineEl.textContent = meta.tagline

  const buildingEl = document.createElement('p')
  buildingEl.className = 'cover-building'
  buildingEl.textContent = def.name

  _coverFront.appendChild(spine)
  _coverFront.appendChild(issueEl)
  _coverFront.appendChild(titleEl)
  _coverFront.appendChild(taglineEl)
  _coverFront.appendChild(buildingEl)

  // Cover back is the verso (interior side) — blank for Phase 3
  _coverBack.innerHTML = ''
  _coverBack.style.setProperty('--cover-bg',     meta.bg)
  _coverBack.style.setProperty('--cover-fg',     meta.fg)
  _coverBack.style.setProperty('--cover-accent', meta.accent)

  // Show overlay, then fade cover in
  _overlay.classList.add('visible')
  _overlay.setAttribute('aria-hidden', 'false')

  // Double rAF: ensures DOM paint is stable before animating opacity
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      _coverEl.classList.add('fade-in')
      // Wait for fade-in to finish (250ms) + brief hold, then flip
      setTimeout(_triggerPageTurn, 600)
    })
  })
}

// ── Flip the cover ────────────────────────────────────────────
function _triggerPageTurn() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isTouch        = 'ontouchstart' in window

  if (prefersReduced) {
    // Instant cut — no animation
    _coverEl.classList.add('turned-instant')
    _onTurnComplete()
    return
  }

  if (isTouch) {
    // Fade out cover instead of 3D rotation on mobile
    _coverEl.style.transition = 'opacity 0.4s ease'
    _coverEl.style.opacity    = '0'
    setTimeout(_onTurnComplete, 420)
    return
  }

  // Desktop: CSS 3D page-turn
  _coverEl.classList.add('turning')
  _coverEl.addEventListener('animationend', _onTurnComplete, { once: true })
}

function _onTurnComplete() {
  _interiorShell.hidden = false
  _backBtn.hidden       = false
  _backBtn.focus()
  _isTransitioning = false
  _isInside        = true
  document.body.classList.add('interior-open')
}

// ─────────────────────────────────────────────────────────────
// exitBuilding — back button, Escape key
// ─────────────────────────────────────────────────────────────
export function exitBuilding() {
  if (_isTransitioning || !_isInside) return
  _isTransitioning = true

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isTouch        = 'ontouchstart' in window

  // Clear interior content immediately
  _interiorShell.hidden    = true
  _interiorShell.innerHTML = ''
  _backBtn.hidden           = true

  if (prefersReduced) {
    _coverEl.classList.remove('turning', 'turned-instant', 'fade-in')
    _overlay.classList.remove('visible')
    _overlay.setAttribute('aria-hidden', 'true')
    _pullBack()
    return
  }

  if (isTouch) {
    // Fade cover back in briefly, then fade overlay out
    _coverEl.style.transition = 'opacity 0.35s ease'
    _coverEl.style.opacity    = '1'
    setTimeout(() => {
      _overlay.classList.remove('visible')
      _overlay.setAttribute('aria-hidden', 'true')
      // Clean up inline styles for next entry
      _coverEl.style.transition = ''
      _coverEl.style.opacity    = ''
      setTimeout(_pullBack, 80)
    }, 380)
    return
  }

  // Desktop: reverse page-turn
  _coverEl.classList.remove('turning', 'turned-instant')
  _coverEl.classList.add('unturning')
  _coverEl.addEventListener('animationend', () => {
    _coverEl.classList.remove('unturning', 'fade-in')
    _overlay.classList.remove('visible')
    _overlay.setAttribute('aria-hidden', 'true')
    setTimeout(_pullBack, 80)
  }, { once: true })
}

// ── Pull camera back to street ────────────────────────────────
function _pullBack() {
  const { camera, nav, lookAtTarget } = _refs
  const def = _currentDef

  const tl = gsap.timeline({
    onComplete: () => {
      _isTransitioning = false
      _isInside        = false
      _currentDef      = null
      document.body.classList.remove('interior-open')
      nav.setLocked(false)
    },
  })

  // Return camera to street position centred on the building we came from
  tl.to(camera.position, {
    x:        def.x,
    y:        1.7,
    z:        7,
    duration: 1.0,
    ease:     'power2.inOut',
  }, 0)

  // Restore lookAt to default street forward
  tl.to(lookAtTarget, {
    x:        0,
    z:        0,
    duration: 1.0,
    ease:     'power2.inOut',
  }, 0)
}

// ── Public getters ────────────────────────────────────────────
export function getIsTransitioning() { return _isTransitioning }
export function getIsInside()        { return _isInside        }
