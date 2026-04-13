// ─────────────────────────────────────────────────────────────
// buildings.js — five building boxes on Horniman Circle Marg
// Phase 1: basic geometry with accent colours.
// Phase 2: ink shader, signage, street props added.
// ─────────────────────────────────────────────────────────────

import * as THREE from 'three'

// Building definitions — single source of truth for 3D layout.
// 'id' matches the content.js section keys.
export const BUILDINGS = [
  {
    id:      'chai',
    name:    'Chai Wala Stall',
    magazine:'Chai Quarterly',
    accent:  0xc8a060,
    // Geometry: narrower, lower (stall, not grand building)
    width:   3.2,
    height:  3.8,
    depth:   1.8,
    x:       -8,
  },
  {
    id:      'reel',
    name:    'Regal Cinema',
    magazine:'Reel',
    accent:  0x4488cc,
    // Grandest building — tallest, widest
    width:   4.8,
    height:  6.2,
    depth:   2.2,
    x:       -4,
  },
  {
    id:      'darkroom',
    name:    'Camera Emporium',
    magazine:'The Darkroom',
    accent:  0x8a7a50,
    width:   3.6,
    height:  4.4,
    depth:   1.8,
    x:       0,
  },
  {
    id:      'merwans',
    name:    'Kyani & Co.',
    magazine:"Merwan's Table",
    accent:  0xdd7733,
    width:   3.8,
    height:  4.8,
    depth:   2.0,
    x:       4,
  },
  {
    id:      'post',
    name:    'GPO Fort',
    magazine:'The Post',
    accent:  0x66aa44,
    // Classical colonial — wide and formal
    width:   4.4,
    height:  5.4,
    depth:   2.4,
    x:       8,
  },
]

export function buildStreet(scene) {
  const buildings = []

  // ── Ground plane — cracked stone pavement ─────────────────
  const groundGeo = new THREE.PlaneGeometry(40, 12)
  const groundMat = new THREE.MeshLambertMaterial({
    color: 0x140f06,
  })
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = 0
  ground.receiveShadow = true
  scene.add(ground)

  // ── Side walls — alley walls between buildings ─────────────
  const wallGeo = new THREE.PlaneGeometry(40, 8)
  const wallMat = new THREE.MeshLambertMaterial({ color: 0x1a1408, side: THREE.DoubleSide })

  const backWall = new THREE.Mesh(wallGeo, wallMat)
  backWall.position.set(0, 4, -2.5)
  backWall.receiveShadow = true
  scene.add(backWall)

  // ── Buildings ─────────────────────────────────────────────
  BUILDINGS.forEach((def) => {
    const group = new THREE.Group()
    group.position.x = def.x

    // Main facade box
    const facadeGeo = new THREE.BoxGeometry(def.width, def.height, def.depth)
    const facadeMat = new THREE.MeshLambertMaterial({ color: 0x1c1409 })
    const facade = new THREE.Mesh(facadeGeo, facadeMat)
    facade.position.set(0, def.height / 2, -def.depth / 2)
    facade.castShadow    = true
    facade.receiveShadow = true
    group.add(facade)

    // Accent trim — a thin strip across the facade face
    const trimGeo = new THREE.BoxGeometry(def.width, 0.12, 0.05)
    const trimMat = new THREE.MeshLambertMaterial({ color: def.accent })
    const trim    = new THREE.Mesh(trimGeo, trimMat)
    trim.position.set(0, def.height - 0.5, 0.02)
    group.add(trim)

    // Door arch — darker recess in the centre of the facade
    const doorW  = 0.9
    const doorH  = 1.8
    const doorGeo = new THREE.BoxGeometry(doorW, doorH, 0.1)
    const doorMat = new THREE.MeshLambertMaterial({ color: 0x080604 })
    const door    = new THREE.Mesh(doorGeo, doorMat)
    door.position.set(0, doorH / 2, 0.04)
    group.add(door)

    // Window — above the door, using accent colour as warm glow
    const winGeo = new THREE.BoxGeometry(def.width * 0.55, 0.9, 0.05)
    const winMat = new THREE.MeshLambertMaterial({
      color:       def.accent,
      emissive:    new THREE.Color(def.accent),
      emissiveIntensity: 0.2,
    })
    const win = new THREE.Mesh(winGeo, winMat)
    win.position.set(0, doorH + 1.1, 0.04)
    group.add(win)

    // Store user data for raycasting (building identification)
    group.userData = {
      buildingId: def.id,
      name:       def.name,
      magazine:   def.magazine,
      interactive: true,
    }

    // Attach def to group for nav system
    group.buildingDef = def

    scene.add(group)
    buildings.push(group)
  })

  return { buildings, streetMesh: ground }
}
