// ─────────────────────────────────────────────────────────────
// buildings.js — five buildings on Horniman Circle Marg
// Phase 2: ink shader materials, canvas sign textures
// ─────────────────────────────────────────────────────────────

import * as THREE from 'three'
import { createInkMaterial } from './shader.js'

// ── Building definitions ──────────────────────────────────────
export const BUILDINGS = [
  {
    id:      'chai',
    name:    'Chai Wala Stall',
    magazine:'Chai Quarterly',
    sign:    'Chai Wala',
    accent:  0xc8a060,
    width:   3.2,
    height:  3.8,
    depth:   1.8,
    x:       -8,
  },
  {
    id:      'reel',
    name:    'Regal Cinema',
    magazine:'Reel',
    sign:    'Regal Cinema',
    accent:  0x4488cc,
    width:   4.8,
    height:  6.2,
    depth:   2.2,
    x:       -4,
  },
  {
    id:      'darkroom',
    name:    'Camera Emporium',
    magazine:'The Darkroom',
    sign:    'Camera Emporium',
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
    sign:    'Kyani & Co.',
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
    sign:    'GPO Fort',
    accent:  0x66aa44,
    width:   4.4,
    height:  5.4,
    depth:   2.4,
    x:       8,
  },
]

// ── Sign canvas texture ───────────────────────────────────────
// Generates a distressed Playfair Display sign as a CanvasTexture.
async function createSignTexture(text, accentHex) {
  // Ensure font is loaded before drawing
  await document.fonts.load('700 36px "Playfair Display"')

  const W = 512, H = 128
  const canvas = document.createElement('canvas')
  canvas.width  = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // Transparent base
  ctx.clearRect(0, 0, W, H)

  // Convert hex int to CSS colour string
  const cssColor = '#' + accentHex.toString(16).padStart(6, '0')

  // Sign text — Playfair Display bold, centred
  ctx.font         = '700 36px "Playfair Display", Georgia, serif'
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle    = cssColor
  ctx.fillText(text, W / 2, H / 2)

  // Distress pass 1 — random punch-outs (destination-out removes alpha)
  ctx.globalCompositeOperation = 'destination-out'
  for (let i = 0; i < 400; i++) {
    const r = Math.random() * 2.5 + 0.5
    ctx.beginPath()
    ctx.arc(Math.random() * W, Math.random() * H, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.5 + 0.15})`
    ctx.fill()
  }
  ctx.globalCompositeOperation = 'source-over'

  // Distress pass 2 — horizontal scratch lines
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'
  ctx.lineWidth   = 0.5
  for (let i = 0; i < 6; i++) {
    const y = Math.random() * H
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

// ── buildStreet ───────────────────────────────────────────────
// async: sign textures require font load
export async function buildStreet(scene) {
  const buildings      = []
  const buildingGroups = []  // passed to OutlinePass

  // ── Ground plane ─────────────────────────────────────────
  const groundMat = createInkMaterial(0x140f06, 0x1a1408)
  const ground    = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 12),
    groundMat
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.y = 0
  ground.receiveShadow = true
  scene.add(ground)

  // ── Back wall ─────────────────────────────────────────────
  const wallMat = createInkMaterial(0x1a1408, 0x2a1e0d)
  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 8),
    wallMat
  )
  backWall.position.set(0, 4, -2.5)
  backWall.receiveShadow = true
  scene.add(backWall)

  // ── Buildings ─────────────────────────────────────────────
  for (const def of BUILDINGS) {
    const group = new THREE.Group()
    group.position.x = def.x

    // Facade — main box with ink cel shading
    const facadeMat = createInkMaterial(0x1c1409, def.accent)
    const facade    = new THREE.Mesh(
      new THREE.BoxGeometry(def.width, def.height, def.depth),
      facadeMat
    )
    facade.position.set(0, def.height / 2, -def.depth / 2)
    facade.castShadow    = true
    facade.receiveShadow = true
    group.add(facade)

    // Accent trim — thin strip along top of facade
    const trimMat = createInkMaterial(def.accent, def.accent)
    const trim    = new THREE.Mesh(
      new THREE.BoxGeometry(def.width, 0.12, 0.05),
      trimMat
    )
    trim.position.set(0, def.height - 0.5, 0.02)
    group.add(trim)

    // Door — dark recess
    const doorW   = 0.9, doorH = 1.8
    const doorMat = createInkMaterial(0x080604, 0x1c1409)
    const door    = new THREE.Mesh(
      new THREE.BoxGeometry(doorW, doorH, 0.1),
      doorMat
    )
    door.position.set(0, doorH / 2, 0.04)
    group.add(door)

    // Window — stays MeshBasicMaterial (emissive glow, not cel-shaded)
    const winMat = new THREE.MeshBasicMaterial({
      color:    new THREE.Color(def.accent).multiplyScalar(0.3),
      transparent: true,
      opacity: 0.85,
    })
    const win = new THREE.Mesh(
      new THREE.BoxGeometry(def.width * 0.55, 0.9, 0.05),
      winMat
    )
    win.position.set(0, doorH + 1.1, 0.04)
    group.add(win)

    // Sign — Playfair Display canvas texture
    const signTex = await createSignTexture(def.sign, def.accent)
    const sign    = new THREE.Mesh(
      new THREE.PlaneGeometry(def.width * 0.85, 0.5),
      new THREE.MeshBasicMaterial({
        map:        signTex,
        transparent: true,
        alphaTest:  0.05,
        depthWrite: false,
      })
    )
    sign.position.set(0, def.height - 1.1, 0.08)
    group.add(sign)

    // User data for raycasting and building entry
    group.userData = {
      buildingId:  def.id,
      name:        def.name,
      magazine:    def.magazine,
      interactive: true,
    }
    group.buildingDef = def

    scene.add(group)
    buildings.push(group)
    buildingGroups.push(group)
  }

  return { buildings, streetMesh: ground, buildingGroups }
}
