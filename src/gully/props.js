// ─────────────────────────────────────────────────────────────
// props.js — street detail props for Horniman Circle Marg
// Overhead wire, cat, bicycle, laundry, poster, autorickshaw.
// All geometry is programmatic low-poly — no external models.
// ─────────────────────────────────────────────────────────────

import * as THREE from 'three'

// Shared materials
const wireMat  = new THREE.MeshBasicMaterial({ color: 0x1a1208 })
const darkMat  = new THREE.MeshBasicMaterial({ color: 0x080604, side: THREE.DoubleSide })

// Helper — create a mesh and set its local position
function mesh(geo, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat)
  m.position.set(x, y, z)
  return m
}

// ── Overhead electrical wire ──────────────────────────────────
function buildWire(scene) {
  // Catenary sag across the full street length
  const pts = [
    new THREE.Vector3(-12, 5.2, 0.1),
    new THREE.Vector3(-8,  5.0, 0.1),
    new THREE.Vector3(-4,  5.2, 0.1),
    new THREE.Vector3( 0,  4.95, 0.1),
    new THREE.Vector3( 4,  5.2, 0.1),
    new THREE.Vector3( 8,  5.0, 0.1),
    new THREE.Vector3( 12, 5.2, 0.1),
  ]
  const curve  = new THREE.CatmullRomCurve3(pts)
  const wireGeo = new THREE.TubeGeometry(curve, 40, 0.018, 4, false)
  scene.add(new THREE.Mesh(wireGeo, wireMat))

  // Short wire drops — from main wire down to each bulb position
  const dropX = [-8, -4, 0, 4, 8]
  const dropGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.4, 4)
  dropX.forEach(x => {
    const drop = new THREE.Mesh(dropGeo, wireMat)
    drop.position.set(x, 4.8, 0.1)  // hangs from ~5.0 to bulb at ~3.8
    scene.add(drop)
  })
}

// ── Cat silhouette — rooftop of GPO Fort (x=8) ───────────────
function buildCat(scene) {
  // Sitting cat: body + head + two ears, all flat ShapeGeometry
  const catMat = new THREE.MeshBasicMaterial({ color: 0x080604, side: THREE.DoubleSide })

  // Body — rounded blob
  const bodyShape = new THREE.Shape()
  bodyShape.moveTo(0, 0)
  bodyShape.quadraticCurveTo( 0.18,  0.0,  0.22,  0.12)
  bodyShape.quadraticCurveTo( 0.24,  0.28, 0.18,  0.36)
  bodyShape.quadraticCurveTo( 0.10,  0.42, 0.0,   0.40)
  bodyShape.quadraticCurveTo(-0.12,  0.38,-0.16,  0.26)
  bodyShape.quadraticCurveTo(-0.18,  0.12,-0.10,  0.02)
  bodyShape.quadraticCurveTo(-0.04, -0.02, 0.0,   0.0)
  const body = new THREE.Mesh(new THREE.ShapeGeometry(bodyShape), catMat)
  body.position.set(9.2, 5.42, -0.48)
  body.rotation.y = -0.3
  scene.add(body)

  // Head — smaller oval
  const headShape = new THREE.Shape()
  headShape.absellipse(0, 0, 0.09, 0.08, 0, Math.PI * 2, false)
  const head = new THREE.Mesh(new THREE.ShapeGeometry(headShape), catMat)
  head.position.set(9.28, 5.78, -0.48)
  head.rotation.y = -0.3
  scene.add(head)

  // Ears — two small triangles
  const earShape = () => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.lineTo(0.04, 0.09)
    s.lineTo(0.08, 0)
    s.closePath()
    return s
  }
  const leftEar  = new THREE.Mesh(new THREE.ShapeGeometry(earShape()), catMat)
  leftEar.position.set(9.22, 5.85, -0.48)
  leftEar.rotation.y = -0.3
  scene.add(leftEar)

  const rightEar = new THREE.Mesh(new THREE.ShapeGeometry(earShape()), catMat)
  rightEar.position.set(9.30, 5.85, -0.48)
  rightEar.rotation.y = -0.3
  scene.add(rightEar)

  // Tail — thin curved tube along rooftop edge
  const tailPts = [
    new THREE.Vector3(9.05, 5.42, -0.45),
    new THREE.Vector3(9.0,  5.35, -0.35),
    new THREE.Vector3(9.1,  5.3,  -0.28),
    new THREE.Vector3(9.22, 5.32, -0.30),
  ]
  const tailCurve = new THREE.CatmullRomCurve3(tailPts)
  const tailGeo   = new THREE.TubeGeometry(tailCurve, 12, 0.015, 4, false)
  scene.add(new THREE.Mesh(tailGeo, catMat))
}

