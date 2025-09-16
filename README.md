# Taha Amir Khan — Portfolio

This is a lightweight, static portfolio for a Digital/Product Analyst. It’s ready for GitHub Pages and other static hosts.

## Preview locally

- Open `index.html` directly in a browser, or
- Serve with a static server (better caching):
  - Python: `python3 -m http.server` then visit `http://localhost:8000/`
  - Node: `npx serve` inside this folder

## Edit content

- Project cards live in `index.html` (Projects section).
- Full case‑study text is in the JSON script tag with id `projects-data` at the bottom of `index.html`.
- CV and portfolio PDFs live in `assets/`:
  - `assets/taha-amir-khan-cv.pdf`
  - `assets/taha-amir-khan-portfolio.pdf`

## Deploy to GitHub Pages

1) Create a repo (recommended name): `taha-amir-khan-portfolio`.
2) Push this folder’s contents to that repo’s default branch (e.g. `main`).
3) Add an empty `.nojekyll` file at the repo root (already included).
4) In GitHub: Settings → Pages → Build and deployment → Source: “Deploy from a branch”.
   - Branch: `main`
   - Folder: `/ (root)`
5) Save. Your site will be available at:
   - `https://<your-username>.github.io/taha-amir-khan-portfolio/`

Optional: to use a custom domain, set it in Pages and add a CNAME.

## Safety checklist for public repos

- No secrets or API keys in the repo (this site has none).
- Content reviewed for confidentiality/NDA. Case studies are descriptive and omit sensitive internal data.
- PDFs reviewed for metadata you’re comfortable sharing.
- Images/SVGs are safe and license‑appropriate.

## Tech notes

- No build step, no dependencies. Pure HTML/CSS/JS.
- Accessibility: focus states, keyboard support, ESC/backdrop close for modal.
- Performance: lightweight; consider image compression for any future media.

## Theming

- Colours, spacing, and components are in `styles.css`.
- Favicon path: `assets/favicon.svg`.