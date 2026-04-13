# ranveer behl — portfolio site
## claude code handoff brief

---

## 01. concept overview

A 3D interactive portfolio built as a night-time walk down a Fort Mumbai gully. The visitor navigates a hand-drawn, ink-illustrated street — Horniman Circle Marg — where each building is a section of the site. Clicking a building triggers a camera push through its entrance, opening into a magazine-style interior spread. Closing the magazine returns the visitor to the street.

The site is the work. The navigation is the experience.

---

## 02. the street — five buildings

| building | magazine name | section | palette |
|---|---|---|---|
| Chai Wala Stall | *Chai Quarterly* | About Me | warm cream, amber, burnt sienna |
| Regal Cinema | *Reel* | Films | deep navy, steel blue, tungsten gold |
| Camera Emporium | *The Darkroom* | Process & BTS | sepia, warm grey, off-white |
| Kyani & Co. | *Merwan's Table* | Other Work | terracotta, rust, warm cream |
| GPO Fort | *The Post* | Contact | forest green, aged white, ink black |

All five sit on **Horniman Circle Marg**. The street renders at dusk — amber lamplight, a thin overhead wire with hanging bulbs, cracked stone pavement, a sliver of deep blue-black sky with stars and a partial moon.

---

## 03. visual aesthetic

### exterior — the gully
- **Style:** hand-drawn ink illustration rendered in 3D. Think Sarnath Banerjee graphic novel meets *Illustrated Weekly of India*. Not photorealistic — drawn.
- **Renderer:** Three.js with a custom **ink/crosshatch shader** (cel shading + outline pass using `OutlinePass` from three/addons). Every surface should look like it has been inked. `UnrealBloomPass` is optional — use only on the lamp glow elements, not scene-wide, as it will wash out the ink aesthetic.
- **Postprocessing pipeline order:** `RenderPass` → `OutlinePass` → `UnrealBloomPass` (lamps only, low intensity) → `OutputPass`
- **Colour:** limited, warm palette. Dominant tones: `#1c1409` (deep background), `#e8c87a` (lamplight amber), `#1a1e2e` (night sky). Each building has its own accent colour (see table above).
- **Typography on signage:** use **Playfair Display** or **DM Serif Display** for building signs, painted and slightly imperfect — apply a subtle SVG noise/distress filter to sign text.
- **Depth:** buildings have actual 3D depth (not flat planes). The gully has ~8–10m of perspective. Side walls of buildings visible. Pavement recedes into distance.
- **Details to include:**
  - Overhead electrical wire running the length of the street with hanging bulbs
  - A stray cat silhouette on one rooftop
  - A bicycle leaning against the Camera Emporium
  - Faded political posters on the side wall between buildings
  - Laundry line between the Chai Wala and Cinema
  - A parked autorickshaw at the far end of the street, partially visible

### interior — the magazines
- **Style:** clean editorial. White or near-white backgrounds. Strong typographic hierarchy. Feels like a well-designed Indian arts magazine from the 1970s–80s, but with contemporary precision.
- **Grid:** asymmetric column layouts. Left column narrower (labels, captions, pull quotes), right column wider (content).
- **Typography:**
  - Masthead: **Playfair Display** bold, tracked wide, all lowercase
  - Body: **Lora** or **EB Garamond** — serif, editorial weight
  - Captions/labels: **IBM Plex Mono** — adds a press/print feel
- **Each magazine has its own cover** that appears on camera push-in, then "opens" (page-turn animation) to reveal the spread.

---

## 04. navigation & interactions

### street navigation
- **Mouse/trackpad:** click and drag left/right to walk the street. Scroll wheel also works.
- **Keyboard:** left/right arrow keys to walk. Enter to step into the highlighted building.
- **Mobile:** swipe left/right to walk, tap to enter.
- A subtle **depth-of-field** blur on buildings at the edges of the viewport. The building directly ahead is sharp; those to the sides blur slightly.
- A **"you are here" progress strip** at the bottom of the screen — five dots, one lit per building as you approach it. Building name appears in small monospace text above the active dot.

