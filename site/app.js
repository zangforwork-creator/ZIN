'use strict';
/* Zin Study Studio. Plain JS, data stored in localStorage on this device only. */

const KEY = 'zin.v1';
const STEPS = [1, 3, 7, 14, 30];          // review gaps in days (a fixed starting rule, not adaptive)
const MAX_FILE = 2 * 1024 * 1024;         // 2 MB
const READABLE = ['txt', 'md', 'csv'];    // text we can really read
const UNREADABLE = ['pdf', 'docx', 'pptx']; // accepted and stored by name only: no text extraction yet

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const z2 = n => String(n).padStart(2, '0');
const dstr = d => d.getFullYear() + '-' + z2(d.getMonth() + 1) + '-' + z2(d.getDate());
const today = () => dstr(new Date());
const addDays = (s, n) => { const [y, m, d] = s.split('-').map(Number); return dstr(new Date(y, m - 1, d + n)); };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const pct = (a, b) => b ? Math.round(100 * a / b) + '%' : '-';

function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v === true) e.setAttribute(k, '');
    else e.setAttribute(k, v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(String(c)));
  return e;
}

let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.textContent = ''; }, 4000);
}

/* ---------- pixel sprites (tiny grids drawn as crisp SVG) ---------- */
const PAL = { l: '#eef6ff', b: '#8ec5ff', d: '#2a5fb0', e: '#050b1a', p: '#ff7ac8', y: '#ffd84a', m: '#7dffb8', w: '#eef6ff', o: '#ff9d4a' };
const SPR = {
  cat: ['ll........ll', 'lbl......lbl', 'lbbl....lbbl', 'lbpbllllbpbl', 'lbbbbbbbbbbl', 'lbbebbbbebbl', 'lbbbbbbbbbbl', 'lbbbbppbbbbl', 'lbbbbbbbbbbl', '.lbbbbbbbbl.', '..llllllll..'],
  home: ['...pp...', '..pppp..', '.pppppp.', 'pppppppp', '.bbbbbb.', '.bbyybb.', '.bbyybb.', '.bbbbbb.'],
  study: ['...yy...', '...yy...', 'yyyyyyyy', '.yyyyyy.', '..yyyy..', '..yyyy..', '.yy..yy.', 'yy....yy'],
  library: ['.dddddd.', 'dbbbbbbd', 'dbwwwwbd', 'dbbbbbbd', 'dbwwwwbd', 'dbbbbbbd', 'dbbbbbbd', '.dddddd.'],
  progress: ['........', '......mm', '......mm', '...yy.mm', '...yy.mm', 'pp.yy.mm', 'pp.yy.mm', 'pppyyymm'],
  pad: ['........', '.dddddd.', 'dbbbbbbd', 'dbybbbpd', 'dyyybpbd', 'dbybbbbd', '.dbbbbd.', '..dddd..'],
  cat_happy: ['ll........ll', 'lbl......lbl', 'lbbl....lbbl', 'lbpbllllbpbl', 'lbbbbbbbbbbl', 'lbeebbbbeebl', 'lbbbbbbbbbbl', 'lbbbppppbbbl', 'lbbbbbbbbbbl', '.lbbbbbbbbl.', '..llllllll..'],
  cat_sleep: ['ll........ll', 'lbl......lbl', 'lbbl....lbbl', 'lbpbllllbpbl', 'lbbbbbbbbbbl', 'lbbbbbbbbbbl', 'lbeebbbbeebl', 'lbbbbppbbbbl', 'lbbbbbbbbbbl', '.lbbbbbbbbl.', '..llllllll..'],
  i_heart: ['.pp..pp.', 'pppppppp', 'pppppppp', 'pppppppp', '.pppppp.', '..pppp..', '...pp...', '........'],
  i_screen: ['dddddddd', 'dbbbbbbd', 'dbmmmbbd', 'dbbbmmbd', 'dbbbbbbd', 'dddddddd', '...dd...', '..dddd..'],
  i_chip: ['..d..d..', 'dddddddd', 'dbbbbbbd', 'dbbyybbd', 'dbbyybbd', 'dbbbbbbd', 'dddddddd', '..d..d..'],
  i_horn: ['......y.', '....yyy.', 'pppyyyyy', 'pppyyyyy', 'pppyyyy.', 'pp.yyy..', 'pp..y...', '........'],
  i_coin: ['..yyyy..', '.yyyyyy.', 'yyyooyyy', 'yyoyyyyy', 'yyyooyyy', 'yyyyyoyy', '.yyyyyy.', '..yyyy..'],
  i_target: ['.pppppp.', 'pwwwwwwp', 'pwppppwp', 'pwpyypwp', 'pwpyypwp', 'pwppppwp', 'pwwwwwwp', '.pppppp.'],
  i_cross: ['d.......', 'd.....pp', 'd...pp..', 'dmmpp...', 'd.pmm...', 'pp..mm..', 'd....mmm', 'dddddddd'],
  i_cart: ['o.......', '.ooooooo', '.obbbbbo', '..obbbo.', '..ooooo.', '..o...o.', '.dd..dd.', '.dd..dd.'],
  i_case: ['...dd...', '..d..d..', 'dddddddd', 'dbbbbbbd', 'dbbyybbd', 'dbbbbbbd', 'dbbbbbbd', 'dddddddd'],
  i_truck: ['........', 'dddddd..', 'dbbbbbdd', 'dbbbbbdy', 'dbbbbbdy', 'dddddddd', '.ee..ee.', '.ee..ee.'],
  news: ['wwwwwwww', 'wddddwbw', 'wddddwbw', 'wwwwwwbw', 'wbbbbbbw', 'wwwwwwww', 'wbbbbbbw', 'wwwwwwww']
};
function sprite(name, scale = 4, cls = '') {
  const rows = SPR[name], h = rows.length, w = rows[0].length, NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.setAttribute('width', w * scale); svg.setAttribute('height', h * scale);
  svg.setAttribute('shape-rendering', 'crispEdges'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('class', 'spr ' + cls);
  rows.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch === '.') return;
    const r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', 1); r.setAttribute('height', 1); r.setAttribute('fill', PAL[ch]);
    svg.append(r);
  }));
  return svg;
}
const empty = msg => el('div', { class: 'empty' }, sprite('cat_sleep', 5), el('p', {}, msg));
const stTag = c => el('span', { class: 'tag st-' + status(c).toLowerCase().replace(' ', '-') }, status(c));
const mascot = (msg, face = 'cat') => el('div', { class: 'hero' }, sprite(face, 10, 'bob'), el('div', { class: 'bubble', role: 'status' }, msg));

