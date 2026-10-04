# Colin Mendoza — Personal Portfolio

A responsive React website for Colin Mendoza, an Information Science sophomore at Cornell University. The coastal design uses navy blue, purple, warm gold, and off-white, with an original SVG ocean illustration, hover interactions, and a wave wipe when navigating between sections.

## Run locally

Install Node.js 24 LTS, then run in this directory:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To create and preview the production site:

```sh
npm run build
npm run preview
```

## Add your information

Edit `src/content.js`. It contains your bio, interests, skills, contact links, résumé path, projects, and experience. Example object shapes are included in that file. Empty project and experience lists display clearly marked placeholders; empty contact and résumé fields do not create dead links.

Put project images and your résumé in `public/`, then reference them with paths such as `/project.jpg` or `/resume.pdf`. Replace the placeholder project list with real entries as you add your work.

## Files

- `src/main.jsx`: React components, section navigation, and the wave transition.
- `src/styles.css`: responsive layouts, colors, illustrations, and animations.
- `src/content.js`: personal content and portfolio entries.
- `public/favicon.svg`: matching ocean favicon.
- `public/coastline.jpg`: custom aerial shoreline hero image.
- `index.html`: page title, description, and React entry point.

## Accessibility

Includes semantic landmarks, keyboard focus styles, a skip link, an accessible mobile menu, section focus after navigation, and support for reduced motion. All sections remain available through normal scrolling and anchor links. Typography uses Google Fonts with local system fallbacks; artwork is local SVG/CSS.

## Publish on GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds the site and deploys `dist/` to GitHub Pages whenever a commit reaches `main`. In the GitHub repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. After the first successful workflow run, the site will be available at `https://cam587.github.io/`.
