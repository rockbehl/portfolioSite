// ─────────────────────────────────────────────────────────────
// shader.js — ink aesthetic system
// Exports:
//   createInkMaterial(baseColor, accentColor) → ShaderMaterial
//   addInkPasses(composer, scene, camera, buildingGroups, lampBulbs)
//     → { outlinePass, bloomPass, bokehPass }
// ─────────────────────────────────────────────────────────────

import * as THREE from 'three'
import { OutlinePass }     from 'three/addons/postprocessing/OutlinePass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { BokehPass }       from 'three/addons/postprocessing/BokehPass.js'

// ── GLSL — Vertex ────────────────────────────────────────────
const INK_VERT = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vec4 worldPos4 = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos4.xyz;
    vNormal   = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// ── GLSL — Fragment ──────────────────────────────────────────
const INK_FRAG = /* glsl */`
  #include <common>
  #include <lights_pars_begin>

  uniform vec3  uBaseColor;
  uniform vec3  uMidColor;
  uniform vec3  uHighColor;

  varying vec3 vNormal;
  varying vec3 vWorldPos;

  // ── 3-band cel quantisation ─────────────────────────────────
  // Returns 0.0 (shadow), 0.45 (mid), 1.0 (highlight)
  float celQuantise(float v) {
    if (v < 0.18) return 0.0;
    if (v < 0.55) return 0.45;
    return 1.0;
  }

  // ── Procedural screen-space crosshatch ──────────────────────
  // Returns 1.0 on a hatch stroke, 0.0 otherwise.
  float hatchDiag(float spacing, float offset) {
    float d = mod(gl_FragCoord.x + gl_FragCoord.y + offset, spacing);
    return step(d, 1.0);
  }

  float hatchAnti(float spacing) {
    float d = mod(gl_FragCoord.x - gl_FragCoord.y + spacing * 0.5, spacing);
    return step(d, 1.0);
  }

  float crosshatch(float darkness) {
    float h = 0.0;
    // Layer 1 — light diagonal hatching (darkness > 0.30)
    if (darkness > 0.30) h = max(h, hatchDiag(9.0, 0.0));
    // Layer 2 — cross hatch (darkness > 0.60)
    if (darkness > 0.60) h = max(h, hatchAnti(9.0));
    // Layer 3 — fine dense fill (darkness > 0.82)
    if (darkness > 0.82) h = max(h, hatchDiag(5.0, 2.5));
    return h;
  }

  void main() {
    vec3 normal = normalize(vNormal);

    // ── Accumulate point light diffuse ──────────────────────
    float totalDiff = 0.0;

    #if ( NUM_POINT_LIGHTS > 0 )
      for (int i = 0; i < NUM_POINT_LIGHTS; i++) {
        vec3  lDir  = pointLights[i].position - vWorldPos;
        float dist  = length(lDir);
        float atten = pow(
          max(0.0, 1.0 - dist / max(pointLights[i].distance, 0.001)),
          pointLights[i].decay
        );
        float diff  = max(dot(normal, normalize(lDir)), 0.0) * atten;
        totalDiff   = max(totalDiff, diff);
      }
    #endif

    // Ambient floor — deep blue dusk fill
    float rawLight = clamp(totalDiff + 0.08, 0.0, 1.0);

    // ── Cel quantise to 3 bands ─────────────────────────────
    float band = celQuantise(rawLight);

    vec3 celColor;
    if (band < 0.1)       celColor = uBaseColor;   // shadow
    else if (band < 0.6)  celColor = uMidColor;    // mid
    else                  celColor = uHighColor;   // highlight (accent)

    // ── Crosshatch in shadow / mid areas ───────────────────
    float darkness   = 1.0 - band;
    float hatch      = crosshatch(darkness);
    vec3  hatchColor = uBaseColor * 0.45;          // near-black ink line
    vec3  finalColor = mix(celColor, hatchColor, hatch * 0.7);

    gl_FragColor = vec4(finalColor, 1.0);

    // Required for SRGBColorSpace output
    #include <colorspace_fragment>
  }
`

// ── createInkMaterial ─────────────────────────────────────────
// Factory — returns a ShaderMaterial tuned for each building surface.
//   baseColor   — shadow band colour (hex int, e.g. 0x1c1409)
//   accentColor — highlight band colour (building accent)
export function createInkMaterial(baseColor = 0x1c1409, accentColor = 0xc8a060) {
  // Mid colour is always a warm dark — the step between shadow and highlight.
  const mid = new THREE.Color(baseColor).lerp(new THREE.Color(accentColor), 0.22)

  return new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.lights,               // injects pointLights[] etc.
      {
        uBaseColor:  { value: new THREE.Color(baseColor) },
        uMidColor:   { value: mid },
        uHighColor:  { value: new THREE.Color(accentColor) },
      },
    ]),
    vertexShader:   INK_VERT,
    fragmentShader: INK_FRAG,
    lights:         true,
  })
}

// ── addInkPasses ──────────────────────────────────────────────
// Inserts OutlinePass, UnrealBloomPass, BokehPass before OutputPass.
// composer already has: [0] RenderPass, [1] OutputPass
// After this fn:       [0] RenderPass, [1] OutlinePass,
//                      [2] UnrealBloomPass, [3] BokehPass, [4] OutputPass
export function addInkPasses(composer, scene, camera, buildingGroups = [], lampBulbs = []) {
  const res = new THREE.Vector2(window.innerWidth, window.innerHeight)

  // ── OutlinePass — warm amber ink edges on buildings ───────
  const outlinePass = new OutlinePass(res, scene, camera, buildingGroups)
  outlinePass.visibleEdgeColor.set(0xe8c87a)   // warm lamp amber
  outlinePass.hiddenEdgeColor.set(0x3a2a10)    // dim for occluded edges
  outlinePass.edgeStrength    = 2.2
  outlinePass.edgeThickness   = 1.0            // hairline — ink pen weight
  outlinePass.edgeGlow        = 0.0            // no glow — this is ink, not neon
  outlinePass.downSampleRatio = 2
  outlinePass.pulsePeriod     = 0

  // ── UnrealBloomPass — selective: only lamp bulbs bloom ────
  // threshold 0.88: lamp bulbs (MeshBasicMaterial white, luminance 1.0) bloom.
  // Building facades (#1c1409, luminance ≈ 0.06) do not.
  const bloomPass = new UnrealBloomPass(
    res,
    0.45,   // strength — gentle halo, not overwhelming
    0.3,    // radius — tight, doesn't spread across the street
    0.88    // threshold — only the bulbs cross this
  )

  // ── BokehPass — subtle depth of field ─────────────────────
  // Camera at z=7, building facades at z≈0. Distance ≈ 7.5.
  // aperture + maxblur kept very low — brief says "subtle".
  const bokehPass = new BokehPass(scene, camera, {
    focus:    7.5,
    aperture: 0.0005,
    maxblur:  0.004,
  })
  // Disable on touch/mobile — depth prepass is expensive
  bokehPass.enabled = !('ontouchstart' in window)

  // Insert before OutputPass (which is currently at index 1)
  composer.insertPass(outlinePass, 1)  // OutputPass pushed to 2
  composer.insertPass(bloomPass,   2)  // OutputPass pushed to 3
  composer.insertPass(bokehPass,   3)  // OutputPass pushed to 4

  return { outlinePass, bloomPass, bokehPass }
}
