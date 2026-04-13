// ─────────────────────────────────────────────────────────────
// shader.js — ink / crosshatch shader
// Phase 1: placeholder (identity pass).
// Phase 2: OutlinePass + cel shading + UnrealBloomPass on lamps.
// ─────────────────────────────────────────────────────────────

// This module is a stub in Phase 1.
// Phase 2 will implement:
//   - OutlinePass (three/addons/postprocessing/OutlinePass.js)
//   - Custom ink/crosshatch ShaderMaterial
//   - UnrealBloomPass scoped to lamp meshes only

export function addInkPasses(composer, scene, camera) {
  // Phase 2 implementation goes here.
  // For now, returns early — OutputPass in scene.js handles output.
  return {}
}