// ── Bicycle — leaning against Camera Emporium (x=0) ──────────
function buildBicycle(scene) {
  const bikeMat  = new THREE.MeshBasicMaterial({ color: 0x2a2010 })
  const frameMat = new THREE.MeshBasicMaterial({ color: 0x1a1208 })
  const group    = new THREE.Group()

  // Wheels — TorusGeometry
  const wheelGeo = new THREE.TorusGeometry(0.28, 0.025, 4, 16)
  const front    = new THREE.Mesh(wheelGeo, bikeMat)
  front.position.set(0.46, 0.3, 0)
  const rear     = new THREE.Mesh(wheelGeo, bikeMat)
  rear.position.set(-0.46, 0.3, 0)
  group.add(front, rear)

  // Frame tubes — thin BoxGeometry segments
  const tubes = [
    // top tube
    { w: 0.92, h: 0.022, d: 0.022, x:  0.0,   y: 0.54,  z: 0, rx: 0,    ry: 0, rz: 0 },
    // down tube (from head to bottom bracket)
    { w: 0.70, h: 0.022, d: 0.022, x:  0.2,   y: 0.34,  z: 0, rx: 0,    ry: 0, rz: -0.52 },
    // seat tube
    { w: 0.40, h: 0.022, d: 0.022, x: -0.12,  y: 0.35,  z: 0, rx: 0,    ry: 0, rz: -0.18 },
    // chain stay (rear)
    { w: 0.56, h: 0.018, d: 0.018, x: -0.12,  y: 0.18,  z: 0, rx: 0,    ry: 0, rz:  0.12 },
    // fork (front)
    { w: 0.36, h: 0.018, d: 0.018, x:  0.30,  y: 0.16,  z: 0, rx: 0,    ry: 0, rz: -0.22 },
  ]
  tubes.forEach(({ w, h, d, x, y, z, rx, ry, rz }) => {
    const t = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat)
    t.position.set(x, y, z)
    t.rotation.set(rx, ry, rz)
    group.add(t)
  })

  // Handlebars — small cross piece
  const handleGeo = new THREE.BoxGeometry(0.25, 0.018, 0.018)
  const handle    = new THREE.Mesh(handleGeo, frameMat)
  handle.position.set(0.46, 0.62, 0)
  handle.rotation.y = Math.PI / 2
  group.add(handle)

  // Lean against the wall and place beside Camera Emporium
  group.rotation.z = -0.12
  group.position.set(1.4, 0, 0.25)
  scene.add(group)
}

// ── Laundry line — between Chai Wala (x=-8) and Cinema (x=-4)
function buildLaundry(scene) {
  // Wire with sag
  const pts = [
    new THREE.Vector3(-7.1, 4.85, -0.5),
    new THREE.Vector3(-6.3, 4.55, -0.5),
    new THREE.Vector3(-5.5, 4.65, -0.5),
    new THREE.Vector3(-4.7, 4.85, -0.5),
  ]
  const curve    = new THREE.CatmullRomCurve3(pts)
  const laundGeo = new THREE.TubeGeometry(curve, 20, 0.008, 4, false)
  scene.add(new THREE.Mesh(laundGeo, wireMat))

  // Garments — flat planes, muted warm tones
  const garmentDefs = [
    { color: 0x3a3020, x: -6.8, rot:  0.10 },  // dark cloth
    { color: 0x4a2010, x: -6.1, rot: -0.08 },  // rust kurta
    { color: 0x2a3020, x: -5.4, rot:  0.05 },  // muted green
  ]
  garmentDefs.forEach(({ color, x, rot }) => {
    const gMat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
    const g    = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.42), gMat)
    g.position.set(x, 4.35, -0.5)
    g.rotation.z = rot
    scene.add(g)

    // Small peg at top
    const pegGeo = new THREE.BoxGeometry(0.03, 0.08, 0.03)
    const peg    = new THREE.Mesh(pegGeo, wireMat)
    peg.position.set(x, 4.62, -0.5)
    scene.add(peg)
  })
}

