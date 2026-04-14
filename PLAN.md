# ranveer behl — fort mumbai gully portfolio
## build plan

*last updated: 2026-04-13*

---

## the pitch

A **3D interactive portfolio disguised as a night walk through Fort Mumbai**. Five buildings on Horniman Circle Marg, each housing a magazine-style interior spread. Ink-illustrated Three.js exterior, editorial interiors, Tone.js soundscape, GSAP transitions.

The brief is locked. No scope creep. We build exactly what's described.

---

## phases

### phase 1 — foundation (scaffold + scene) ✅ done
The skeleton. Vite project, CSS tokens, fonts, and a black screen with a lit Three.js scene.

| # | task | files | est |
|---|------|-------|-----|
| 1.1 | Vite scaffold + config + aliases | `vite.config.js`, `package.json`, `index.html` | small |
| 1.2 | CSS design tokens + font imports | `src/styles/base.css` | small |
| 1.3 | Entry point + canvas mount | `src/main.js` | small |
| 1.4 | Three.js scene: sky dome, ground plane | `src/gully/scene.js`, `src/gully/lighting.js` | medium |
| 1.5 | Five building boxes — correct proportions + positions | `src/gully/buildings.js` | medium |
| 1.6 | Content data file with all placeholders | `src/data/content.js` | small |

**milestone:** you see five lit boxes on a dark street in the browser.

---

### phase 2 — the gully comes alive ✅ done
Ink shader, street props, signage, navigation.

| # | task | files | est |
|---|------|-------|-----|
| 2.1 | Ink/crosshatch shader (cel shading + outline pass) | `src/gully/shader.js` | large |
| 2.2 | Postprocessing pipeline (Render → Outline → Bloom → Output) | `src/gully/scene.js` | medium |
| 2.3 | Building signage with Playfair Display + distress filter | `src/gully/buildings.js` | medium |
| 2.4 | Street details: wire, lamps, bulbs, cat, bicycle, rickshaw | `src/gully/buildings.js` | large |
| 2.5 | Dusk lighting: amber lamps, deep blue sky, star field | `src/gully/lighting.js` | medium |
| 2.6 | Navigation: click-drag, scroll, arrow keys, touch swipe | `src/gully/navigation.js` | medium |
| 2.7 | Depth-of-field blur on peripheral buildings | `src/gully/scene.js` | small |
| 2.8 | "You are here" progress strip (5 dots + building name) | `src/gully/navigation.js`, CSS | small |

**milestone:** you can walk down a hand-drawn Fort Mumbai street.

---

### phase 3 — the transition ✅ done
Camera push into buildings, magazine covers, page-turn animation.

| # | task | files | est |
|---|------|-------|-----|
| 3.1 | GSAP camera push into doorway (~1.2s) | `src/interior/transition.js` | medium |
| 3.2 | Magazine cover component (parameterised by building) | `src/interior/transition.js` | medium |
| 3.3 | Page-turn CSS animation (desktop) + fade fallback (mobile) | `src/styles/interior.css` | medium |
| 3.4 | "Back to street" exit flow (reverse transition) | `src/interior/transition.js` | small |

**milestone:** clicking a building takes you inside and back out.

---

### phase 4 — magazine interiors
All five editorial spreads, built from content.js data.

| # | task | files | est |
|---|------|-------|-----|
| 4.1 | Shared magazine layout CSS (grid, columns, typography) | `src/styles/interior.css` | medium |
| 4.2 | **Reel** — films spread + YouTube lightbox system | `src/interior/films.js`, `src/styles/magazines/reel.css` | large |
| 4.3 | **Chai Quarterly** — about spread | `src/interior/about.js`, `src/styles/magazines/chai.css` | medium |
| 4.4 | **The Darkroom** — process/BTS spread | `src/interior/process.js`, `src/styles/magazines/darkroom.css` | medium |
| 4.5 | **Merwan's Table** — other work masonry grid | `src/interior/other.js`, `src/styles/magazines/merwans.css` | medium |
| 4.6 | **The Post** — contact telegram + Formspree form | `src/interior/contact.js`, `src/styles/magazines/post.css` | medium |

**milestone:** all five buildings have working interiors.

---

### phase 5 — sound & soul
Tone.js ambient soundscape layered over the street.

| # | task | files | est |
|---|------|-------|-----|
| 5.1 | Audio unlock on first interaction + "click to enter" prompt | `src/audio/soundscape.js` | small |
| 5.2 | Base layers: traffic hum, punctuation sounds (cooker, crow, train) | `src/audio/soundscape.js` | medium |
| 5.3 | Radio song from Cinema direction + azaan | `src/audio/soundscape.js` | small |
| 5.4 | Footstep sound on navigation | `src/audio/soundscape.js` | small |
| 5.5 | Building hover sounds (tea, reel, shutter, crockery, paper) | `src/audio/soundscape.js` | medium |
| 5.6 | Mute toggle UI | `src/audio/soundscape.js` | small |

**milestone:** the street sounds alive.

---

### phase 6 — polish & ship
Accessibility, performance, SEO, deployment.

| # | task | files | est |
|---|------|-------|-----|
| 6.1 | "Skip to content" link → plain-text fallback | `index.html`, CSS | small |
| 6.2 | `prefers-reduced-motion` — disable animations, mute default | global | small |
| 6.3 | Keyboard accessibility audit (focus, enter, escape) | navigation + interiors | medium |
| 6.4 | Lazy-load interiors + YouTube embeds | transition.js, films.js | small |
| 6.5 | OG image generation (static fallback) | `public/og-image.jpg` | small |
| 6.6 | Meta tags + SEO | `index.html` | small |
| 6.7 | Performance audit (60fps target, bundle size) | all | medium |
| 6.8 | Deploy to Vercel/Netlify | config | small |

**milestone:** live on the internet.

---

## key architectural decisions

1. **No React** — vanilla JS + Vite keeps it light and gives full control over the Three.js lifecycle.
2. **Single content file** — `content.js` is the only file Ranveer ever edits. Everything reads from it.
3. **Synth placeholders** — Tone.js generates all sounds in code. No audio files needed until real recordings arrive.
4. **Programmatic visual placeholders** — SVG/CSS generated, no external services, no broken images.
5. **Progressive enhancement** — 3D scene is the experience, but a skip link provides full content access without it.

---

## risk areas

| risk | mitigation |
|------|------------|
| Ink shader complexity | Start with basic OutlinePass, iterate visually |
| Mobile Three.js perf | Low poly + shader does the heavy lifting, not geometry |
| iOS Safari page-turn | Feature-detect with `@media (hover: hover)`, fade fallback ready |
| Audio autoplay blocking | First-interaction unlock pattern, never autoplay |
| Scope creep | Brief is locked. Build exactly what's written. |
