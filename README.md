# CLA Global — website improvement prototypes (V2)

Five clickable prototypes for improvements to claglobal.com, prepared by ClerksWell following the
phase 1 review (30 September 2026). The CLA Global design layer (colours, type, buttons, imagery
treatment) lives entirely in `src/css/theme.css`; remove that file to get the greyscale prototypes back.

Photography is CLA Global's own, loaded directly from claglobal.com by `src/js/photos.js` (the
mapping of images to pages, insights and countries lives there). Where the images can't load,
illustrated placeholders in the brand palette show instead. Photography © CLA Global; the
repository and site are public, so treat them accordingly. Museo Sans is licensed, so Nunito Sans
stands in for it until we have CLA Global's font files.

## View
Live: https://hrhlescargotleo.github.io/CLA-Global-Roadmap/

Or open `docs/index.html` in a browser. No server or install needed.

GitHub Pages is set to publish from the `docs/` folder on `main`
(Settings → Pages → Deploy from a branch → `main` / `/docs`).

## Prototypes
1. Find a firm — `pages/find-a-firm.html`, plus the firm profile at `pages/firm.html?firm=<id>`
2. A front door for clients — `pages/home.html`, `pages/service.html?service=tax`, `pages/industry.html`
3. Enquiry and RFP — `pages/enquiry.html` (accepts `?firm=` and `?service=`)
4. Join CLA Global — `pages/join.html`, plus the questionnaire at `pages/application.html`
5. Insights and research — `pages/insights.html`, `pages/article.html?id=<id>`, `pages/report.html`

Module library: `modules/library.html`. Requirements: `requirements/requirements.md`.

## Build
```
node build-includes.js && node validate.js
```
Edit files in `src/`; `docs/` is generated (commit it, as GitHub Pages serves it). The prototype
navigator (top bar with the Notes switch) and the previous/next footer live in `src/includes/`.

## Data
Firm names, countries and cities are from the network and alliance lists on claglobal.com.
People, emails (all @example.com), services, industries, figures, case studies and the research
report are sample data in `src/js/data.js`. The repository and Pages site are public.

## Status
V2, designed prototypes for internal review (V1 was the greyscale round). CLA Global's own header and footer are replaced by a
prototype navigator. Notes are off by default; switch "Notes on" in the top bar to show what each
prototype proposes and why, plus in-page annotations.
