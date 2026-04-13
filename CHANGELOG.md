# Changelog

All notable changes to this project will be documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Phase 2: ink/crosshatch shader, street props, navigation polish
- Phase 3: camera push transition, magazine covers, page-turn animation
- Phase 4: all five magazine interior spreads
- Phase 5: Tone.js ambient soundscape
- Phase 6: accessibility, performance audit, deployment

---

## [0.1.0] — 2026-04-13

### Added
- Vite + vanilla JS project scaffold with `three/addons/` alias
- CSS design tokens for full site palette (gully, buildings, interiors)
- Google Fonts imports: Playfair Display, Lora, IBM Plex Mono, EB Garamond, Caveat
- Three.js scene: renderer, camera (eye height 1.7m), ACESFilmic tone mapping
- Sky dome with star field (280 points) and partial moon
- Scene fog for depth (`Fog` 18–35 units)
- Dusk lighting: ambient fill, directional moon, five amber point lamps per building
- Lamp flicker animation in render loop
- Five building boxes: Chai Wala, Regal Cinema, Camera Emporium, Kyani & Co., GPO Fort
- Building geometry: facade, accent trim, door recess, warm window glow
- Ground plane and back wall
- Navigation: keyboard (arrow keys), mouse click-drag, scroll wheel, touch swipe
- Smooth camera follow with `MathUtils.clamp` street bounds
- "You are here" progress strip — five dots, active dot highlights with building name
- Audio unlock pattern (Tone.js deferred to first user gesture)
- Mute toggle UI
- "Click to enter" landing prompt with fade-in animation
- `src/data/content.js` — single content file with all placeholder values
- Stub files for all Phase 2–5 modules (shader, interior spreads, soundscape)
- Full `public/audio/` and `public/images/` directory structure
- `prefers-reduced-motion` CSS overrides
- Accessibility skip link
- `.env.example` with Formspree variable template
- `progress.html` — visual build tracker (open in browser)
- `PLAN.md` — full six-phase build plan with task breakdown

[Unreleased]: https://github.com/ranveerbehl/ranveersite/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ranveerbehl/ranveersite/releases/tag/v0.1.0