/* ---------- course catalog (from book-inventory.json via catalog.js) ---------- */
const CAT = window.CATALOG || { courses: [], reference: [], checked: null };
const catId = slug => 'cat-' + slug;
const COURSE_ICON = { 'consumer-behaviour': 'i_heart', 'digital-marketing': 'i_screen', 'management-information-system': 'i_chip',
  'introduction-to-marketing-career': 'i_horn', 'macroeconomics': 'i_coin', 'principle-of-marketing': 'i_target', 'microeconomics': 'i_cross',
  'e-commerce': 'i_cart', 'business-management': 'i_case', 'logistics-management': 'i_truck' };
const COVER_BG = ['#7dffb8', '#ffd84a', '#ff7ac8', '#6fb0ff', '#ff9d4a'];
function cover(slug, name) {   // generated pixel course cover (replaces image files)
  const i = Math.max(0, CAT.courses.findIndex(c => c.slug === slug));
  return el('div', { class: 'cover', style: '--cv:' + COVER_BG[i % COVER_BG.length] }, sprite(COURSE_ICON[slug] || 'library', 7), el('b', {}, name));
}
const catCourse = id => CAT.courses.find(c => catId(c.slug) === id);
const bookLabel = b => b.title + (b.edition ? ' (' + b.edition + ')' : '');
function syncCatalog(d) {            // adds missing catalog courses; never removes or renames anything
  let changed = false;
  for (const c of CAT.courses) if (!d.courses.some(x => x.id === catId(c.slug))) { d.courses.push({ id: catId(c.slug), name: c.name, catalog: true }); changed = true; }
  return changed;
}

/* ---------- storage ---------- */
function demoData() {
  const cid = 'demo-course';
  const mk = (q, a) => ({ id: uid(), courseId: cid, q, a, source: { docName: 'Demo card (common marketing terms, not from your documents)', loc: '' },
    demo: true, box: 0, due: today(), history: [], created: new Date().toISOString() });
  return {
    courses: [{ id: cid, name: 'Demo: marketing terms', demo: true }],
    docs: [],
    cards: [
      mk('What are the 4Ps of the marketing mix?', 'Product, Price, Place, Promotion.'),
      mk('What does STP stand for in marketing?', 'Segmentation, Targeting, Positioning.'),
      mk('What does AIDA stand for?', 'Attention, Interest, Desire, Action.'),
      mk('Define positioning in one sentence.', "Positioning is the place a brand aims to hold in its target customers' minds compared with competitors.")
    ],
    sessions: [],
    news: { saved: [], hidden: [] },
    prefs: { budget: 15, course: 'all' }
  };
}

let D, storageBroken = false;
function load() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return demoData();
  try {
    const d = JSON.parse(raw);
    d.courses = d.courses || []; d.docs = d.docs || []; d.cards = d.cards || []; d.sessions = d.sessions || [];
    d.news = d.news || { saved: [], hidden: [] }; d.prefs = d.prefs || { budget: 15, course: 'all' };
    return d;
  } catch (e) {
    // Never overwrite unreadable data: keep a copy and start fresh in memory only.
    try { localStorage.setItem(KEY + '.broken', raw); } catch (_) {}
    storageBroken = true;
    return demoData();
  }
}
function save() {
  if (storageBroken) { toast('Saving paused: stored data was unreadable. A copy is kept as zin.v1.broken. Import a backup to continue.'); return false; }
  try { localStorage.setItem(KEY, JSON.stringify(D)); return true; }
  catch (e) { toast('Could not save (storage full or blocked). Export a backup, then free space.'); return false; }
}

/* ---------- review scheduling (Leitner boxes) ----------
   box = number of successful reviews in a row (0-4).
   Forgot  -> box 0, due again today (earlier review).
   Hard    -> same box, next gap = STEPS[max(0, box-1)].
   Got it  -> box+1 (max 4), gap = STEPS[box-1]. Using a hint counts as Hard.
   There is no "Easy" button: mastery rises only through repeated spaced success. */
function grade(card, result, hint) {
  let box = card.box;
  if (result === 'forgot') box = 0;
  else if (result === 'got' && !hint) box = Math.min(box + 1, 4);
  const gap = result === 'forgot' ? 0 : STEPS[Math.max(0, box - 1)];
  card.box = box;
  card.due = addDays(today(), gap);
  card.history.push({ t: new Date().toISOString(), day: today(), result: hint && result === 'got' ? 'hard' : result, hint: !!hint });
}
function status(c) {
  if (!c.history.length) return 'New';
  const last = c.history[c.history.length - 1];
  if (last.result === 'forgot' || c.box === 0) return 'Needs work';
  if (c.box >= 4) return 'Strong';
  return 'Practicing';
}
const dueCards = (cid = 'all') => D.cards.filter(c => c.history.length && c.due <= today() && (cid === 'all' || c.courseId === cid))
  .sort((a, b) => a.due.localeCompare(b.due));
