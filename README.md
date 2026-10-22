# CRAPP EDITS — Portfolio

React + Vite + TypeScript + React Three Fiber + GSAP + Framer Motion.

## Run
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # type-check + production build to /dist
    npm run preview    # test the production build

## Edit content
Everything lives in `src/data/site.ts`: contact links, showreel (poster + YouTube/Vimeo/MP4),
about details, projects, services and process. Empty fields are hidden or labeled as placeholders.
Put images in `public/images/` and videos in `public/videos/`, then reference them as `/images/x.jpg`.

## Deploy
Upload `dist/` to Netlify, Vercel or Cloudflare Pages (build command `npm run build`, output `dist`).
