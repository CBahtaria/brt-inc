(function() {
  const KEY = 'brt-theme';
  const THEMES = ['dark', 'light', 'midnight'];
  function apply(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(KEY, t);
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const icons = { dark: '◑', light: '○', midnight: '●' };
    btn.textContent = icons[t] || '◑';
    btn.setAttribute('aria-label', 'Theme: ' + t + ' — click to cycle');
  }
  function init() {
    const stored = localStorage.getItem(KEY);
    if (stored && THEMES.includes(stored)) { apply(stored); return; }
    apply(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  }
  window.__brtCycleTheme = function() {
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    apply(THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length]);
  };
  init();
})();
