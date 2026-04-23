# Sujitha Suresh Rao — Personal Portfolio

> **Live site → [sujitha-rao.github.io/portfolio](https://sujitha-rao.github.io/portfolio)**

A fully custom, hand-crafted personal portfolio for a Senior Software Engineer & SAP BTP Solution Architect. Built as a single-repo static site deployed on GitHub Pages — no framework, no build step, just clean HTML, CSS, and JavaScript.

---

## ✨ Features

### Design & Animation
- **Corporate particle canvas background** — floating data nodes labelled with real tech skills (Java, AWS, K8s, SAP BTP…), binary rain columns, animated circuit traces with travelling pulse dots, and drifting hexagons
- **Custom teal cursor** — dot + ring, visible only on desktop (auto-hidden on touch devices via `@media (hover:none)`)
- **Frosted glass hero card** — glassmorphism text panel with `backdrop-filter: blur` so the canvas animation shows through
- **Corporate SSR loading screen** — spinning rings + "SSR" initials, auto-dismisses after page load

### Sections
| # | Section | Highlights |
|---|---------|------------|
| Hero | Intro | Typewriter role cycling, photo + click-to-reveal post-it notes (3-col desktop / swipeable carousel mobile) |
| 01 | About | Bio + 5 certifications linked to Credly |
| 02 | Experience | Animated timeline — SAP Concur, SAP Labs, Unisys, Spectrum |
| 03 | Skills | 6 colour-coded category cards with staggered pill animations |
| 04 | Projects | 6 cards with live iframe (Boarding Pass) + embedded screenshots |
| 05 | Education | Georgia Tech logo + MEC |
| 06 | Resume | Open in new tab / Download PDF — no iframe embed |
| 07 | Wall of Love | 4 real verbatim LinkedIn testimonials + visitor submission form |
| 08 | Connect | Email + LinkedIn in one row |
| 09 | Portfolio Analytics | Live visit counter, visitor location, traffic source word clouds |

### Post-it Notes
- **Desktop**: three-column flex layout — left column | photo | right column. Click photo to reveal each post-it one by one with chalk sound + star sparkle animation. Tap each post-it to flip 3D and read the achievement detail.
- **Mobile**: vertical stacked cards below the photo, hidden until photo is tapped.

### AI Chat Widget (bottom-right)
- Persona: *Sujitha's AI Assistant*
- Knowledge base covering experience, tech stack, certifications, education, location, job opportunities, and more
- Collects visitor email, then emails the full conversation to `sujitharao93@gmail.com` via **FormSubmit.co** — visitor is CC'd automatically
- No API key required

### Portfolio Analytics
- Tracks **total visits** per page load (starts at 51, increments on every load including refresh)
- Detects **visitor location** via `ipinfo.io` and stores unique cities in `localStorage`
- Detects **traffic source** (LinkedIn / GitHub / Direct / Other) from `document.referrer`
- Renders **word clouds** for Locations and Traffic Sources — sized proportionally to frequency
- All data stored in `localStorage` — no backend, no privacy risk, no external dependency for the counter

---

## 🗂 File Structure

```
/
├── index.html       — Full page HTML (all sections, chat widget, loader)
├── style.css        — All styles (responsive breakpoints, animations, components)
├── main.js          — All JavaScript (canvas, cursor, post-its, chat, analytics)
├── resume.pdf       — Served as static asset, linked from Resume section
├── photo.jpeg       — Profile photo (base64-embedded in HTML for offline support)
├── worker/
│   ├── index.js     — Cloudflare Worker (Claude AI proxy + Resend email — optional)
│   └── DEPLOY.md    — 5-minute deployment guide for the worker
└── README.md
```

---

## 🚀 Deployment

The site is deployed via **GitHub Pages** from the `main` branch root.

```
Settings → Pages → Source: Deploy from branch → Branch: main → / (root)
```

Any `git push` to `main` automatically updates the live site within ~60 seconds.

---

## ✉️ Email Setup (FormSubmit — one-time activation)

Chat conversations are emailed via [FormSubmit.co](https://formsubmit.co) — completely free, no API key needed.

1. A visitor fills in their email in the chat widget and sends a message
2. FormSubmit sends the first-ever submission as an **activation email** to `sujitharao93@gmail.com`
3. **Click the activation link** (one-time only)
4. All future chat transcripts are delivered automatically — visitor is CC'd

---

## ⚙️ Optional: Cloudflare Worker (Claude AI responses)

To power the chat with real Claude AI responses (instead of the local knowledge base):

1. See `worker/DEPLOY.md` for step-by-step instructions
2. Deploy `worker/index.js` to Cloudflare Workers (free tier)
3. Set env vars: `ANTHROPIC_API_KEY` and `RESEND_API_KEY`
4. Update `WORKER_URL` in `main.js`

---

## 🛠 Tech Stack

| Layer | Choice |
|-------|--------|
| Hosting | GitHub Pages |
| Languages | HTML5 · CSS3 · Vanilla JavaScript (ES2022) |
| Fonts | DM Serif Display · DM Mono · Plus Jakarta Sans · Caveat (Google Fonts) |
| Email | FormSubmit.co (free, no API key) |
| Location | ipinfo.io (free tier) |
| Analytics | localStorage (no backend) |
| Optional worker | Cloudflare Workers (free tier) |

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| > 960px | Two-column hero, 3-col post-its |
| ≤ 960px | Single-column, post-it carousel |
| ≤ 640px | Full mobile — 16px base, all grids single-column |
| ≤ 400px | Small phone — compact padding, smaller photo |

---

## 📄 License

Personal portfolio — all rights reserved. Not intended as a template.

---

*Built with zero frameworks. Every animation, layout, and interaction hand-coded.*
