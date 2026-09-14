/* Text reveal: blocks fade in and rise 18px as they enter the viewport, siblings that arrive
   together cascade 70ms apart. Runs once per element. Uses an animation rather than a
   transition so it never clobbers the transitions elements already carry (the docked name,
   the case cards, the carousel caption). Off entirely under prefers-reduced-motion. */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const style = document.createElement('style');
  style.textContent =
    '.rv{opacity:0}' +
    '.rv.in{animation:rvUp .75s cubic-bezier(.22,1,.36,1) both}' +
    '@keyframes rvUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}';
  document.head.appendChild(style);

  const isHome = !!document.querySelector('main > .case');
  const SEL = isHome
    ? '.brand .txt, .intro, .worklist .list, .case h2, .case .kind, .case .desc, ' +
      '.footer .ask, .footer .say, .footer .mail, .footer .social, .footer .note, .footer .legal, .footer .up'
    : '.sidebar .back, .sidenav, .main h1, .main h2, .main h3, .main p, .main .label, .meta > div, ' +
      '.rolecard, .rcard, .quote, .lcols > div, .research-img, ' +
      '.footer .who, .footer .all, .footer .ask, .footer .say, .footer .mail, .footer .social, .footer .note, .footer .legal, .footer .up';
  // things that animate on their own or hold live prototypes — leave them be
  const SKIP = '.carousel, .stage, [class*="-stage"], .rating, .stars, .idea-strip, .proto-wrap, .solution-card, .video, iframe';

  let els = [...document.querySelectorAll(SEL)].filter(el => !el.closest(SKIP));
  // if a parent is in the set, its children ride along — don't animate them twice
  els = els.filter(el => !els.some(o => o !== el && o.contains(el)));
  els.forEach(el => el.classList.add('rv'));

  let batch = [], flush = null;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      batch.push(e.target);
    });
    // everything that became visible in this tick shares one cascade
    clearTimeout(flush);
    flush = setTimeout(() => {
      batch.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
           .forEach((el, i) => { el.style.animationDelay = Math.min(i * 70, 420) + 'ms'; el.classList.add('in'); });
      batch = [];
    }, 16);
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' }   // fires once the block crosses a line 8% up from the bottom edge);

  els.forEach(el => io.observe(el));
})();
