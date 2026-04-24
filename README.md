# Sujitha Suresh Rao — Personal Portfolio

> **Live site → [sujitha-rao.github.io/Portfolio](https://sujitha-rao.github.io/Portfolio)**

A fully hand-crafted personal portfolio for a Senior Software Engineer & SAP BTP Solution Architect. Single-repo static site on GitHub Pages — no framework, no build step, just HTML, CSS, and JavaScript.

---

## ✨ Features

### Design & Animation
- **Particle canvas background** — floating skill nodes (Java, AWS, K8s, SAP BTP…), binary rain columns, animated circuit traces, drifting hexagons
- **Custom teal cursor** — dot + ring follower; auto-hidden on touch devices
- **Corporate SSR loading screen** — spinning rings + "SSR" initials, auto-dismisses on load
- **Typewriter role cycling** in hero

### Hero Section
- Real profile photo in a gradient-bordered circle
- **Visitor greeting post-it** (yellow) — top of hero, shows visitor's city via `ipinfo.io`, styled with Caveat + Jakarta Sans fonts
- **Click-to-reveal post-it notes** — 3-column flex layout (left col | photo | right col) on desktop; swipeable carousel on mobile. Each post-it flips 3D to reveal achievement detail. Chalk sound + star sparkle on reveal.

### Sections

| # | Section | Highlights |
|---|---------|------------|
| Hero | Intro | Visitor post-it · typewriter roles · photo + achievement post-its |
| 01 | About | Bio + 5 Credly-linked certifications |
| 02 | Experience | Animated timeline — SAP Concur · SAP Labs · Unisys · Spectrum |
| 03 | Skills | 6 colour-coded category cards, staggered pill animations |
| 04 | Projects | 6 cards — live iframe (Boarding Pass Re-Imagined) + base64 screenshots |
| 05 | Education | Georgia Tech (OMSCS) + MEC with logos |
| 06 | Resume | Inline PDF embed + download button |
| 07 | Wall of Love | 4 real verbatim LinkedIn testimonials + visitor submission form (mailto) |
| 08 | Connect | LinkedIn badge + "Get in Touch" CTA opens chat widget |

### AI Chat Widget (bottom-right)
- Persona: *Sujitha's AI Assistant*
- Knowledge base: experience, skills, certifications, education, availability
- Collects visitor email → emails full transcript to `sujitharao93@gmail.com` via **FormSubmit.co** (visitor CC'd)
- No API key required for local knowledge-base mode

---

## 🗂 File Structure

```
/
├── index.html       — Full page (all sections, chat widget, loader, visitor post-it)
├── style.css        — All styles (responsive breakpoints, animations, components)
├── main.js          — All JS (canvas, cursor, post-its, chat, visitor greeting)
├── resume.pdf       — Static asset linked from Resume section
├── photo.jpeg       — Profile photo (base64-embedded in HTML)
└── README.md
```

---

## 🚀 Deployment

Deployed via **GitHub Pages** from the `main` branch root.

```
Settings → Pages → Source: Deploy from branch → Branch: main → / (root)
```

Any `git push` to `main` updates the live site within ~60 seconds.

---

## ✉️ Email Setup (FormSubmit — one-time)

1. Visitor enters email in the chat widget and sends a message
2. FormSubmit sends an **activation email** to `sujitharao93@gmail.com`
3. **Click the activation link** once
4. All future chat transcripts deliver automatically; visitor is CC'd

---

## 🛠 Tech Stack

| Layer | Choice |
|-------|--------|
| Hosting | GitHub Pages |
| Languages | HTML5 · CSS3 · Vanilla JavaScript (ES2022) |
| Fonts | DM Serif Display · DM Mono · Plus Jakarta Sans · Caveat |
| Email | FormSubmit.co (free, no API key) |
| Visitor location | ipinfo.io (free tier) |

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| > 960px | Two-column hero, 3-col post-its |
| ≤ 960px | Single-column, post-it carousel |
| ≤ 640px | Full mobile — 16px base, single-column grids |
| ≤ 400px | Small phone — compact padding |

---

## 📄 License

Personal portfolio — all rights reserved. Not a template.

---

*Zero frameworks. Every animation, layout, and interaction hand-coded.*
