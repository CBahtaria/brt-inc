(function() {
  const MQ = window.matchMedia('(prefers-color-scheme: dark)');
  localStorage.removeItem('brt-theme');

  function apply() {
    document.documentElement.setAttribute('data-theme', MQ.matches ? 'dark' : 'light');
  }

  MQ.addEventListener('change', apply);
  apply();
})();