const newCards = (cid = 'all') => D.cards.filter(c => !c.history.length && (cid === 'all' || c.courseId === cid));
const courseName = id => (D.courses.find(c => c.id === id) || { name: 'Unknown course' }).name;

/* ---------- navigation ---------- */
let view = 'home', S = null, W = null, curCourse = null;
function go(v) {
  view = v;
  if (v !== 'study') W = null;
  render();
  $('#app').focus();
}
function render() {
  document.querySelectorAll('nav button').forEach(b => b.setAttribute('aria-current', b.dataset.view === view ? 'page' : 'false'));
  const app = $('#app'); app.replaceChildren();
  app.append(...[views[view]()].flat().filter(Boolean));
}

/* ---------- Home ---------- */
function homeView() {
  const due = dueCards(), nw = newCards();
  const tiles = D.courses.filter(c => c.catalog).map(c => {
    const n = dueCards(c.id).length, cc = catCourse(c.id), k = D.cards.filter(x => x.courseId === c.id).length;
    return el('button', { class: 'ghost course', onclick: () => { curCourse = c.id; go('library'); } },
      el('span', { class: 'ctop' }, sprite(COURSE_ICON[cc.slug] || 'library', 4), el('b', {}, c.name)), el('small', {}, (cc && cc.items[0].kind === 'slides' ? 'Slides' : cc ? cc.items.length + (cc.items.length === 1 ? ' textbook' : ' textbooks') : '') + ' · ' + k + ' cards' + (n ? ' · ' + n + ' due' : '')));
  });
  const behind = D.courses.map(c => ({ c, n: dueCards(c.id).length })).filter(x => x.n > 0).sort((a, b) => b.n - a.n);
  const msg = !D.cards.length ? 'Meow! Add a course and a few cards in the Library to begin.'
    : due.length ? 'Meow! ' + due.length + ' card' + (due.length === 1 ? ' is' : 's are') + ' ready to review. A short session is plenty.'
    : nw.length ? 'Nothing is due. ' + nw.length + ' new card' + (nw.length === 1 ? ' is' : 's are') + ' waiting to be learned.'
    : 'All caught up for now. Rest, or add more cards.';
  const out = [el('h2', {}, 'Today'), mascot(msg)];
  out.push(el('div', { class: 'grid' },
    el('div', { class: 'stat c0' }, el('div', { class: 'big-num' }, due.length), 'due for review'),
    el('div', { class: 'stat c1' }, el('div', { class: 'big-num' }, nw.length), 'new cards'),
    el('div', { class: 'stat c3' }, el('div', { class: 'big-num' }, D.cards.length), 'cards total')));
  out.push(el('button', { class: 'big', onclick: startNow, disabled: !due.length && !nw.length }, 'Start Study Session'));
  out.push(el('p', { class: 'dim', style: 'text-align:center' }, 'Uses your saved time budget (' + D.prefs.budget + ' min). Warm-up is optional.'));
  const row = (icon, title, sub, label, fn) => el('li', {}, sprite(icon, 5), el('div', { class: 'txt' }, el('b', {}, title), el('small', {}, sub)),
    el('button', { class: 'small', onclick: fn }, label));
  out.push(el('div', { class: 'panel' }, el('h3', {}, 'Your board'), el('ul', { class: 'board' },
    row('study', 'Study session', due.length + ' due, ' + nw.length + ' new', 'Go', () => go('study')),
    row('pad', 'Warm-up game', 'Optional, about 2-3 minutes, no timer', 'Play', () => { go('study'); startWarmUp(); }),
    row('library', 'Library', 'Add documents and write cards', 'Open', () => go('library')),
    row('news', 'Market Pulse', 'Demo briefing (no real source yet)', 'Open', () => go('news')))));
  if (behind.length) {
    out.push(el('div', { class: 'panel' }, el('h3', {}, 'Where reviews are waiting'),
      el('ul', {}, behind.map(x => el('li', {}, courseName(x.c.id) + ': ' + x.n + ' due')))));
  }
  if (tiles.length) out.push(el('div', { class: 'panel' }, el('h3', {}, 'Your courses'), el('div', { class: 'courses' }, tiles)));
  const nextDue = D.cards.filter(c => c.history.length && c.due > today()).map(c => c.due).sort()[0];
  if (!due.length && nextDue) out.push(el('p', { class: 'dim' }, 'Nothing due now. Next review: ' + nextDue + '.'));
  return out;
}
function startNow() { buildSession(D.prefs.budget, D.prefs.course); go('study'); }

