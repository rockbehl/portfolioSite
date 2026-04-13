// ─────────────────────────────────────────────────────────────
// lighting.js — dusk atmosphere for the Fort Mumbai gully
// Phase 2: adds visible lamp bulb meshes for selective bloom.
// Each lamp entry is now { light, bulb, core } — update call sites.
// ─────────────────────────────────────────────────────────────

import * as THREE from 'three'

export function setupLighting(scene) {
  // ── Ambient — deep dusk fill, very dark ──────────────────
  const ambient = new THREE.AmbientLight(0x0d1520, 0.6)
  scene.add(ambient)

  // ── Directional — faint "moon" from upper-right ───────────
  const moon = new THREE.DirectionalLight(0x1a2a4a, 0.35)
  moon.position.set(8, 12, -6)
  moon.castShadow = true
  moon.shadow.mapSize.set(1024, 1024)
  moon.shadow.camera.near   = 0.5
  moon.shadow.camera.far    = 50
  moon.shadow.camera.left   = -15
  moon.shadow.camera.right  = 15
  moon.shadow.camera.top    = 10
  moon.shadow.camera.bottom = -5
  scene.add(moon)

  // ── Street lamps — one per building ──────────────────────
  const lampPositions = [-8, -4, 0, 4, 8]
  const lamps = []

  lampPositions.forEach((x) => {
    // Point light
    const light = new THREE.PointLight(0xe8c87a, 1.8, 6, 1.5)
    light.position.set(x, 3.8, 0.5)
    scene.add(light)

    // Outer bulb — white MeshBasicMaterial so it sits above the 0.88
    // bloom threshold. This is the bloom target.
    const bulbGeo = new THREE.SphereGeometry(0.1, 8, 6)
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const bulb    = new THREE.Mesh(bulbGeo, bulbMat)
    bulb.position.set(x, 3.8, 0.5)
    scene.add(bulb)

    // Inner core — warm amber tint
    const coreGeo = new THREE.SphereGeometry(0.04, 6, 4)
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffe8a0 })
    const core    = new THREE.Mesh(coreGeo, coreMat)
    core.position.set(x, 3.8, 0.5)
    scene.add(core)

    lamps.push({ light, bulb, core })
  })

  // ── Hemisphere — sky/ground gradient ─────────────────────
  const hemi = new THREE.HemisphereLight(0x0d1520, 0x1c1409, 0.4)
  scene.add(hemi)

  return {
    ambient,
    moon,
    lamps,
    hemi,
    lampBulbs: lamps.map(l => l.bulb),
  }
}

// ── flickerLamps ──────────────────────────────────────────────
// lamps: array of { light, bulb, core }
// Animates point light intensity AND bulb/core colour brightness
// to simulate old tungsten filament dimming.
export function flickerLamps(lamps, time) {
  lamps.forEach(({ light, bulb, core }, i) => {
    const offset = i * 1.3
    const noise  = Math.sin(time * 4.1 + offset) * 0.05
                 + Math.sin(time * 7.3 + offset * 0.7) * 0.03

    light.intensity = 1.8 + noise

    // Scale bulb white towards warm dim as it flickers
    const bright = Math.max(0.75, 0.92 + noise * 2)
    bulb.material.color.setScalar(bright)
    core.material.color.setRGB(1.0, 0.9 * bright, 0.6 * bright)
  })
}
