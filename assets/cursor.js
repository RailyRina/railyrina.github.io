/* Custom pixel cursor. The blue pixel arrow from /Cursors everywhere, and every so often —
   for about 20 seconds — the little soot spirit with the star takes its place (pointing with
   the star's tip). Pointer devices only; touch screens never see a cursor. The PNGs are cut
   from the originals by scratchpad/png-cursor.js: background removed, one art pixel = 2px. */
(function () {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const ARROW  = 'assets/cursor/arrow.png';
  const SPIRIT = 'assets/cursor/spirit.png';

  const style = document.createElement('style');
  style.textContent =
    'html, body, *{cursor:url(' + ARROW + ') 0 0, auto}' +
    'a, a *, button, button *, [onclick], [role="button"], .car-btn, .media, .cta{cursor:url(' + ARROW + ') 0 0, pointer}' +
    'html.cur-sprite, html.cur-sprite body, html.cur-sprite *{cursor:url(' + SPIRIT + ') 28 0, auto}';
  document.head.appendChild(style);
  new Image().src = SPIRIT;                       // warm the cache so the swap is instant

  /* the spirit shows up after 30–75s, stays 20s, then the arrow is back; repeats while the page is open */
  const SHOW = 20000;
  const rest = () => 30000 + Math.random() * 45000;
  (function cycle() {
    setTimeout(() => {
      document.documentElement.classList.add('cur-sprite');
      setTimeout(() => { document.documentElement.classList.remove('cur-sprite'); cycle(); }, SHOW);
    }, rest());
  })();
})();
