// ─────────────────────────────────────────────────────────────
// content.js — RANVEER'S CONTENT FILE
// Edit this file to update the site.
// No other files need to be touched.
// ─────────────────────────────────────────────────────────────

export const about = {
  name:      'ranveer behl',
  tagline:   'filmmaker. mumbai.',
  location:  'fort, mumbai',
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
    id:          'YOUTUBE_ID_1',    // replace with real YouTube video ID
    title:       'film title one',
    year:        2024,
    format:      'short film',
    duration:    '12:34',
    description: 'PLACEHOLDER — one or two sentences about this film.',
    featured:    true,              // this one appears large at the top
  },
  {
    id:          'YOUTUBE_ID_2',
    title:       'film title two',
    year:        2023,
    format:      'documentary',
    duration:    '28:00',
    description: 'PLACEHOLDER — one or two sentences about this film.',
    featured:    false,
  },
  {
    id:          'YOUTUBE_ID_3',
    title:       'film title three',
    year:        2022,
    format:      'experimental',
    duration:    '6:45',
    description: 'PLACEHOLDER — one or two sentences about this film.',
    featured:    false,
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
  // BTS stills — set src to null to use placeholder polaroid frames
  stills: [
    { src: null, caption: 'PLACEHOLDER — bts caption one' },
    { src: null, caption: 'PLACEHOLDER — bts caption two' },
    { src: null, caption: 'PLACEHOLDER — bts caption three' },
    { src: null, caption: 'PLACEHOLDER — bts caption four' },
  ],
}

export const otherWork = [
  {
    type:        'photography',   // 'photography' | 'sound' | 'writing' | 'other'
    title:       'PLACEHOLDER — project title',
    description: 'PLACEHOLDER — one line.',
    src:         null,            // image path, or null for placeholder
    link:        null,            // external URL for writing/sound, or null
  },
  {
    type:        'sound',
    title:       'PLACEHOLDER — sound piece title',
    description: 'PLACEHOLDER — one line.',
    src:         null,
    link:        null,
  },
  {
    type:        'writing',
    title:       'PLACEHOLDER — essay or piece title',
    description: 'PLACEHOLDER — one line.',
    src:         null,
    link:        null,
  },
  // add more items by copying a block above
]

export const contact = {
  email:      'ranveer@placeholder.com',   // replace with real email
  youtube:    null,                         // channel URL or null
  instagram:  null,                         // handle or null
  vimeo:      null,                         // profile URL or null
  letterboxd: null,                         // profile URL or null
  openTo: `PLACEHOLDER — what ranveer is currently open to.
commissions, collaborations, conversations.
keep it short, keep it warm.`,
}
