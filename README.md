# Kemetian Tours — Clean Static Rebuild

A hand-written, professional rebuild of `kemetiantours.com` (originally a WordPress + Elementor page).
No frameworks, no build step — just semantic HTML, one organized stylesheet, and a small vanilla JS module.

## Project structure

```
kemetian-tours/
├── index.html        # Semantic markup only — no inline styles or scripts
├── css/
│   └── styles.css    # Design tokens + section-by-section styles
├── js/
│   └── main.js       # Nav, tabs, scroll-reveal, form validation
└── README.md
```

## Why the rebuild (vs. cleaning the original file)

The original export was **~323 KB** of generated markup: Elementor runtime configs,
emoji polyfills, jQuery UI, Swiper, six plugin stylesheets, and non-semantic
`div` soup. This rebuild:

- **Separation of concerns** — structure (HTML), presentation (CSS), behavior (JS) in dedicated files
- **~90% smaller payload** and zero render-blocking plugin scripts
- **Semantic & accessible** — landmarks, ARIA tabs, keyboard navigation, skip link, `prefers-reduced-motion`
- **SEO-ready** — meta description, Open Graph tags, proper heading hierarchy, lazy-loaded images

## Running locally

Open `index.html` directly, or serve it:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Things to finish before production

1. **Images** — currently hot-linked from `kemetiantours.com/wp-content/uploads/`.
   Download them into an `assets/img/` folder and update the `src` attributes,
   ideally converting to WebP/AVIF with responsive `srcset`.
2. **Contact form** — `js/main.js` validates client-side only. Wire the marked
   `TODO` in `initContactForm()` to a real endpoint (Formspree, your own API,
   or the existing WordPress REST route).
3. **Favicon** — add `favicon.ico` / `apple-touch-icon.png` and link them in `<head>`.
4. **Analytics** — add your tracking snippet just before `</body>` if needed.

## Design tokens

All colors, fonts, spacing and radii live in `:root` at the top of `styles.css`.
Change the brand there once and it propagates everywhere:

| Token | Value | Role |
|---|---|---|
| `--clr-ink` | `#14202b` | Night-Nile navy (dark sections, text) |
| `--clr-sand` | `#f2ead9` | Limestone / papyrus surfaces |
| `--clr-gold` | `#c99a3c` | Pharaonic gold accent |
| `--clr-nile` | `#1d5c63` | Nile teal (links, primary buttons) |
