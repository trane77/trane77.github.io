# trane77.github.io

Portfolio built with Astro + React islands, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`
(Settings → Pages → Source: **GitHub Actions**).

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build
node src/lib/sim.test.ts   # check for the data-quality simulation
```

- **New project**: add `src/content/projects/<slug>.mdx` (`repo: owner/name` pulls stars/language/last update from the GitHub API at build time). Use `<Gallery client:visible images={[...]} />` for screenshots.
- **New study**: add `src/content/studies/<slug>.mdx`; interactive figures are React components in `src/components/`.
- **CV**: edit `cv/cv.json`. It feeds both the web page and `cv/cv.typ`, which the deploy workflow compiles to `public/Federico_Ricchiuto_Resume.pdf`. Locally (optional): `typst compile --font-path cv/fonts cv/cv.typ public/Federico_Ricchiuto_Resume.pdf`.
