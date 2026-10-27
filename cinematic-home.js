/* Homepage enhancements: keep keyboard navigation and scroll-lock behavior consistent. */
(() => {
  const topExplore = document.querySelector('#topExplore');
  topExplore?.addEventListener('click', (event) => {
    event.preventDefault();
    if (typeof releaseScrollLock === 'function') releaseScrollLock();
    history.replaceState(null, '', '#books');
    document.querySelector('#books')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    });
  });
})();
