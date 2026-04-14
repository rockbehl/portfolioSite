# inspiration & references

Collected references that shaped the gully portfolio's visual language, interaction patterns, and technical approach. This is a living document — add links and notes as the project evolves.

---

## visual — ink & illustration on the web

### three.js ink/toon rendering
- **Moebius-style shader** — screen-space crosshatch using `gl_FragCoord` modular arithmetic rather than texture lookups. The gully's shader uses this approach: three diagonal line layers at 9px/9px/5px spacing, activated by cel-shading darkness bands. No external textures, pure math.
- **Cel quantisation (3-band)** — borrowed from the comic/bande dessinee tradition. Light intensity snaps to three steps: shadow (<0.18), mid-tone (<0.55), highlight (>=0.55). Creates the flat-planes look of hand-inked illustration without losing volumetric information from the lighting rig.
- **Outline pass as structural line** — `OutlinePass` from Three.js examples (`edgeStrength: 2.2`, hairline thickness) renders the warm amber ink edges. This replicates the "confident single-weight ink line" seen in Indian ink illustration — Husain, Souza, the NGMA watercolour school.

### editorial / magazine design as UI metaphor
- **Emigre magazine** (Rudy VanderLans) — the idea that a magazine's layout IS the content, not a container for it. Each of the five interiors is a themed publication: *Chai Quarterly*, *Reel*, *The Darkroom*, *Merwan's Table*, *The Post*. The cover-first, page-turn-to-enter pattern comes from this tradition.
- **Bloomberg Businessweek redesign** (2010s) — aggressive typography as identity. The cover title sizing (`clamp(2.8rem, 9vw, 6rem)`) and Playfair Display at display scale borrows from this school.
- **McSweeney's Quarterly** — the idea that the physical object (or in this case, the 3D building) IS the publication. You don't "navigate to" content, you walk up to it and enter it.

### fort mumbai architectural vernacular
- **Horniman Circle** — the real street's proportions informed building widths and heights. The tallest (Regal Cinema at 6.2 units) references the actual cinema facades with their vertical Art Deco proportions. The shortest (Chai Wala at 3.8 units) is a low-slung dhaba form.
- **Signage typography** — Playfair Display with distress passes (400 random arc punch-outs + horizontal scratch lines) simulates the hand-painted sign boards that are everywhere in Fort Mumbai. The `destination-out` compositing technique mimics paint chipping without needing bitmap textures.
- **Colour palette** — warm amber (`#e8c87a`), deep base (`#1c1409`), and per-building accents drawn from the actual street: chai gold, cinema blue (neon), camera shop muted brass, bakery terracotta, post office green.

---

## interaction — camera & spatial navigation

### the "walk and enter" pattern
- **Firewatch** (Campo Santo, 2016) — the parallax-layered environment where navigation IS the story. The gully's left-right walk with depth-of-field blur on peripheral buildings uses the same principle: you understand where you are by what's in focus.
- **Cardboard Computer's *Kentucky Route Zero*** — theatrical flat perspective, buildings as stages. The gully's fixed camera height (1.7m eye level) and smooth `MathUtils.clamp` panning directly references KRZ's lateral movement.

### camera push as transition
- **The camera push-in** is a film language staple (Kubrick, Spielberg, Wes Anderson). The 1.2-second `power2.inOut` GSAP push to the doorway uses the exact timing of a Steadicam approach shot. `lookAtTarget` animates simultaneously — camera doesn't just move forward, it refocuses on the building entrance, then leans behind the facade (`z: -2`), creating the feeling of crossing a threshold.
- **Apple spatial transitions** — the way macOS and iOS use z-depth camera movement to signal "entering" a context. The gully does the same: street → push forward → cover appears → page turn → interior. Exit is the exact reverse. The spatial metaphor makes the state transition legible without any UI chrome.

### page-turn as reveal
- **CSS 3D page-turn** — the decision to use `rotateY(-180deg)` with `perspective` on the wrapper parent (not the animating element) comes from hard-won iOS Safari debugging across the industry. The `backface-visibility: hidden` trick with both `-webkit-` prefix and unprefixed is essential. On touch devices, we fall back to a 400ms opacity fade — the 3D rotation doesn't read well on small screens.
- **`prefers-reduced-motion` instant cut** — no animation, no timers, class swap only. This isn't just accessibility compliance — some users physically cannot process rapid 3D rotations. The instant cut is arguably a more elegant transition anyway.

