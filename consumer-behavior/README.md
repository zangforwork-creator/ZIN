# Consumer Behavior Lab

The Learn illustrations in `assets/learn/` are six original SVG teaching drawings, including the hypothetical two-café scene, buyer/user roles, value, strategy, influences and meaning/evidence. They illustrate concepts rather than document real campaign events. `learn-diagrams.js` supplies the connected chapter map with labelled directional arrows and feedback, keyboard-operable topic nodes, and step diagrams with explicit arrow connectors. Small screens can scroll the large map; the equivalent text connection list remains available. No external image service is needed.

Learn now includes a seven-stage story for each of the five Chapter 1 topics: Predict, Discover, Explore, Case, Apply, Recall and Map. The hypothetical Campus Cup story connects ideas across the chapter. Discover presents one lecture point at a time; the full 34 textbook cards remain available. Explore includes optional concept matching and a customer-value scenario with fee and waiting-time sliders. The Knorr case links to the primary company account and distinguishes exposure from sales evidence.

Predictions, written reflections, current learning stage, hint/reveal use and map-recall drafts persist in `zin-cb-three-parts`. These records also travel with its progress backup. The chapter map expands with self-marked reading completion; View the whole map and Hide keywords provide exploration and recall modes. Reading completion and self-assessment do not update the separate mastery or spaced-review indicators. All new learning text is English. Original shell styles and dashboard are retained.

Guided browser checks: `node scripts/consumer-guided-qa.mjs` covers resume, predictions, hint/reveal behavior, value changes, retryable matching, the real-case source, map completion, keyword recall, backup restore and mobile layout.

The original dashboard and visual design remain at `index.html#home`. Open Chapter 1 to use Learn, Practice and Exam at `#chapter/1`, styled with the existing theme, fonts, panels and navigation. Learn includes five lecture topics, all 34 authored textbook concept cards, expandable diagrams, cases and source references. Practice offers timed gap, matching and keyword target games. The 15-minute exam contains six multiple-choice questions, two gaps, one short answer and one hypothetical case; written work uses model answers and separate rubric self-assessment.

The previous learning library remains at `library.html#home`; its original storage keys are preserved. New chapter drafts and reading completion use `zin-cb-three-parts` on this browser, with export/import controls. Reading completion and game scores do not award mastery. Source slide links require access to the protected Studio library.

Validation: `npm run check`, `npm test`, and `node scripts/consumer-chapter-qa.mjs`. No build step is needed for GitHub Pages. The browser test covers the `/ZIN/` base path, lesson drafts surviving reload, all three games, exam submission, mobile overflow and browser errors.

Website: https://zangforwork-creator.github.io/ZIN/consumer-behavior/

This static learning site runs on GitHub Pages with no runtime API key. Open index.html through an HTTP server for local development. Lessons, activities, notes, review schedules and backups work in the browser.

Browser progress is local and is not shared with the old Sites address. Export/import the existing subject backup to move work; lecture work has a separate backup.

Original textbooks and lecture PDFs are not included. Source buttons retain their exact page references and links to the existing protected Studio materials service; access may require signing in there. The authored learning content remains available independently.

Studio: https://zangforwork-creator.github.io/ZIN/