### entering a building
1. Visitor clicks/taps a building or presses Enter when it's centred.
2. Camera slowly **pushes forward** into the doorway or entrance arch (GSAP `gsap.to(camera.position)`, ~1.2s ease-in-out).
3. Screen fades to the **magazine cover** (full bleed, matching that building's palette).
4. After ~0.6s, the cover **"opens"** with a page-turn CSS animation, revealing the interior spread.
5. Interior is a standard scrollable webpage — no more Three.js, just HTML/CSS.

> **iOS Safari note:** CSS 3D page-turn (`rotateY`) requires `-webkit-` prefixes and `perspective` set on the parent element, not the animating element itself. If performance is poor on mobile, fall back to a simple fade — keep the page-turn for desktop only via a `@media (hover: hover)` check.

### exiting a building
- A small **"← back to the street"** label in the top-left corner in IBM Plex Mono.
- Clicking it reverses: page folds closed, camera pulls back out of the building, return to gully.

---

## 05. interior spreads — content spec

### chai wala stall → *chai quarterly* · about me
- **Cover colour:** `#f5efe0` cream, masthead in `#8a5a20`
- **Spread layout:**
  - Left column: portrait photo of ranveer (or illustrated portrait placeholder), name in large Playfair Display, tagline: *filmmaker. mumbai.*
  - Right column: two-column text layout. Short bio in Lora. A pull quote in large type. A small ink illustration of the Fort skyline as a decorative footer.
  - Bottom strip: "currently based in —" with a location and "available for —" with a short list.
- **Interaction:** none beyond scroll. Warm, personal, simple.

### regal cinema → *reel* · films
- **Cover colour:** `#0e1828` navy, masthead in `#4488cc`
- **Spread layout:**
  - Full-width **featured film** section at the top: YouTube embed (16:9), film title in large type, year, duration, a 2–3 line description in Lora.
  - Below: a **3-column grid of additional films** — each is a YouTube thumbnail that expands to a lightbox embed on click.
  - Far left column (narrow): a vertical "now showing / coming soon" label strip in IBM Plex Mono rotated 90°.
  - Films listed with title, year, format (short / doc / experimental etc.)
- **YouTube integration:**
  - All embeds use the standard YouTube iframe API.
  - Use `youtube-nocookie.com` domain for privacy.
  - Thumbnails fetched via `https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg`
  - Lightbox: clicking a thumbnail opens a modal with the embed. ESC or click outside to close.
- **Data:** films are configured in `src/data/content.js` under the `films` export (see section 13). Do not create a separate films.js data file.

### camera emporium → *the darkroom* · process & bts
- **Cover colour:** `#f0ece4` sepia white, masthead in `#4a3a20`
- **Spread layout:**
  - Left column: a rotating set of BTS stills (static images, not video). Displayed as slightly tilted polaroid-style frames with handwritten-style captions (use **Caveat** font for captions only).
  - Right column: a "method" section — short paragraphs about how ranveer approaches filmmaking. Written in first person. Lora body text.
  - A "tools & kit" section — a simple typographic list of equipment, references, influences. IBM Plex Mono.
  - Scanned notebook page texture as a decorative element (CSS `background-image` with a subtle ruled line pattern).
- **Data:** process content is configured in `src/data/content.js` under the `process` export (see section 13). Do not create a separate process.js data file.

### kyani & co. → *merwan's table* · other work
- **Cover colour:** `#1a0e08` dark amber-brown, masthead in `#dd7733`
- **Spread layout:**
  - A **masonry-style grid** of interdisciplinary work — photography, sound pieces, writing, illustrations.
  - Each item has: a thumbnail/image, a category tag (IBM Plex Mono), a title (Playfair), a one-line description.
  - Clicking a photography item opens a lightbox. Sound pieces open an in-page audio player. Writing links to an external URL or opens a PDF.
  - Header of the spread: "everything else" in large Playfair Display across the full width.
- **Data:** other work is configured in `src/data/content.js` under the `otherWork` export (see section 13). Do not create a separate otherwork.js data file.

### gpo fort → *the post* · contact
- **Cover colour:** `#0e1a0a` forest green, masthead in `#66aa44`
- **Spread layout:**
  - Styled as a **handwritten letter / telegram** aesthetic.
  - At the top: a decorative GPO postmark stamp illustration (SVG).
  - "Dear [visitor]," as the salutation in Playfair italic.
  - A short paragraph about what ranveer is open to (commissions, collaborations, conversations).
  - A minimal contact form below — name, email, message, send. Styled as a telegram form (monospace font, ruled lines, official-looking field labels).
  - Social/contact links at the bottom: email, Vimeo/YouTube, Instagram, letterboxd — each as a small text link in IBM Plex Mono, no icons.
- **Form backend:** use **Formspree** (https://formspree.io) — no backend needed, just a POST endpoint. Add the form endpoint as an environment variable `VITE_FORMSPREE_ID`.

---

## 06. soundscape

Use **Tone.js** for the ambient street audio. All sounds should be subtle — audible but never distracting. A mute toggle lives in the top-right corner of the gully view (small speaker icon, monospace label).

> **Browser autoplay policy:** all browsers block audio until a user gesture occurs. Do not attempt to start the soundscape on page load. Instead, start it on the first click/keypress/swipe anywhere on the scene — use `Tone.start()` inside a one-time user interaction handler. Show a subtle "click to enter" prompt on the landing screen that also serves as the audio unlock gesture.

### layers to compose
| layer | sound | notes |
|---|---|---|
| base | distant Mumbai traffic hum | low frequency, constant, very subtle |
| punctuation | pressure cooker whistle | random interval, 30–90s, brief |
| punctuation | crow call | random, occasional |
| punctuation | distant train horn | faint, every ~60s |
| ambience | old Hindi film song on a radio | very low, comes from the Cinema direction, Kishore Kumar era |
| evening | azaan / muezzin call | plays once on page load at ~20s, distant |
| footsteps | soft footstep sound | plays as visitor "walks" the street |
| building hover | faint interior sound | chai stall: tea pouring; cinema: film reel clicking; camera shop: shutter click; kyani: crockery; gpo: paper rustling |

All audio files should be stored in `/public/audio/`. Use `.mp3` format. Tone.js `Player` for one-shot sounds, `Loop` for continuous layers. Master volume controlled by a single `Tone.Destination.volume` value.

---

## 07. tech stack

```
framework:        Vite + vanilla JS (no React — keep it lightweight)
3d:               Three.js r158+ (install: npm install three)
postprocessing:   import via 'three/addons/' alias (Vite-compatible)
                  e.g. import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js'
                  do NOT use the old 'three/examples/jsm/' path — deprecated in r158+
animation:        GSAP 3 (npm install gsap) — no CDN, bundle it
audio:            Tone.js 14.x (npm install tone) — pin to 14.x, not 15 (API changed)
fonts:            Google Fonts (Playfair Display, Lora, IBM Plex Mono, Caveat)
                  load via @import in base.css, not via <link> in HTML
contact form:     Formspree
deployment:       Vercel or Netlify (static)
```

---

## 08. file structure

```
ranveer-behl/
├── public/
│   ├── audio/
│   │   ├── traffic-hum.mp3
│   │   ├── pressure-cooker.mp3
│   │   ├── crow.mp3
│   │   ├── train-horn.mp3
│   │   ├── radio-song.mp3
│   │   ├── azaan.mp3
│   │   ├── footstep.mp3
│   │   └── hover/
│   │       ├── tea-pour.mp3
│   │       ├── film-reel.mp3
│   │       ├── shutter.mp3
│   │       ├── crockery.mp3
│   │       └── paper-rustle.mp3
│   └── images/
│       ├── process/       ← BTS stills
│       └── other-work/    ← interdisciplinary work images
├── src/
│   ├── main.js            ← entry point
│   ├── gully/
│   │   ├── scene.js       ← Three.js scene setup
│   │   ├── buildings.js   ← building geometry + materials
│   │   ├── shader.js      ← ink/crosshatch shader
│   │   ├── navigation.js  ← mouse/keyboard/touch controls
│   │   └── lighting.js    ← dusk lighting setup
│   ├── interior/
│   │   ├── transition.js  ← camera push + page-turn animation
│   │   ├── about.js       ← chai quarterly spread
│   │   ├── films.js       ← reel spread + youtube
│   │   ├── process.js     ← darkroom spread
│   │   ├── other.js       ← merwan's table spread
│   │   └── contact.js     ← the post spread
│   ├── audio/
│   │   └── soundscape.js  ← Tone.js composition
│   ├── data/
│   │   └── content.js     ← single source of truth for all content (see section 13)
│   └── styles/
│       ├── base.css       ← reset, variables, typography
│       ├── interior.css   ← shared magazine spread styles
│       └── magazines/
│           ├── chai.css
│           ├── reel.css
│           ├── darkroom.css
│           ├── merwans.css
│           └── post.css
├── index.html
├── .env                   ← VITE_FORMSPREE_ID
└── vite.config.js         ← must include: resolve: { alias: { 'three/addons/': path.join(process.cwd(), 'node_modules/three/examples/jsm/') } }
```

---

## 09. css design tokens

```css
:root {
  /* street palette */
  --gully-bg:        #1c1409;
  --gully-sky:       #0d1520;
  --gully-lamp:      #e8c87a;
  --gully-road:      #140f06;
  --gully-wire:      #2a2010;

  /* building accents */
  --chai-accent:     #c8a060;
  --reel-accent:     #1a3a6a;
  --darkroom-accent: #4a3a20;
  --merwans-accent:  #8a4400;
  --post-accent:     #1a3a0e;

  /* magazine interiors */
  --chai-bg:         #f5efe0;
  --reel-bg:         #0e1828;
  --darkroom-bg:     #f0ece4;
  --merwans-bg:      #1a0e08;
  --post-bg:         #0e1a0a;

  /* typography */
  --font-display:    'Playfair Display', Georgia, serif;
  --font-body:       'Lora', Georgia, serif;
  --font-mono:       'IBM Plex Mono', monospace;
  --font-handwritten:'Caveat', cursive;

  /* spacing */
  --spread-max-width: 900px;
  --spread-padding:   3rem;
  --column-gap:       2rem;
}
```

---

## 10. performance notes

- Three.js scene should target **60fps on mid-range laptops**. Keep polygon count low — buildings are low-poly with the ink shader doing the visual heavy lifting.
- Lazy-load magazine interiors — only mount the HTML/CSS for a spread when the visitor enters that building.
- YouTube embeds use `loading="lazy"` and only initialise the iframe API after the spread is open.
- Audio files should be compressed to ~64kbps mp3. Total audio bundle target: under 2MB.
- Add a **"skip to content"** accessibility link that bypasses the 3D scene entirely and lands directly on a plain-text version of the site.
- Respect `prefers-reduced-motion`: when set, disable the camera push, page-turn, and all GSAP animations — use instant cuts instead. The Three.js scene can still render statically.
- Respect `prefers-reduced-motion` for audio too: do not autoplay the soundscape if the user has this set. The mute toggle should default to muted in this case.

---

## 11. meta / seo

```html
<title>ranveer behl</title>
<meta name="description" content="ranveer behl — filmmaker. mumbai." />
<meta property="og:title" content="ranveer behl" />
<meta property="og:description" content="a walk through fort." />
<meta property="og:image" content="/og-image.jpg" />
```

> **og:image placeholder:** create a static `public/og-image.jpg` (1200×630px) as a flat design — the gully colour palette (`#1c1409` background, `#e8c87a` text) with "ranveer behl" in Playfair Display and "a walk through fort." below it. No Three.js render needed for this — pure CSS/canvas screenshot or a hand-made image works fine.

---

## 12. first build order (recommended sequence for claude code)

1. Vite project scaffold + CSS tokens + font imports
2. Three.js scene: sky, ground plane, basic building boxes with correct proportions
3. Building materials + ink shader pass
4. Street details (wire, lamps, props)
5. Navigation controls (mouse drag / keyboard / touch)
6. Camera push transition (GSAP)
7. Magazine cover component (generic, parameterised)
8. Page-turn animation
9. Each interior spread (start with Films — most complex)
10. YouTube embed system + `films.js` data layer
11. Remaining spreads (About, Process, Other Work, Contact)
12. Tone.js soundscape
13. Formspree contact form
14. Accessibility pass (skip link, keyboard nav, reduced-motion media query)
15. Performance audit + deployment

---

## 13. placeholder & temp asset system

All real content — films, images, bio text, contact details — lives in a single `src/data/content.js` file. Claude Code should build every spread reading from this file. When ranveer is ready to update content, he edits only this one file. Nothing else changes.

### the single content file

```js
// src/data/content.js
// ─────────────────────────────────────────────
// RANVEER'S CONTENT FILE
// Edit this file to update the site.
// No other files need to be touched.
// ─────────────────────────────────────────────

export const about = {
  name: 'ranveer behl',
  tagline: 'filmmaker. mumbai.',
  location: 'fort, mumbai',
  available: 'commissions, collaborations, conversations',
  bio: `PLACEHOLDER — ranveer's bio goes here. two or three short paragraphs
about who he is, where he's from, what he makes and why. written
in first person, warm but not self-conscious.`,
  pullQuote: `"PLACEHOLDER — a line ranveer wants to lead with.
something he's said or written that feels true."`,
  // set to null to use illustrated portrait placeholder
  portrait: null, // or: '/images/ranveer.jpg'
}

export const films = [
  {
    id: 'YOUTUBE_ID_1',           // replace with real YouTube video ID
    title: 'film title one',
    year: 2024,
    format: 'short film',
    duration: '12:34',
    description: 'PLACEHOLDER — one or two sentences about this film.',
    featured: true,               // this one appears large at the top
  },
  {
    id: 'YOUTUBE_ID_2',
    title: 'film title two',
    year: 2023,
    format: 'documentary',
    duration: '28:00',
    description: 'PLACEHOLDER — one or two sentences about this film.',
    featured: false,
  },
  {
    id: 'YOUTUBE_ID_3',
    title: 'film title three',
    year: 2022,
    format: 'experimental',
    duration: '6:45',
    description: 'PLACEHOLDER — one or two sentences about this film.',
    featured: false,
  },
  // add more films by copying the block above
]

export const process = {
  intro: `PLACEHOLDER — ranveer's method in his own words. how he
approaches a project, how he thinks about image-making, what
the process feels like from the inside.`,
  tools: [
    'PLACEHOLDER — camera body / kit item',
    'PLACEHOLDER — lens',
    'PLACEHOLDER — editing software',
    'PLACEHOLDER — anything else relevant',
  ],
  influences: [
    'PLACEHOLDER — filmmaker / artist / reference',
    'PLACEHOLDER — filmmaker / artist / reference',
    'PLACEHOLDER — filmmaker / artist / reference',
  ],
  // BTS stills — set src to null to use placeholder image grid
  stills: [
    { src: null, caption: 'PLACEHOLDER — bts caption one' },
    { src: null, caption: 'PLACEHOLDER — bts caption two' },
    { src: null, caption: 'PLACEHOLDER — bts caption three' },
    { src: null, caption: 'PLACEHOLDER — bts caption four' },
  ],
}

export const otherWork = [
  {
    type: 'photography',          // 'photography' | 'sound' | 'writing' | 'other'
    title: 'PLACEHOLDER — project title',
    description: 'PLACEHOLDER — one line.',
    src: null,                    // image path, or null for placeholder
    link: null,                   // external URL for writing/sound, or null
  },
  {
    type: 'sound',
    title: 'PLACEHOLDER — sound piece title',
    description: 'PLACEHOLDER — one line.',
    src: null,
    link: null,
  },
  {
    type: 'writing',
    title: 'PLACEHOLDER — essay or piece title',
    description: 'PLACEHOLDER — one line.',
    src: null,
    link: null,
  },
  // add more items by copying a block above
]

export const contact = {
  email: 'ranveer@placeholder.com',   // replace with real email
  youtube: null,                       // channel URL or null
  instagram: null,                     // handle or null
  vimeo: null,                         // profile URL or null
  letterboxd: null,                    // profile URL or null
  openTo: `PLACEHOLDER — what ranveer is currently open to.
commissions, collaborations, conversations.
keep it short, keep it warm.`,
}
```

---

### placeholder visuals

Claude Code should generate these programmatically — no external placeholder services, no broken image icons.

| asset needed | placeholder approach |
|---|---|
| portrait photo | SVG avatar — ink-style circle with initials "RB" in Playfair Display |
| BTS stills | CSS-generated "polaroid" frames with a ruled crosshatch fill and the caption text |
| YouTube thumbnails | Dark rectangle with a centred play icon and the film title in type — generated from the `films` config |
| other work images | Solid colour blocks using each category's accent colour + category label in IBM Plex Mono |
| og:image | A static PNG render of the gully scene (screenshot during build, or a hand-crafted fallback) |

All placeholder visuals should be clearly styled as placeholders — a small `[placeholder]` label in IBM Plex Mono at the bottom of each, in a muted tone. This makes it obvious what needs replacing without looking broken.

---

### audio placeholders

Tone.js can synthesise placeholder sounds entirely in code — no audio files needed until ranveer sources real recordings.

```js
// src/audio/soundscape.js — placeholder synth sounds

import * as Tone from 'tone'

// traffic hum — low sine wave
const trafficHum = new Tone.Oscillator({
  frequency: 60,
  type: 'sine',
}).connect(new Tone.Volume(-30)).toDestination()

// pressure cooker — short white noise burst
const cooker = new Tone.NoiseSynth({
  noise: { type: 'white' },
  envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.1 },
}).connect(new Tone.Volume(-20)).toDestination()

