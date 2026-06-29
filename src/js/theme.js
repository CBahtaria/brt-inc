(function() {
  const KEY = 'brt-theme';
  const THEMES = ['auto', 'dark', 'light', 'midnight'];
  const MQ = window.matchMedia('(prefers-color-scheme: dark)');

  function systemTheme() {
    return MQ.matches ? 'dark' : 'light';
  }

  function apply(t) {
    localStorage.setItem(KEY, t);
    const effective = (t === 'auto') ? systemTheme() : t;
    document.documentElement.setAttribute('data-theme', effective);
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const icons = { auto: '◎', dark: '◑', light: '○', midnight: '●' };
    btn.textContent = icons[t] || '◎';
    btn.setAttribute('aria-label', 'Theme: ' + t + ' — click to cycle');
  }

  MQ.addEventListener('change', function() {
    if (localStorage.getItem(KEY) === 'auto') {
      document.documentElement.setAttribute('data-theme', systemTheme());
    }
  });

  window.__brtCycleTheme = function() {
    const cur = localStorage.getItem(KEY) || 'auto';
    apply(THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length]);
  };

  (function init() {
    const stored = localStorage.getItem(KEY);
    apply((stored && THEMES.includes(stored)) ? stored : 'auto');
  })();
})();
