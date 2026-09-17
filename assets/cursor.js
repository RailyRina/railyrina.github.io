/* The cursor stays the system default. Every so often — for about 20 seconds — the little
   soot spirit with the star takes its place (it points with the star's tip). The first
   visit happens within the first half-minute on the page; after that it comes back every
   45–90 seconds. Pointer devices only; touch screens never see a cursor. The PNG is cut
   from the original in Cursors/ by scratchpad/png-cursor.js: background removed, 2px pixels. */
(function () {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const SPIRIT = 'assets/cursor/spirit.png';
  const style = document.createElement('style');
  style.textContent = 'html.cur-sprite, html.cur-sprite body, html.cur-sprite *{cursor:url(' + SPIRIT + ') 28 0, auto !important}';
  document.head.appendChild(style);
  new Image().src = SPIRIT;                       // warm the cache so the swap is instant

  const SHOW = 20000;
  const first = 8000 + Math.random() * 20000;     // somewhere in the first 30s
  const later = () => 45000 + Math.random() * 45000;
  (function cycle(delay) {
    setTimeout(() => {
      document.documentElement.classList.add('cur-sprite');
      setTimeout(() => { document.documentElement.classList.remove('cur-sprite'); cycle(later()); }, SHOW);
    }, delay);
  })(first);
})();