// crow — simple pitched noise
const crow = new Tone.MetalSynth({
  frequency: 400,
  envelope: { attack: 0.001, decay: 0.4, release: 0.2 },
  harmonicity: 5.1,
  modulationIndex: 32,
  resonance: 4000,
  octaves: 1.5,
}).connect(new Tone.Volume(-18)).toDestination()

// shutter click (camera emporium hover)
const shutter = new Tone.MembraneSynth({
  pitchDecay: 0.008,
  octaves: 2,
  envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 },
}).connect(new Tone.Volume(-10)).toDestination()
```

When real `.mp3` files are added to `/public/audio/`, swap each synth for a `Tone.Player` pointing to the file. The rest of the soundscape logic stays identical.

---

### swapping in real content — ranveer's checklist

When ready to go live, ranveer only needs to do the following:

**text content**
- [ ] open `src/data/content.js`
- [ ] replace every `PLACEHOLDER —` string with real content
- [ ] add real email address and social links in the `contact` object

**films**
- [ ] replace `YOUTUBE_ID_1`, `YOUTUBE_ID_2` etc. with real YouTube video IDs (the string after `?v=` in the video URL)
- [ ] set `featured: true` on the film to lead with

**images**
- [ ] add portrait photo to `/public/images/ranveer.jpg` and set `portrait: '/images/ranveer.jpg'` in `about`
- [ ] add BTS stills to `/public/images/process/` and update the `src` paths in `process.stills`
- [ ] add other work images to `/public/images/other-work/` and update `src` paths in `otherWork`

**audio** (optional — synth placeholders work fine)
- [ ] add `.mp3` files to `/public/audio/`
- [ ] swap `Tone.Oscillator` / `Tone.NoiseSynth` instances for `Tone.Player` instances in `soundscape.js`

**contact form**
- [ ] create a free account at formspree.io
- [ ] create a new form, copy the form ID
- [ ] add `VITE_FORMSPREE_ID=your_form_id` to `.env`

That's the entire content update. No build tools, no code knowledge required beyond opening a JS file and editing strings.

---

*brief prepared for claude code handoff — ranveer behl portfolio · fort mumbai gully concept*
*designed in collaboration with claude, april 2026*