// ── Political poster — back wall near Kyani (x ≈ 4.8) ────────
async function buildPoster(scene) {
  await document.fonts.load('500 24px "Caveat"')

  const W = 256, H = 320
  const canvas = document.createElement('canvas')
  canvas.width  = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // Aged dark red paper
  ctx.fillStyle = '#3d0a0a'
  ctx.fillRect(0, 0, W, H)

  // Bold slogan text in Caveat
  ctx.font      = '500 38px "Caveat", cursive'
  ctx.fillStyle = '#e8d4a0'
  ctx.textAlign = 'center'
  ctx.fillText('VOTE',    W / 2, 80)
  ctx.fillText('FOR',     W / 2, 130)
  ctx.fillText('INDIA',   W / 2, 180)

  // Small decorative rule
  ctx.strokeStyle = '#8a5020'
  ctx.lineWidth   = 2
  ctx.beginPath()
  ctx.moveTo(40, 210)
  ctx.lineTo(W - 40, 210)
  ctx.stroke()

  // Footer text
  ctx.font      = '400 18px "Caveat", cursive'
  ctx.fillStyle = '#7a5030'
  ctx.fillText('Congress (I)', W / 2, 240)

  // Distress — random alpha punch-outs
  ctx.globalCompositeOperation = 'destination-out'
  for (let i = 0; i < 600; i++) {
    const r = Math.random() * 3
    ctx.beginPath()
    ctx.arc(Math.random() * W, Math.random() * H, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.4 + 0.1})`
    ctx.fill()
  }
  ctx.globalCompositeOperation = 'source-over'

  // Tear patches — rough edge removal
  ctx.globalCompositeOperation = 'destination-out'
  ctx.fillStyle = 'rgba(0,0,0,1)'
  // Top-left corner tear
  ctx.beginPath()
  ctx.moveTo(0, 0); ctx.lineTo(35, 0); ctx.lineTo(0, 50); ctx.closePath(); ctx.fill()
  // Bottom-right strip
  ctx.beginPath()
  ctx.moveTo(W, H - 60); ctx.lineTo(W, H); ctx.lineTo(W - 40, H); ctx.closePath(); ctx.fill()
  ctx.globalCompositeOperation = 'source-over'

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true

  const poster = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 1.15),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.05, depthWrite: false })
  )
  poster.position.set(4.85, 1.85, -2.45)
  scene.add(poster)
}

// ── Autorickshaw — far right end of street (x ≈ 11.5) ────────
function buildAutorickshaw(scene) {
  const bodyMat  = new THREE.MeshBasicMaterial({ color: 0x1a3020 }) // dark green
  const blackMat = new THREE.MeshBasicMaterial({ color: 0x0a0806 })
  const group    = new THREE.Group()

  const mkMesh = (geo, mat, x, y, z) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    return m
  }

  // Main cab body
  group.add(mkMesh(new THREE.BoxGeometry(1.4, 1.0, 1.8), bodyMat,   0, 0.52, 0))
  // Roof — slightly narrower, low curved overhang
  group.add(mkMesh(new THREE.BoxGeometry(1.5, 0.12, 2.0), bodyMat,  0, 1.06, 0))
  // Front hood
  group.add(mkMesh(new THREE.BoxGeometry(0.55, 0.5, 0.38), bodyMat, 0, 0.27, 0.94))
  // Windscreen frame
  group.add(mkMesh(new THREE.BoxGeometry(1.1, 0.7, 0.06), blackMat, 0, 0.74, 0.72))

  // Three wheels (front centre, rear two)
  const wheelGeo = new THREE.TorusGeometry(0.18, 0.04, 4, 10)
  const wheelMat = new THREE.MeshBasicMaterial({ color: 0x0a0806 })
  group.add(mkMesh(wheelGeo, wheelMat,  0.0,  0.18,  0.92))   // front
  group.add(mkMesh(wheelGeo, wheelMat, -0.52, 0.18, -0.62))   // rear left
  group.add(mkMesh(wheelGeo, wheelMat,  0.52, 0.18, -0.62))   // rear right

  // Position and angle — parked at kerb, partially visible
  group.position.set(11.5, 0, 0.4)
  group.rotation.y = 0.47   // angled toward viewer
  scene.add(group)
}

// ── buildStreetProps ──────────────────────────────────────────
// async: poster needs Caveat font
export async function buildStreetProps(scene) {
  buildWire(scene)
  buildCat(scene)
  buildBicycle(scene)
  buildLaundry(scene)
  await buildPoster(scene)
  buildAutorickshaw(scene)
}