/* ---------- Study ---------- */
function buildSession(budget, cid) {
  D.prefs.budget = budget; D.prefs.course = cid; save();
  const due = dueCards(cid), nw = newCards(cid);
  const queue = due.concat(nw).slice(0, budget); // about 1 minute per card
  S = { queue, i: 0, revealed: false, hint: false, text: '', results: [], saved: false, cardStart: Date.now(), ms: 0,
    leftDue: Math.max(0, due.length - queue.length) };
}
function studyView() {
  if (W) return warmUpView();
  if (S && S.i < S.queue.length) return studyCard();
  if (S) return studyDone();
  return studySetup();
}
function studySetup() {
  const cid = D.prefs.course;
  const due = dueCards(cid).length, nw = newCards(cid).length;
  const sel = el('select', { id: 'sCourse' }, el('option', { value: 'all' }, 'All courses'),
    D.courses.map(c => el('option', { value: c.id, selected: c.id === cid }, c.name)));
  sel.addEventListener('change', () => { D.prefs.course = sel.value; save(); render(); });
  const budgets = [5, 15, 25].map(b => el('label', { class: 'opt' },
    el('input', { type: 'radio', name: 'budget', value: b, checked: D.prefs.budget === b }), ' ' + b + ' min'));
  const total = due + nw, size = Math.min(D.prefs.budget, total);
  return [el('h2', {}, 'Study'),
    el('fieldset', {}, el('legend', {}, 'Session'),
      el('label', { for: 'sCourse' }, 'Course'), sel,
      el('p', {}, 'Time budget (about 1 minute per card):'), el('div', {}, budgets),
      el('p', { class: 'dim' }, due + ' due, ' + nw + ' new. This session: ' + size + ' card' + (size === 1 ? '' : 's') + '.' +
        (due > D.prefs.budget ? ' Extra due cards wait for the next session; nothing is lost.' : '')),
      el('button', { class: 'big', disabled: !total, onclick: () => {
        const r = document.querySelector('input[name=budget]:checked');
        buildSession(r ? Number(r.value) : 15, sel.value); render();
      } }, 'Start')),
    !total ? empty('Nothing to study right now. Add cards in Library, or come back when reviews are due.') : null,
    el('div', { class: 'panel' }, el('h3', {}, 'Warm-up (optional, 2-3 min)'),
      el('p', { class: 'dim' }, 'Match terms to answers. It does not change your review schedule or mastery.'),
      el('button', { class: 'ghost', onclick: startWarmUp }, 'Play warm-up'))];
}
function studyCard() {
  const c = S.queue[S.i];
  const ta = el('textarea', { id: 'ans', 'aria-label': 'Your answer', placeholder: 'Type what you remember first...', disabled: S.revealed }, null);
  ta.value = S.text;
  ta.addEventListener('input', () => { S.text = ta.value; });
  const hintWord = c.a.split(/\s+/)[0];
  const card = el('div', { class: 'card' },
    el('div', { class: 'ribbon' }, el('span', {}, courseName(c.courseId)), el('span', {}, 'CARD ' + (S.i + 1) + '/' + S.queue.length + ' · ' + status(c).toUpperCase())),
    el('h3', {}, c.q), ta,
    S.hint ? el('p', {}, 'Hint: starts with "' + hintWord + '"') : null,
    !S.revealed ? el('div', { class: 'row' },
      el('button', { onclick: () => { S.hint = true; render(); } , disabled: S.hint }, 'Show hint'),
      el('button', { onclick: () => { S.revealed = true; render(); } }, 'Reveal answer')) : null,
    S.revealed ? [
      el('p', { class: 'answer-box' }, el('b', {}, 'Answer: '), c.a),
      el('p', { class: 'dim' }, 'Source: ' + srcText(c)),
      S.hint ? el('p', { class: 'dim' }, 'You used a hint, so "Got it" counts as Hard.') : null,
      el('div', { class: 'grade', role: 'group', 'aria-label': 'How did it go?' },
        ['forgot|Forgot', 'hard|Hard', 'got|Got it'].map(s => { const [r, l] = s.split('|');
          return el('button', { class: 'g-' + r, onclick: ev => answer(r, ev.target) }, l); }))] : null);
  return [el('h2', {}, 'Study'), el('div', { class: 'meter', role: 'progressbar', 'aria-label': 'Session progress', 'aria-valuemin': 0, 'aria-valuemax': S.queue.length, 'aria-valuenow': S.i }, el('i', { style: 'width:' + (100 * S.i / S.queue.length) + '%' })),
    card, el('button', { class: 'ghost small', onclick: () => { S.i = S.queue.length; render(); } }, 'End session')];
}
function answer(result, btn) {
  if (!S || S.locked) return;                      // blocks double clicks / repeated submissions
  S.locked = true;
  document.querySelectorAll('.card button').forEach(b => { b.disabled = true; });
  const c = S.queue[S.i];
  const usedHint = S.hint;
  grade(c, result, usedHint);
  S.results.push({ id: c.id, result: usedHint && result === 'got' ? 'hard' : result, hint: usedHint, shown: S.revealed });
  S.ms += Math.min(Date.now() - S.cardStart, 120000); // cap per card so idle time is not counted
  save();
  S.i++; S.revealed = false; S.hint = false; S.text = ''; S.locked = false; S.cardStart = Date.now();
  render();
}
function studyDone() {
  if (!S.saved && S.results.length) {
    S.saved = true;
    D.sessions.push({ id: uid(), t: new Date().toISOString(), count: S.results.length,
      got: S.results.filter(r => r.result === 'got').length, mins: Math.max(1, Math.round(S.ms / 60000)) });
    save();
  }
  const n = S.results.length, got = S.results.filter(r => r.result === 'got').length;
  const miss = S.results.filter(r => r.result === 'forgot').map(r => D.cards.find(c => c.id === r.id)).filter(Boolean);
  const out = [el('h2', {}, 'Session done'), mascot(n ? 'Session saved. Cards you missed come back sooner so they stick.' : 'No cards reviewed this time. That is fine.', n ? 'cat_happy' : 'cat_sleep'),
    el('div', { class: 'panel' },
      n ? el('p', {}, 'Reviewed ' + n + ' card' + (n === 1 ? '' : 's') + ': ' + got + ' recalled, ' +
        S.results.filter(r => r.result === 'hard').length + ' hard, ' + miss.length + ' forgotten.') : el('p', {}, 'No cards reviewed.'),
      S.leftDue ? el('p', { class: 'dim' }, S.leftDue + ' more due cards are waiting. No penalty; start another session when ready.') : null)];
  if (miss.length) out.push(el('div', { class: 'panel' }, el('h3', {}, 'Come back to these (due again today)'),
    el('ul', {}, miss.map(c => el('li', {}, c.q + ' → ' + c.a)))));
  out.push(el('div', { class: 'row' }, el('button', { onclick: () => { S = null; render(); } }, 'Back to setup'),
    el('button', { class: 'ghost', onclick: () => go('progress') }, 'See progress')));
  return out;
}

