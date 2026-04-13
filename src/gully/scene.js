// ─────────────────────────────────────────────────────────────
// scene.js — Three.js scene setup, renderer, camera, render loop
// Postprocessing pipeline: Render → Outline → Bloom → Output
// ─────────────────────────────────────────────────────────────

import * as THREE from 'three'
import { EffectComposer }  from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass }      from 'three/addons/postprocessing/RenderPass.js'
import { OutputPass }      from 'three/addons/postprocessing/OutputPass.js'
import { setupLighting, flickerLamps } from './lighting.js'
import { buildStreet }     from './buildings.js'
import { initNavigation }  from './navigation.js'

export function initScene(canvas) {
  // ── Renderer ──────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap
  renderer.outputColorSpace  = THREE.SRGBColorSpace
  renderer.toneMapping       = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.9

  // ── Scene ─────────────────────────────────────────────────
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0d1520)
  scene.fog        = new THREE.Fog(0x0d1520, 18, 35)

  // ── Camera ────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  )
  camera.position.set(0, 1.7, 7)   // eye height (~1.7m), standing in the street
  camera.lookAt(0, 1.7, 0)

  // ── Lighting ──────────────────────────────────────────────
  const { lamps } = setupLighting(scene)

  // ── Sky & stars ───────────────────────────────────────────
  buildSky(scene)

  // ── Street geometry ───────────────────────────────────────
  const { buildings, streetMesh } = buildStreet(scene)

  // ── Postprocessing ────────────────────────────────────────
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  // OutlinePass and UnrealBloomPass added in Phase 2 (shader.js)
  composer.addPass(new OutputPass())

  // ── Navigation ───────────────────────────────────────────
  const nav = initNavigation(camera, buildings)

  // ── Resize handler ───────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
  })

  // ── Render loop ──────────────────────────────────────────
  const clock = new THREE.Clock()

  function tick() {
    requestAnimationFrame(tick)
    const elapsed = clock.getElapsedTime()

    nav.update(elapsed)
    flickerLamps(lamps, elapsed)

    composer.render()
  }

  tick()

  return { scene, camera, renderer, composer, buildings, nav }
}

// ── Sky dome + stars ─────────────────────────────────────────
function buildSky(scene) {
  // Deep blue-black sky gradient via a large sphere, inside-out
  const skyGeo = new THREE.SphereGeometry(50, 16, 8)
  skyGeo.scale(-1, 1, 1)  // flip normals inward

  const skyMat = new THREE.MeshBasicMaterial({
    color: 0x0d1520,
    side: THREE.BackSide,
  })
  scene.add(new THREE.Mesh(skyGeo, skyMat))

  // Stars — small white points scattered in the upper hemisphere
  const starCount   = 280
  const starPositions = new Float32Array(starCount * 3)

  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.random() * Math.PI * 0.45  // upper hemisphere only
    const r     = 45 + Math.random() * 4

    starPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
    starPositions[i * 3 + 1] = r * Math.cos(phi) + 4   // raise above horizon
    starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
  }

  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))

  const starMat = new THREE.PointsMaterial({
    color: 0xd0c8b0,
    size: 0.12,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7,
  })

  scene.add(new THREE.Points(starGeo, starMat))

  // Partial moon — a dim white disc high in the sky
  const moonGeo = new THREE.CircleGeometry(0.9, 24)
  const moonMat = new THREE.MeshBasicMaterial({ color: 0xd8d0b8, transparent: true, opacity: 0.6 })
  const moon    = new THREE.Mesh(moonGeo, moonMat)
  moon.position.set(10, 18, -30)
  moon.lookAt(0, 0, 0)
  scene.add(moon)
}
