# Zin Study Studio (`site/`)

Plain `index.html` + `style.css` + `app.js`. No build, no libraries, no server code.

Run: `cd site && python -m http.server 8000`, then open http://localhost:8000 (or open `index.html` directly).

## Look
Pixel-game style: blue night sky with twinkling stars, notched RPG dialog boxes, chunky 3D buttons, trading-card flashcards, segmented meters, and a pixel cat mascot with speech bubbles. Sprites are drawn in code from tiny grids (no image files). Fonts `Press Start 2P` and `VT323` are bundled in `fonts/` (OFL). Animations stop under reduced-motion. Meters show real review data only; there is no XP, streak or timer.

## Courses and textbooks (from `book-inventory.json`)
`node tools/make-catalog.mjs` reads `book-inventory.json` and writes `site/catalog.js` (re-run it whenever the inventory changes). The catalog holds only titles, authors, edition, pages and check status for the 10 retained courses (Logistics Management is slides only) plus the Study Skills Handbook as a reference. File paths, hashes and names found inside documents are left out. On load the site adds any missing catalog courses to your saved data and never removes or renames anything. Library shows a textbook shelf per course, and a card's source can be "Textbook: <title>" with a page number. The book files themselves are not served or read by the site, and no chapters or syllabi are invented.

## What works
- **Library:** add courses, upload `.txt/.md/.csv` (text is read), store `.pdf/.docx/.pptx` by name only (text is NOT extracted; paste it instead), paste text, re-upload keeps older versions. Write cards from document sections; each card keeps its source and location.
- **Study:** 5/15/25-minute budget (about 1 card per minute), optional skippable matching warm-up, type an answer before revealing, hints are recorded.
- **Review rule (Leitner, fixed):** Forgot = due today; Hard = same step; Got it = next step (gaps 1, 3, 7, 14, 30 days). A hint turns "Got it" into Hard. No "Easy" button.
- **Progress:** card states, 7-day accuracy (shows "Insufficient data" under 10 reviews), reviews per day, per-course table, most missed, upcoming reviews, recent sessions.
- **News:** layout with clearly labelled DEMO placeholders. No real news source is connected.
- **Storage:** browser `localStorage`, this device only. Export/import backup on the Progress page (import merges, never deletes).

## Checks run
Syntax check (`node --check`) and scripted headless-Edge runs (study flow, scheduling, persistence; catalog merge for a fresh and a returning user, textbook-sourced cards, duplicate blocking: 16 checks in each of two runs). Not tested: other browsers, real phones, screen readers, PDF/DOCX/PPTX text extraction (not built).

## Limits
Demo news only; no OCR or Office/PDF parsing; no accounts or sync; cards are written by hand, not AI-generated.

## Link previews (Discord, Instagram, etc.)
`index.html` has Open Graph and Twitter-card tags, plus `favicon.svg`, `apple-touch-icon.png` and `og.png` (1200x630). Crawlers need absolute URLs, so after you publish, replace every `https://YOUR-SITE-URL/` in `index.html` with the real address (end with `/`). Until then the preview image will not show. Discord and others cache previews, so re-test with a fresh link after changes. `tools/og.html` and `tools/icon.html` are the sources for the images (screenshot them at 1200x630 and 180x180 to regenerate). Instagram does not show link previews in posts; the image is used when the link is shared in DMs/stories where supported.
