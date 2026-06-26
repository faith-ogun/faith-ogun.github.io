# faith-ogun.github.io

Personal site for Faith Ogundimu — PhD researcher in cancer genomics & machine learning, RCSI.
Built with [Astro](https://astro.build). Multi-page, with a journal-club blog and Remotion video explainers.

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # static build → dist/
npm run preview    # serve the build
```

## Structure

```
src/
  pages/           # routes: index, about(→home anchor), research, projects, news, blog, startup
  layouts/         # BaseLayout (SEO + nav + footer)
  components/      # Nav, Footer, Icon, ImgSlot, Tear, Engraving, ComingSoon
  content/blog/    # journal-club posts (markdown + frontmatter)
  styles/global.css
public/assets/     # images, PDFs, and rendered videos (assets/video/*.mp4)
video/             # Remotion project (React/TS) that renders the explainer MP4s
.github/workflows/ # deploy.yml — builds Astro → GitHub Pages (main branch only)
_local/            # NOT COMMITTED — working + private material (see below)
```

## `_local/` (git-ignored)

Everything that should never be published lives here, kept locally only:

- `relevant-info/` — CVs, fellowship docs, journal-club decks & paper PDFs
- `design/` — AI-image staging (drop new generated images here)
- `concept-images/`, `bhamla-reference/` — visual references
- `legacy/` — the old single-file `index.html` + `styles.css` + old `assets/`

## Render videos

```bash
cd video
npx remotion render <id> ../public/assets/video/<id>.mp4
# e.g.  npx remotion render alphagenome-modalities ../public/assets/video/alphagenome-modalities.mp4
```

## Image placeholders

Pages use `<ImgSlot>`: pass a `src` to show a real image, or leave it blank to render
a labelled placeholder. Search the page files for `ImgSlot` / empty `img:` fields to find
slots awaiting real images (the News page cards in particular).