/* ---------- Warm-up (matching game, no timer, no scoring effect) ---------- */
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function startWarmUp() {
  const pool = D.cards.filter(c => D.prefs.course === 'all' || c.courseId === D.prefs.course);
  if (pool.length < 3) { toast('Add at least 3 cards to play the warm-up.'); return; }
  const cards = shuffle(pool).slice(0, 4);
  W = { cards, answers: shuffle(cards.map(c => c.a)), picks: {}, checked: false };
  render();
}
function warmUpView() {
  const rows = W.cards.map(c => {
    const sel = el('select', { 'aria-label': 'Answer for: ' + c.q, disabled: W.checked }, el('option', { value: '' }, '-- choose --'),
      W.answers.map(a => el('option', { value: a, selected: W.picks[c.id] === a }, a)));
    sel.addEventListener('change', () => { W.picks[c.id] = sel.value; });
    const ok = W.checked && W.picks[c.id] === c.a;
    return el('div', { class: 'panel' }, el('b', {}, c.q), sel,
      W.checked ? el('p', { class: ok ? 'ok' : 'err' }, (ok ? 'Correct.' : 'Not quite. Answer: ' + c.a) + ' Source: ' + srcText(c)) : null);
  });
  return [el('h2', {}, 'Warm-up'), el('p', { class: 'dim' }, 'Match each term to its answer. No timer. This does not affect your reviews.'), rows,
    el('div', { class: 'row' },
      !W.checked ? el('button', { onclick: () => { W.checked = true; render(); } }, 'Check') : null,
      el('button', { class: 'ghost', onclick: () => { W = null; render(); } }, W.checked ? 'Done' : 'Skip'))];
}

