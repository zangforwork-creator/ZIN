# Chapter 1 concept learning

The active learning routes use `concept-learning.js`, `adaptive-state.js` and the source-tagged `data/concept-learning.json` catalogue. The existing dashboard, navigation, theme, audio and source library remain available.

## Evidence rules

There are 35 concepts: the 34 authored textbook concepts plus the lecture's customer/consumer distinction. Every card contains a concise definition, an explicitly hypothetical Vietnam example, a misconception, an alternative explanation and source references. The catalogue retains original source questions and adds definition, misconception and application checks. Positive evidence requires an automatically checked response, without hints or a previously answered version of that item on the same Bangkok calendar day.

Concept readiness requires at least three distinct independent items and two consecutive correct answers on different questions. It is labelled **Provisional**, not Secure. Incorrect answers immediately reset readiness and present remediation; another source-tagged variant follows. Secure requires success at a due review on a later day. Review intervals are 1, 3, 7 and then 14 days, measured from a qualifying event. Extra same-day practice does not postpone a due review. Finite pools are explicit: if every available variant has already been seen that day, replay remains practice and cannot create independent evidence.

After each three ready concepts, the required action is contextual practice using recent concepts and historically weak concepts. Matching, gap, classification, sequence and mistake items all write to the same attempt ledger. A wrong game answer interrupts the game for immediate concept repair. Question and session state persist, so changing routes, reloading, or using the former library/quick-start/module URLs cannot bypass the current required action.

## Exam and progression

The final exam opens only when all concepts have readiness evidence, none has a due review, every required interleaved batch is complete, and an unseen question is available for every concept that day. It contains one objective item per concept (including choice and gap formats), plus one short answer and one Vietnam case response. Objective coverage is balanced by the actual concept counts in each LO, with a 35-minute limit and an 80% pass threshold. Feedback is withheld until submission. Unanswered expired items are wrong. Results report each LO and the concepts to repair; wrong answers enter the same concept ledger. A failed exam must be followed by repair before eligibility returns. Short-answer and case responses are formative, require a written response before reference points, and do not independently unlock concepts. Self-assessment is not used as objective correctness evidence.

A pass unlocks Chapter 2's existing source overview. Its interactive concept lessons and final exam are not authored; Chapter 3 and later remain locked. The UI does not claim those chapters have been built.

## One stored learning record

`zin-cb-journey-v1.conceptLearning` stores learned flags, question attempts, one active session, interleaved batches, written drafts and exam reports. Concept status and schedules are derived from this ledger. Every attempt has a concept ID, question ID, LO, related lecture slides, textbook pages, question type, activity, timestamp, correctness and independence/assistance flags.

Existing classic records remain in the same journey backup as an archive, and the former new-page draft record is captured once. Legacy reading completion, XP, self-ratings and old attempt totals are not retroactively credited as mastery. The active dashboard reports canonical concept evidence. Full backup export/import merges this learning record idempotently and retains local drafts. Browser-origin storage is still local: use a backup to move between GitHub Pages and Sites.

## Validation

Run `node --test tests/adaptive-state.test.mjs tests/concept-catalog.test.mjs` and `node scripts/adaptive-qa.mjs`. The latter covers forced checks, wrong-answer remediation, interleaving, classic-route gates, reload, backup restore, due reviews, both sides of the 80% exam threshold, chapter progression and mobile layout. No build is required for GitHub Pages.
