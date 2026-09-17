/* The cursor stays the system default. Every so often — for about 20 seconds — the little
   soot spirit with the star takes its place: it bobs gently and blinks now and then, and the
   pointer's hot spot sits in the middle of the star. First visit within the first half-minute
   on the page, then every 45–90 seconds. Desktop pointers only — never on phones/tablets.
   A CSS cursor can't animate by itself, so the animation is three small PNG frames swapped
   by class (30x46, one art pixel = 1px — small enough to stay a hardware cursor). */
(function () {
  if (!matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches) return;

  const F = ['assets/cursor/spirit.png', 'assets/cursor/spirit-bob.png', 'assets/cursor/spirit-blink.png'];
  const HOT = '15 7';                              // the star's centre
  const style = document.createElement('style');
  style.textContent = F.map((f, i) =>
    'html.cur-sprite.f' + i + ', html.cur-sprite.f' + i + ' body, html.cur-sprite.f' + i + ' *{cursor:url(' + f + ') ' + HOT + ', auto !important}'
  ).join('');
  document.head.appendChild(style);
  F.forEach(f => { new Image().src = f; });        // warm the cache so the swaps are instant

  const html = document.documentElement;
  const setFrame = i => { html.classList.remove('f0', 'f1', 'f2'); html.classList.add('f' + i); };

  const SHOW = 20000;
  const first = 8000 + Math.random() * 20000;      // somewhere in the first 30s
  const later = () => 45000 + Math.random() * 45000;

  (function cycle(delay) {
    setTimeout(() => {
      html.classList.add('cur-sprite'); setFrame(0);
      let bob = 0;
      const bobT = setInterval(() => { bob ^= 1; setFrame(bob); }, 420);            // the gentle up-down
      const blinkT = setInterval(() => {                                           // a blink every 2.5–4s
        if (Math.random() < .35) return;
        setFrame(2); setTimeout(() => setFrame(bob), 140);
      }, 1300);
      setTimeout(() => {
        clearInterval(bobT); clearInterval(blinkT);
        html.classList.remove('cur-sprite', 'f0', 'f1', 'f2');
        cycle(later());
      }, SHOW);
    }, delay);
  })(first);
})();