/* ---------- Library ---------- */
function srcText(c) {
  const s = c.source || {};
  return s.docName ? s.docName + (s.loc ? ', ' + s.loc : '') : 'No source (written by you)';
}
function libraryView() {
  if (!curCourse || !D.courses.find(c => c.id === curCourse)) curCourse = (D.courses.find(c => c.catalog) || D.courses[0] || {}).id || null;
  const out = [el('h2', {}, 'Library')];
  // add course
  const nameIn = el('input', { type: 'text', id: 'newCourse', placeholder: 'e.g. Consumer Behavior', maxlength: 80 });
  out.push(el('form', { class: 'panel', onsubmit: e => {
    e.preventDefault();
    const n = nameIn.value.trim();
    if (!n) return toast('Type a course name first.');
    if (D.courses.some(c => c.name.toLowerCase() === n.toLowerCase())) return toast('That course already exists.');
    const c = { id: uid(), name: n }; D.courses.push(c); curCourse = c.id; save(); render(); toast('Course added.');
  } }, el('label', { for: 'newCourse' }, 'New course'), el('div', { class: 'row' }, nameIn, el('button', { type: 'submit' }, 'Add'))));
  if (!curCourse) { out.push(empty('No courses yet. Add your first course above.')); return out; }

  const sel = el('select', { id: 'cSel' }, D.courses.map(c => el('option', { value: c.id, selected: c.id === curCourse }, c.name)));
  sel.addEventListener('change', () => { curCourse = sel.value; render(); });
  out.push(el('div', { class: 'panel' }, el('label', { for: 'cSel' }, 'Current course'), sel));
  out.push(shelfPanel(), docsPanel(), cardFormPanel(), cardListPanel());
  return out;
}
function bookCard(b) {
  const meta = [b.kind === 'slides' ? b.format || 'Slides' : 'Textbook', b.edition || (b.kind === 'book' ? 'Edition not recorded' : null),
    b.pages ? b.pages + ' pages' : null, b.check].filter(Boolean);
  return el('div', { class: 'book' }, sprite('library', 5),
    el('div', {}, el('b', {}, b.title), b.authors.length ? el('div', { class: 'dim' }, b.authors.join(', ')) : null,
      el('div', {}, meta.map(m => el('span', { class: 'tag' }, m)))));
}
function shelfPanel() {
  const cc = catCourse(curCourse);
  if (!cc) return null;
  const box = el('div', { class: 'panel' }, cover(cc.slug, cc.name), el('h3', {}, 'Textbook shelf'), cc.items.map(bookCard),
    el('p', { class: 'dim' }, 'Listed from your book inventory (checked ' + CAT.checked + '). This site does not open the book files: read them yourself, then cite the page when you write a card.'));
  if (cc.items.some(i => i.kind === 'slides')) box.append(el('p', { class: 'dim' }, 'This course has slides only, not a textbook. Cite slide numbers.'));
  return box;
}
function docsPanel() {
  const docs = D.docs.filter(d => d.courseId === curCourse);
  const file = el('input', { type: 'file', id: 'file', accept: '.txt,.md,.csv,.pdf,.docx,.pptx' });
  file.addEventListener('change', async () => { if (file.files[0]) await addFile(file.files[0]); });
  const pName = el('input', { type: 'text', id: 'pName', placeholder: 'Document name, e.g. Chapter 1 notes', maxlength: 100 });
  const pText = el('textarea', { id: 'pText', placeholder: 'Paste text from a PDF, DOCX or slide here. Leave a blank line between pages or slides.' });
  const box = el('div', { class: 'panel' }, el('h3', {}, 'Documents'),
    el('p', { class: 'dim' }, 'Readable here: .txt, .md, .csv. PDF, DOCX and PPTX can be stored by name but their text is NOT extracted yet; paste their text below to use it. Max 2 MB. Files stay in this browser and are not sent anywhere.'),
    el('label', { for: 'file' }, 'Upload a file'), file,
    el('details', {}, el('summary', {}, 'Or paste text'),
      el('label', { for: 'pName' }, 'Name'), pName, el('label', { for: 'pText' }, 'Text'), pText,
      el('button', { onclick: () => {
        const n = pName.value.trim(), t = pText.value.trim();
        if (!n || !t) return toast('Add both a name and some text.');
        if (addDoc({ name: n, size: t.length, text: t, status: 'ready' })) { pName.value = ''; pText.value = ''; }
      } }, 'Save text')));
  if (!docs.length) box.append(empty('No documents in this course yet.'));
  for (const d of docs) {
    const secs = d.text ? d.text.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean) : [];
    box.append(el('details', {},
      el('summary', {}, d.name + ' (v' + d.version + ') '),
      el('p', { class: 'dim' }, (d.status === 'ready' ? secs.length + ' sections' : 'Text not extracted: ' + d.note) + ' · ' + Math.ceil(d.size / 1024) + ' KB · added ' + d.added.slice(0, 10)),
      secs.slice(0, 200).map((s, i) => el('div', { class: 'sec-item' },
        el('b', {}, 'Section ' + (i + 1)), el('pre', { class: 'sec' }, s.length > 600 ? s.slice(0, 600) + ' ...' : s),
        el('button', { class: 'small', onclick: () => prefillCard(d, 'section ' + (i + 1)) }, 'Make card from this'))),
      secs.length > 200 ? el('p', { class: 'dim' }, 'Showing the first 200 sections.') : null));
  }
  return box;
}
async function addFile(f) {
  const ext = (f.name.split('.').pop() || '').toLowerCase();
  if (f.size > MAX_FILE) return toast('File is over 2 MB. Split it or paste only the part you need.');
  if (READABLE.includes(ext)) {
    let text; try { text = await f.text(); } catch (e) { return toast('Could not read that file. Try again or paste its text.'); }
    if (!text.trim()) return toast('That file is empty.');
    addDoc({ name: f.name, size: f.size, text, status: 'ready' });
  } else if (UNREADABLE.includes(ext)) {
    addDoc({ name: f.name, size: f.size, text: '', status: 'needs-text', note: ext.toUpperCase() + ' text extraction is not supported yet. Paste the text instead.' });
  } else toast('Unsupported file type. Use .txt, .md, .csv, .pdf, .docx or .pptx.');
  const fi = $('#file'); if (fi) fi.value = '';
}
function addDoc(d) {
  const same = D.docs.filter(x => x.courseId === curCourse && x.name === d.name);
  if (same.some(x => x.size === d.size && x.text === d.text)) { toast('This exact document is already in the course.'); return false; }
  D.docs.push({ id: uid(), courseId: curCourse, version: same.length + 1, added: new Date().toISOString(), ...d });
  save(); render();
  toast(d.status === 'ready' ? 'Document saved' + (same.length ? ' as a new version; the old one is kept.' : '.') : 'Stored. ' + d.note);
  return true;
}
let prefill = null;
function prefillCard(d, loc) { prefill = { docId: d.id, loc }; render(); $('#cQ').focus(); }
function cardFormPanel() {
  const docs = D.docs.filter(d => d.courseId === curCourse);
  const q = el('textarea', { id: 'cQ', placeholder: 'Question or term', maxlength: 400 });
  const a = el('textarea', { id: 'cA', placeholder: 'Answer (keep it short)', maxlength: 800 });
  const cc = catCourse(curCourse), books = cc ? cc.items : [];
  const ds = el('select', { id: 'cD' }, el('option', { value: '' }, 'No source (my own)'),
    books.map((b, i) => el('option', { value: 'book:' + i }, (b.kind === 'slides' ? 'Slides: ' : 'Textbook: ') + bookLabel(b))),
    docs.map(d => el('option', { value: d.id, selected: prefill && prefill.docId === d.id }, d.name + ' (v' + d.version + ')')));
  const loc = el('input', { type: 'text', id: 'cL', placeholder: 'e.g. p. 12, slide 5, section 3', maxlength: 80, value: prefill ? prefill.loc : '' });
  prefill = null;
  return el('form', { class: 'panel', onsubmit: e => {
    e.preventDefault();
    const qq = q.value.trim(), aa = a.value.trim();
    if (!qq || !aa) return toast('Write both a question and an answer. Your text is kept.');
    if (D.cards.some(c => c.courseId === curCourse && c.q.toLowerCase() === qq.toLowerCase())) return toast('A card with this question already exists in the course.');
    const doc = docs.find(d => d.id === ds.value), bk = ds.value.startsWith('book:') ? books[Number(ds.value.slice(5))] : null;
    D.cards.push({ id: uid(), courseId: curCourse, q: qq, a: aa, demo: false, box: 0, due: today(), history: [], created: new Date().toISOString(),
      source: bk ? { docName: (bk.kind === 'slides' ? 'Slides: ' : 'Textbook: ') + bookLabel(bk), loc: loc.value.trim() } : doc ? { docId: doc.id, docName: doc.name + ' (v' + doc.version + ')', loc: loc.value.trim() } : { docName: '', loc: '' } });
    if (save()) { render(); toast('Card added.'); }
  } }, el('h3', {}, 'Add a card'),
    el('p', { class: 'dim' }, 'Cards are written by you from your documents, so every card keeps its source. Nothing is auto-generated.'),
    el('label', { for: 'cQ' }, 'Question'), q, el('label', { for: 'cA' }, 'Answer'), a,
    el('label', { for: 'cD' }, 'Source document'), ds, el('label', { for: 'cL' }, 'Location in the source'), loc,
    el('button', { type: 'submit', style: 'margin-top:10px' }, 'Add card'));
}
function cardListPanel() {
  const cards = D.cards.filter(c => c.courseId === curCourse);
  const box = el('div', { class: 'panel' }, el('h3', {}, 'Cards (' + cards.length + ')'));
  if (!cards.length) box.append(empty('No cards yet. Add one above.'));
  for (const c of cards) box.append(el('details', {},
    el('summary', {}, c.q), stTag(c), c.demo ? el('span', { class: 'tag demo' }, 'demo') : null,
    el('p', {}, el('b', {}, 'Answer: '), c.a), el('p', { class: 'dim' }, 'Source: ' + srcText(c) + ' · next review ' + (c.history.length ? c.due : 'not started')),
    el('button', { class: 'small ghost', onclick: () => {
      if (confirm('Delete this card and its review history? This cannot be undone.')) { D.cards = D.cards.filter(x => x.id !== c.id); save(); render(); }
    } }, 'Delete card')));
  return box;
}

