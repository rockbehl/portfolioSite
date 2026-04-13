# ranveer behl

**A 3D interactive portfolio** built as a night-time walk down a Fort Mumbai gully — Horniman Circle Marg. Five buildings, each a section of the site. Click a building to push through its entrance into a magazine-style editorial spread.

→ **[Live site](https://ranveerbehl.com)** *(coming soon)*

---

## the concept

The site is the work. The navigation is the experience.

Five buildings on the street, five magazines inside:

| building | magazine | section |
|---|---|---|
| Chai Wala Stall | *Chai Quarterly* | About |
| Regal Cinema | *Reel* | Films |
| Camera Emporium | *The Darkroom* | Process & BTS |
| Kyani & Co. | *Merwan's Table* | Other Work |
| GPO Fort | *The Post* | Contact |

---

## stack

```
Vite + vanilla JS   no framework — full control
Three.js r174       3D gully scene, ink/crosshatch shader
GSAP 3              camera push, page-turn transitions
Tone.js 14          ambient street soundscape
Formspree           contact form backend
Vercel / Netlify    static deployment
```

---

## local dev

You need Node 18+ (recommend using nvm).

```bash
# install dependencies
npm install

# start dev server (opens on http://localhost:3000)
npm run dev

# production build
npm run build

# preview production build
npm run preview
```

---

## updating content

All content lives in one file — **`src/data/content.js`**. That is the only file you ever need to edit to update the site.

```
src/data/content.js
├── about       — bio, tagline, portrait
├── films       — YouTube IDs, titles, formats
├── process     — method, tools, influences, BTS stills
├── otherWork   — photography, sound, writing, other
└── contact     — email, social links, open-to text
```

### adding a film
Open `src/data/content.js`, copy one of the `films` array entries, paste it, and replace the `id` with the YouTube video ID (the string after `?v=` in the URL).

### adding images
- Portrait → `public/images/ranveer.jpg` → set `portrait: '/images/ranveer.jpg'` in `about`
- BTS stills → `public/images/process/` → update `src` paths in `process.stills`
- Other work → `public/images/other-work/` → update `src` paths in `otherWork`

### contact form
1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form, copy the form ID
3. Add `VITE_FORMSPREE_ID=your_form_id` to `.env`

---

## audio

Real `.mp3` files go in `public/audio/`. Until then, Tone.js synthesises placeholder sounds entirely in code — the site works without any audio files.

See `src/audio/soundscape.js` for the full layer breakdown.

---

## environment variables

Copy `.env.example` to `.env` and fill in your values. Never commit `.env`.

```bash
cp .env.example .env
```

| variable | description |
|---|---|
| `VITE_FORMSPREE_ID` | Formspree form ID for the contact form |

---

## build phases

| phase | description | status |
|---|---|---|
| 1 | Foundation — Vite scaffold, scene, buildings | ✅ done |
| 2 | The Gully — ink shader, street props, navigation | ⬜ todo |
| 3 | Transition — camera push, magazine covers, page-turn | ⬜ todo |
| 4 | Interiors — all five magazine spreads | ⬜ todo |
| 5 | Sound — Tone.js ambient soundscape | ⬜ todo |
| 6 | Polish — accessibility, performance, deploy | ⬜ todo |

Progress tracker: open `progress.html` in your browser.

---

## file structure

```
ranveersite/
├── public/
│   ├── audio/              ← .mp3 files (optional, synths used until then)
│   └── images/             ← portrait, BTS stills, other work
├── src/
│   ├── main.js             ← entry point
│   ├── gully/              ← Three.js scene, buildings, shader, navigation
│   ├── interior/           ← magazine spreads (one file per building)
│   ├── audio/              ← Tone.js soundscape
│   ├── data/content.js     ← all content (the only file you edit)
│   └── styles/             ← CSS tokens, shared layout, per-magazine styles
├── .env.example            ← environment variable template
├── CHANGELOG.md            ← what changed and when
└── progress.html           ← visual build tracker (open in browser)
```

---

*designed and built in Fort Mumbai · april 2026*
