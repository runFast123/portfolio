# Aman Dubey — Portfolio

Personal portfolio site for Aman Dubey, Python Developer & ML Engineer.

**Live site:** _coming soon_

## Tech stack

- HTML5, CSS3 (Tailwind via CDN), Vanilla JavaScript (ES6+)
- WebGL shader background on the landing page
- HTML5 Canvas for the skill constellation
- Spline 3D viewer for the hero robot
- Lucide Icons, Google Fonts (Inter, JetBrains Mono, Space Grotesk)

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | Landing page with hero + 3D robot |
| `main.html` | Main portfolio (about, skills, projects, contact) |
| `archive.html` | Full project archive in ledger-style table |
| `script.js` | Interactions for `main.html` |
| `landing.js` | WebGL shader for the landing page |
| `styles.css` | Shared custom styles |
| `DESIGN_DOC.md` | Creative rationale + technical notes |

## Run locally

No build step. Open `index.html` directly, or serve the folder with any static server:

```bash
# Python 3
python -m http.server 8000

# Node (if you have npx)
npx serve .
```

Then visit http://localhost:8000.

## Deploy

Works on any static host — GitHub Pages, Netlify, Vercel, Cloudflare Pages. No build command needed; publish directory is the repo root.

## License

All rights reserved.
