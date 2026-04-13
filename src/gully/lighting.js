// ─────────────────────────────────────────────────────────────
// lighting.js — dusk atmosphere for the Fort Mumbai gully
// Warm amber lamplight, deep blue-black sky, moon, stars
// ─────────────────────────────────────────────────────────────

import * as THREE from 'three'

export function setupLighting(scene) {
  // ── Ambient — deep dusk fill, very dark ───────────────────
  const ambient = new THREE.AmbientLight(0x0d1520, 0.6)
  scene.add(ambient)

  // ── Directional — faint "moon" from upper-right ───────────
  const moon = new THREE.DirectionalLight(0x1a2a4a, 0.35)
  moon.position.set(8, 12, -6)
  moon.castShadow = true
  moon.shadow.mapSize.set(1024, 1024)
  moon.shadow.camera.near = 0.5
  moon.shadow.camera.far = 50
  moon.shadow.camera.left = -15
  moon.shadow.camera.right = 15
  moon.shadow.camera.top = 10
  moon.shadow.camera.bottom = -5
  scene.add(moon)

  // ── Street lamps — five warm point lights, one per building ─
  // Positioned above the facade of each building.
  // buildingPositions are the x-offsets used in buildings.js (set at 0,±4,±8)
  const lampPositions = [-8, -4, 0, 4, 8]
  const lamps = []

  lampPositions.forEach((x) => {
    const lamp = new THREE.PointLight(0xe8c87a, 1.8, 6, 1.5)
    lamp.position.set(x, 3.8, 0.5)
    scene.add(lamp)
    lamps.push(lamp)
  })

  // ── Hemisphere — sky/ground gradient ─────────────────────
  const hemi = new THREE.HemisphereLight(
    0x0d1520,   // sky colour — deep night blue
    0x1c1409,   // ground colour — warm dark
    0.4
  )
  scene.add(hemi)

  return { ambient, moon, lamps, hemi }
}

// ── Lamp flicker animation (called in render loop) ──────────
// Subtle random intensity variation on each lamp to simulate
// old tungsten bulbs. Not distracting — just alive.
export function flickerLamps(lamps, time) {
  lamps.forEach((lamp, i) => {
    const offset = i * 1.3
    const noise  = Math.sin(time * 4.1 + offset) * 0.05
                 + Math.sin(time * 7.3 + offset * 0.7) * 0.03
    lamp.intensity = 1.8 + noise
  })
}
