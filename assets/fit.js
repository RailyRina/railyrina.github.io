/* Scales embedded prototypes to their container on small screens. The iframes render at their
   native size (830x812 phone stages, the 1440x900 Tangible UI) and mobile.css applies
   transform:scale(var(--fit)); this keeps --fit = container width / native width. Desktop CSS
   ignores --fit, so nothing changes there. */
(function () {
  const BASES = [['.proto-wrap', 830], ['.hyp-stage', 830], ['.proto-frame', 1440]];
  function fit() {
    BASES.forEach(([sel, base]) => document.querySelectorAll(sel).forEach(el => {
      el.style.setProperty('--fit', (el.clientWidth / base).toFixed(4));
    }));
  }
  addEventListener('resize', fit); addEventListener('load', fit); fit();
})();
