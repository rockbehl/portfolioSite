// ─────────────────────────────────────────────────────────────
// soundscape.js — Tone.js ambient street audio
// Phase 1: stub (no sound).
// Phase 5: full implementation with synth placeholders.
// ─────────────────────────────────────────────────────────────

// NOTE: this module is dynamically imported ONLY after a user gesture.
// Never import Tone at the top level — it creates an AudioContext on import.

let started = false
let muted   = false

export async function startSoundscape({ muted: startMuted = false } = {}) {
  if (started) return
  started = true
  muted   = startMuted
  // Phase 5 implementation goes here
  console.log('[soundscape] ready — Phase 5 will fill this in')
}

export function toggleMute(isMuted) {
  muted = isMuted
  // Phase 5: set Tone.Destination.volume
}