---

## sound — the Mumbai street layer

### ambient soundscape references
- **Freesound CC0 assets identified for future use:**
  - `#319360` — Mumbai traffic ambience (the base hum layer)
  - `#462922` — pressure cooker whistle (punctuation, timed)
  - `#418262` — Indian crow call (random interval, panned to sky)
- **Chris Watson field recordings** — the idea of layered ambient zones where sounds have spatial position. The gully's planned Tone.js implementation places the radio song in the Cinema direction and the azaan call from above, using Web Audio panning.
- **Synth-first approach** — Tone.js generates all placeholder sounds in code (no audio files needed to run the site). Oscillators for the traffic hum, noise bursts for the cooker whistle, filtered noise for crow calls. Real recordings drop in later without changing any code — just swap the source in `soundscape.js`.

### interaction-triggered audio
- **Building hover sounds** — planned per-building: tea pouring (Chai Wala), film reel click (Regal Cinema), shutter snap (Camera Emporium), crockery clink (Kyani & Co.), paper rustle (GPO Fort). Each is a single-shot Tone.js synth triggered on hover enter.
- **Footstep on navigation** — a soft step sound when the camera moves, reinforcing the "you are walking" metaphor. Debounced to avoid machine-gun footsteps on rapid keyboard input.
- **Audio unlock pattern** — `Tone.start()` called inside the first user interaction handler (click/key/touch). This is the industry standard for avoiding autoplay blocks across all browsers.

---

## technical patterns worth noting

### selective bloom without dual composers
Most Three.js bloom tutorials use a two-composer system (one renders bloom objects, one renders the scene, then they're composited). The gully avoids this entirely: `UnrealBloomPass` threshold set to `0.88`. Lamp bulb meshes use `MeshBasicMaterial({ color: 0xffffff })` — luminance 1.0, well above threshold. Building facades (`#1c1409`) have luminance ~0.06, safely below. Single composer, clean pipeline.

### circular import avoidance
`transition.js` needs access to `camera`, `nav`, and `lookAtTarget` — all created in `scene.js`. But `scene.js` doesn't import `transition.js`. The solution: `initTransition(refs)` pattern. `main.js` boots the scene, then passes refs to the transition system. No circular dependencies, no global state, clean teardown.

### click vs. drag detection
The gully uses click-drag for street panning. But clicking a building should enter it. These two gestures conflict. Solution: record `pointerDownAt` on mousedown, compute pixel distance on mouseup. If `sqrt(dx*dx + dy*dy) > 5`, it's a drag — ignore. Otherwise, raycast against building groups and enter on hit. Same logic works for touch via `touchend` with `changedTouches[0]`.

### lookAt target animation
A naive camera push just moves `camera.position` — but `camera.lookAt` was set once on init, so the camera stares at (0, 1.7, 0) while moving sideways to buildings at x=+8. The view drifts. The fix: a plain `{ x, y, z }` object (`lookAtTarget`) called every frame in the render loop via `camera.lookAt(lookAtTarget.x, lookAtTarget.y, lookAtTarget.z)`. GSAP animates it alongside camera.position. On entry, lookAt slides to `(def.x, 1.7, -2)`. On exit, back to `(0, 1.7, 0)`. Smooth, correct, no drift.

---

## artists & projects to revisit

| name | relevance | link |
|---|---|---|
| M. F. Husain | Indian ink line quality, confident single strokes | — |
| Atul Dodiya | Bombay street scenes as narrative frames | — |
| Saul Bass | Title sequence as spatial storytelling | — |
| Bruno Munari | Editorial design as experience design | — |
| Jockum Nordstrom | Collage illustration, layered paper textures | — |
| *Kentucky Route Zero* | Theatrical flat perspective, buildings as stages | cardboardcomputer.com |
| *Firewatch* | Parallax environment, walk-as-narrative | firewatchgame.com |
| *Papers, Please* | Desk-as-interface, physical metaphor for UI | papersplea.se |
| Pentagram (Paula Scher) | Architectural typography, type as environment | — |
| *Device 6* (Simogo) | Text-as-space, reading as navigation | — |

---

*last updated: 2026-04-14*
