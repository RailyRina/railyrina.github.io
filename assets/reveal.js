/* Text reveal: blocks fade in and rise 18px as they enter the viewport, siblings that arrive
   together cascade 70ms apart. Runs once per element. The state class is rv-in, not in — the home page already uses .in for its column wrappers, and a bare in would hand them 60px of padding. Uses an animation rather than a
   transition so it never clobbers the transitions elements already carry (the docked name,
   the case cards, the carousel caption). Off entirely under prefers-reduced-motion. */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const style = document.createElement('style');
  style.textContent =
    '.rv{opacity:0}' +
    '.rv.rv-in{animation:rvUp .75s cubic-bezier(.22,1,.36,1) both}' +
    '@keyframes rvUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}' +
    // word-by-word for the headings that are on screen at load: each word rises .4em with a 40ms stagger
    '.rv-words .rw{display:inline-block;opacity:0}' +
    '.rv-words.rv-in .rw{animation:rvWord .6s cubic-bezier(.22,1,.36,1) both}' +
    '@keyframes rvWord{from{opacity:0;transform:translateY(.4em)}to{opacity:1;transform:none}}';
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

  // headings that greet the visitor get the word-by-word treatment instead of a block fade
  const WORDS = isHome ? '.brand .txt, .intro' : '.main h1';
  document.querySelectorAll(WORDS).forEach(el => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); const nodes = [];
    while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) nodes.push(walker.currentNode);
    let i = 0;
    nodes.forEach(n => {
      const frag = document.createDocumentFragment();
      n.nodeValue.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const w = document.createElement('span'); w.className = 'rw'; w.textContent = part;
        w.style.animationDelay = (i++ * 40) + 'ms'; frag.appendChild(w);
      });
      n.parentNode.replaceChild(frag, n);
    });
    el.classList.add('rv-words');
  });

  let els = [...document.querySelectorAll(SEL)].filter(el => !el.closest(SKIP) && !el.classList.contains('rv-words'));
  // if a parent is in the set, its children ride along — don't animate them twice
  els = els.filter(el => !els.some(o => o !== el && o.contains(el)));
  els.forEach(el => el.classList.add('rv'));
  els = els.concat([...document.querySelectorAll('.rv-words')]);   // observed like the rest; .rv-in fires the words

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
           .forEach((el, i) => { el.style.animationDelay = Math.min(i * 70, 420) + 'ms'; el.classList.add('rv-in'); });
      batch = [];
    }, 16);
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });   // fires once the block crosses a line 8% up from the bottom edge

  els.forEach(el => io.observe(el));
})();
