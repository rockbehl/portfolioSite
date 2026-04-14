# ranveer behl

A 3D interactive portfolio built as a night-time walk down a Fort Mumbai gully — Horniman Circle Marg. Five buildings, each a section of the site. Click a building to push through its entrance into a magazine-style editorial spread.

→ **[Live site](https://ranveerbehl.com)** *(coming soon)*

---

## stack

| tool | version | role |
|---|---|---|
| Vite + vanilla JS | — | build tool, no framework |
| Three.js | r174 | 3D gully scene, ink/crosshatch shader |
| GSAP | 3 | camera push, page-turn transitions |
| Tone.js | 14.x | ambient street soundscape |
| Formspree | — | contact form backend |
| Vercel / Netlify | — | static deployment |

---

## local dev

Node 18+ required (recommend nvm).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run preview
```

---

## updating content

All content lives in one file: **`src/data/content.js`**. That is the only file you need to edit.

```
src/data/content.js
├── about       — bio, tagline, portrait
├── films       — YouTube IDs, titles, formats
├── process     — method, tools, influences, BTS stills
├── otherWork   — photography, sound, writing, other
└── contact     — email, social links, open-to text
```

### adding a film
Open `src/data/content.js`, copy one of the `films` array entries, paste it, and replace `id` with the YouTube video ID (the string after `?v=` in the URL). Set `featured: true` on the film to lead with.

### adding images
- Portrait → `public/images/ranveer.jpg` → set `portrait: '/images/ranveer.jpg'` in `about`
- BTS stills → `public/images/process/` → update `src` paths in `process.stills`
- Other work → `public/images/other-work/` → update `src` paths in `otherWork`

### contact form
1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form, copy the form ID
3. Add `VITE_FORMSPREE_ID=your_form_id` to `.env`

---

## environment variables

```bash
cp .env.example .env
```

| variable | description |
|---|---|
| `VITE_FORMSPREE_ID` | Formspree form ID for the contact form |

Never commit `.env`.

---

## build phases

| phase | description | status |
|---|---|---|
| 1 | Foundation — Vite scaffold, scene, buildings | ✅ done |
| 2 | The Gully — ink shader, street props, navigation | ✅ done |
| 3 | Transition — camera push, magazine covers, page-turn | ✅ done |
| 4 | Interiors — all five magazine spreads | ⬜ todo |
| 5 | Sound — Tone.js ambient soundscape | ⬜ todo |
| 6 | Polish — accessibility, performance, deploy | ⬜ todo |

Progress tracker: open `progress.html` in your browser.

---

*designed and built in Fort Mumbai · april 2026*