/* ---------- Progress ---------- */
function progressView() {
  const out = [el('h2', {}, 'Progress')];
  const all = D.cards.flatMap(c => c.history.map(h => ({ ...h, id: c.id })));
  const cnt = s => D.cards.filter(c => status(c) === s).length;
  out.push(el('div', { class: 'grid' },
    ['New', 'Practicing', 'Needs work', 'Strong'].map((s, i) => el('div', { class: 'stat c' + i }, el('div', { class: 'big-num' }, cnt(s)), s))));
  const enough = all.length >= 10;
  const recent = all.filter(h => h.day >= addDays(today(), -6));
  const rg = recent.filter(h => h.result === 'got').length;
  out.push(el('div', { class: 'panel' }, el('h3', {}, 'Recall accuracy, last 7 days'),
    enough ? el('p', {}, el('span', { class: 'big-num' }, pct(rg, recent.length)), ' recalled without help (' + rg + ' of ' + recent.length + ' reviews)')
      : el('p', { class: 'dim' }, 'Insufficient data. At least 10 reviews are needed; you have ' + all.length + '.')));
  // weekly trend
  const days = []; for (let i = 6; i >= 0; i--) days.push(addDays(today(), -i));
  const per = days.map(d => all.filter(h => h.day === d).length), max = Math.max(1, ...per);
  out.push(el('div', { class: 'panel' }, el('h3', {}, 'Reviews per day'),
    el('div', { class: 'bar', role: 'img', 'aria-label': 'Reviews per day: ' + days.map((d, i) => d + ' ' + per[i]).join(', ') },
      per.map(n => el('div', { style: 'height:' + (100 * n / max) + '%' }))),
    el('div', { class: 'bar-lab' }, days.map((d, i) => el('span', {}, d.slice(5) + ' ' + per[i])))));
  // courses
  const rows = D.courses.map(c => {
    const cs = D.cards.filter(x => x.courseId === c.id);
    return el('tr', {}, el('td', {}, c.name), el('td', {}, cs.length), el('td', {}, cs.filter(x => x.history.length).length),
      el('td', {}, dueCards(c.id).length), el('td', {}, cs.filter(x => status(x) === 'Strong').length));
  });
  out.push(el('div', { class: 'panel' }, el('h3', {}, 'By course'),
    D.courses.length ? el('table', {}, el('tr', {}, ['Course', 'Cards', 'Reviewed', 'Overdue/due', 'Strong'].map(h => el('th', {}, h))), rows)
      : empty('No courses yet.'),
    el('p', { class: 'dim' }, 'Courses are listed separately; no combined percentage because course weights are not defined.')));
  // missed
  const missed = D.cards.map(c => ({ c, n: c.history.filter(h => h.result === 'forgot').length })).filter(x => x.n).sort((a, b) => b.n - a.n).slice(0, 5);
  out.push(el('div', { class: 'panel' }, el('h3', {}, 'Frequently missed'),
    missed.length ? el('ul', {}, missed.map(x => el('li', {}, x.c.q + ' (forgot ' + x.n + '×)'))) : el('p', { class: 'dim' }, 'Nothing missed yet.')));
  // upcoming
  const up = []; for (let i = 0; i < 7; i++) { const d = addDays(today(), i);
    up.push([d, D.cards.filter(c => c.history.length && (i === 0 ? c.due <= d : c.due === d)).length]); }
  out.push(el('div', { class: 'panel' }, el('h3', {}, 'Upcoming reviews'),
    el('ul', {}, up.map(([d, n]) => el('li', {}, (d === today() ? 'Today (incl. overdue)' : d) + ': ' + n)))));
  // sessions
  const ss = D.sessions.slice(-5).reverse();
  out.push(el('div', { class: 'panel' }, el('h3', {}, 'Recent sessions'),
    ss.length ? el('ul', {}, ss.map(s => el('li', {}, s.t.slice(0, 10) + ': ' + s.count + ' cards, ' + s.got + ' recalled, about ' + s.mins + ' min')))
      : el('p', { class: 'dim' }, 'No sessions yet.')));
  out.push(el('details', {}, el('summary', {}, 'How these numbers work'),
    el('p', {}, 'Each review is logged on its card. A card is "Strong" after 4 successful reviews in a row at spaced gaps (1, 3, 7, 14 days); "Needs work" after a miss; "Practicing" otherwise. Using a hint counts as Hard. Opening a lesson, reading news or time online never counts as mastery. Session minutes cap each card at 2 minutes so idle time is excluded. The 1/3/7/14/30-day gaps are a fixed starting rule, not an adaptive model, and recall percentages are simple counts, not forgetting-curve predictions.')));
  out.push(backupPanel());
  return out;
}
function backupPanel() {
  const file = el('input', { type: 'file', accept: '.json', id: 'imp', 'aria-label': 'Choose a backup file' });
  return el('div', { class: 'panel' }, el('h3', {}, 'Backup'),
    el('p', { class: 'dim' }, 'Your data lives only in this browser. Clearing site data or switching devices loses it unless you export. Import merges with existing data and never deletes.'),
    el('div', { class: 'row' }, el('button', { onclick: exportData }, 'Export backup'), file,
      el('button', { onclick: () => importData(file.files[0]) }, 'Import')));
}
function exportData() {
  const a = el('a', { href: URL.createObjectURL(new Blob([JSON.stringify(D, null, 2)], { type: 'application/json' })), download: 'zin-backup-' + today() + '.json' });
  document.body.append(a); a.click(); a.remove(); toast('Backup downloaded.');
}
async function importData(f) {
  if (!f) return toast('Choose a backup .json file first.');
  try {
    const d = JSON.parse(await f.text());
    if (!Array.isArray(d.cards) || !Array.isArray(d.courses)) throw new Error('shape');
    const mergeBy = (mine, theirs, key) => { for (const x of theirs || []) { const i = mine.findIndex(m => m[key] === x[key]); if (i < 0) mine.push(x); } };
    mergeBy(D.courses, d.courses, 'id'); mergeBy(D.docs, d.docs, 'id'); mergeBy(D.sessions, d.sessions, 'id');
    for (const c of d.cards) {
      const mine = D.cards.find(m => m.id === c.id);
      if (!mine) D.cards.push(c);
      else if ((c.history || []).length > mine.history.length) Object.assign(mine, c); // keep the longer history
    }
    if (d.news) { D.news.saved = [...new Set([...D.news.saved, ...(d.news.saved || [])])]; D.news.hidden = [...new Set([...D.news.hidden, ...(d.news.hidden || [])])]; }
    storageBroken = false;
    if (save()) { render(); toast('Backup merged.'); }
  } catch (e) { toast('That file is not a valid Zin backup. Nothing was changed.'); }
}

