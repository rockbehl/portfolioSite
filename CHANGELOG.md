# Changelog

All notable changes to this project will be documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Phase 3: camera push transition, magazine covers, page-turn animation
- Phase 4: all five magazine interior spreads
- Phase 5: Tone.js ambient soundscape
- Phase 6: accessibility, performance audit, deployment

---

## [0.2.0] — 2026-04-13

### Added
- **Ink/crosshatch shader** — custom `ShaderMaterial` (`lights: true`) with 3-band cel quantisation (shadow/mid/highlight) and procedural screen-space crosshatch lines in shadow areas using `gl_FragCoord`
- **`createInkMaterial(baseColor, accentColor)`** — factory function; used on all building facades, trim, doors, ground, and back wall
- **Postprocessing pipeline** — `RenderPass → OutlinePass → UnrealBloomPass → BokehPass → OutputPass`
- **OutlinePass** — warm amber ink edges on building groups (`#e8c87a`, strength 2.2, hairline thickness)
- **UnrealBloomPass** — selective lamp glow (threshold 0.88; only white bulb meshes bloom)
- **BokehPass** — subtle depth of field (focus 7.5, aperture 0.0005, maxblur 0.004); disabled on touch devices
- **Lamp bulb meshes** — `SphereGeometry` white outer bulb + warm amber inner core per lamp; bloom targets; flicker animates colour brightness
- **Building signs** — Playfair Display canvas textures with noise distress pass and scratch lines via `document.fonts.load()`
- **Overhead electrical wire** — `CatmullRomCurve3` + `TubeGeometry` with catenary sag across full street length
- **Wire drops** — five short cylinder drops from main wire to bulb positions
- **Cat silhouette** — `ShapeGeometry` sitting cat (body, head, ears, tail) on GPO Fort rooftop
- **Bicycle** — low-poly `TorusGeometry` wheels + `BoxGeometry` frame tubes leaning at Camera Emporium
- **Laundry line** — wire with catenary sag + three garment `PlaneGeometry` meshes between Chai Wala and Regal Cinema
- **Political poster** — canvas texture (Caveat font, aged red paper, distress + tear pass) on back wall near Kyani & Co.
- **Autorickshaw** — box-built dark green auto with three torus wheels, parked at far right end
- **Mouse hover raycasting** — `Raycaster` per frame; hovered building gets brighter outline and pointer cursor
- **Author fix** — GitHub URLs updated to `rockbehl/ranveersite`; local git config fixed

### Changed
- `buildStreet` → `async buildStreet` (font loads for sign textures)
- `initScene` → `async initScene` (awaits street + props)
- `main.js` uses top-level `await` (valid in Vite ESM)
- `lamps` array in `lighting.js` is now `{ light, bulb, core }[]`
- `flickerLamps` animates point light intensity AND bulb/core colour

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

[Unreleased]: https://github.com/rockbehl/ranveersite/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/rockbehl/ranveersite/releases/tag/v0.1.0