/* ---------- News (demo data) ---------- */
const TOPICS = { marketing: 'Marketing', economy: 'Economy', world: 'World' };
const NEWS = [
  ['n1', 'marketing', 'Demo: where a marketing headline goes', 'Placeholder text showing where a short "what happened" summary appears.', 'This is where the "why it matters" note appears, with a link to a course only when the relation is clear.'],
  ['n2', 'economy', 'Demo: where an economy headline goes', 'Placeholder text. No real event is described here.', 'A real story would explain the effect on markets or business, and separate facts from analysis.'],
  ['n3', 'world', 'Demo: where a world-affairs headline goes', 'Placeholder text. No real event is described here.', 'A real story would mark unverified details and cite more than one source for developing events.'],
  ['n4', 'marketing', 'Demo: a second marketing slot', 'Placeholder text showing a second story card.', 'Saved and hidden choices persist after reload.'],
  ['n5', 'economy', 'Demo: a second economy slot', 'Placeholder text showing a fifth story card.', 'Reading news never raises course mastery.']
];
let newsFilter = { topics: new Set(Object.keys(TOPICS)), savedOnly: false, showHidden: false };
function newsView() {
  const out = [el('h2', {}, 'Market Pulse'),
    el('div', { class: 'banner' }, 'DEMO DATA. No real news source is connected, so these are layout placeholders, not real stories. Last successful update: never.')];
  out.push(el('fieldset', {}, el('legend', {}, 'Topics'),
    Object.entries(TOPICS).map(([k, v]) => el('label', { class: 'opt' },
      el('input', { type: 'checkbox', checked: newsFilter.topics.has(k), onchange: e => { e.target.checked ? newsFilter.topics.add(k) : newsFilter.topics.delete(k); render(); } }), ' ' + v)),
    el('label', { class: 'opt' }, el('input', { type: 'checkbox', checked: newsFilter.savedOnly, onchange: e => { newsFilter.savedOnly = e.target.checked; render(); } }), ' Saved only'),
    el('label', { class: 'opt' }, el('input', { type: 'checkbox', checked: newsFilter.showHidden, onchange: e => { newsFilter.showHidden = e.target.checked; render(); } }), ' Show hidden')));
  const list = NEWS.filter(n => newsFilter.topics.has(n[1]) && (!newsFilter.savedOnly || D.news.saved.includes(n[0])) &&
    (newsFilter.showHidden || !D.news.hidden.includes(n[0])));
  if (!list.length) out.push(empty('No stories match these filters.'));
  for (const [id, topic, head, what, why] of list) {
    const saved = D.news.saved.includes(id), hidden = D.news.hidden.includes(id);
    const toggle = (arr, id) => { const a = D.news[arr]; const i = a.indexOf(id); i < 0 ? a.push(id) : a.splice(i, 1); save(); render(); };
    out.push(el('div', { class: 'card' }, el('span', { class: 'tag t-' + topic }, TOPICS[topic]), el('span', { class: 'tag' }, 'DEMO'),
      el('h3', {}, head), el('p', {}, el('b', {}, 'What happened: '), what), el('p', {}, el('b', {}, 'Why it matters: '), why),
      el('p', { class: 'dim' }, 'Source: none (demo) · Published: n/a · Updated: n/a'),
      el('div', { class: 'row' },
        el('button', { 'aria-pressed': saved, onclick: () => toggle('saved', id) }, saved ? 'Saved ✓' : 'Save'),
        el('button', { 'aria-pressed': hidden, onclick: () => toggle('hidden', id) }, hidden ? 'Unhide' : 'Hide'),
        el('button', { disabled: true, title: 'No source connected' }, 'Read more (no source)'))));
  }
  return out;
}

/* ---------- boot ---------- */
const views = { home: homeView, study: studyView, library: libraryView, progress: progressView, news: newsView };
document.querySelectorAll('nav button').forEach(b => {
  b.prepend(sprite(b.dataset.view === 'study' ? 'study' : b.dataset.view, 3));
  b.addEventListener('click', () => go(b.dataset.view));
});
$('#logoCat').append(sprite('cat', 6, 'bob'));
try { D = load(); } catch (e) { D = demoData(); storageBroken = true; }
const synced = syncCatalog(D);
if ((synced || !localStorage.getItem(KEY)) && !storageBroken) save();
render();
if (storageBroken) toast('Stored data could not be read. A copy was kept; import a backup to restore.');
