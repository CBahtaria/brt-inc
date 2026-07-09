/**
 * InteractiveSelector — vanilla-JS port for brt-inc.
 *
 * Horizontal expanding-panel selector. Click a panel to activate; active takes
 * ~70% of the row and reveals title + description. Staggered mount fade-in
 * from left. Arrow keys navigate. Home/End jump. Enter/Space activate focused.
 * Respects `prefers-reduced-motion`.
 *
 * Usage:
 *   <div id="brt-selector" class="isel" role="tablist" aria-label="Categories">
 *     <!-- InteractiveSelector.mount(el, options) renders panels inside -->
 *   </div>
 *   <script src="/src/js/interactive-selector.js"></script>
 *   <script>
 *     InteractiveSelector.mount(document.getElementById('brt-selector'), [
 *       { id: 'aerial',  title: 'Autonomous Systems', desc: 'Formal safety envelopes and DAL-A-grade governors for UAV fleet operations.', image: '/src/assets/hero/aerial.jpg',   href: '/case/agentic-uav-stack.html' },
 *       { id: 'c2',      title: 'Defence C2',         desc: 'RBAC, 2FA, and hash-chained audit trails for tactical command platforms.', image: '/src/assets/hero/sentinel.jpg', href: '/case/sentinel.html' },
 *       { id: 'ml',      title: 'Applied ML',         desc: 'On-device inference and agricultural decision support for smallholder farmers.', image: '/src/assets/hero/maize.jpg', href: '/case/maize.html' },
 *       { id: 'sim',     title: 'Cultural Simulation', desc: 'Geospatially-grounded interactive worlds honoring Swazi cultural geometry and geology.', image: '/src/assets/hero/mahlanya.jpg', href: '/case/mahlanya.html' },
 *       { id: 'ops',     title: 'Advisory & Ops',     desc: 'Post-audit hardening, compliance gating, and institutional buyer engagement.', image: '/src/assets/hero/ops.jpg', href: '#contact' }
 *     ]);
 *   </script>
 *
 * CSS is co-located below at #isel-styles-init (injected once on first mount).
 * Move to main.css when the pattern earns its slot.
 */
(function (global) {
  'use strict';

  var STAGGER_MS = 180;
  var reduceMotion = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function injectStyles() {
    if (document.getElementById('isel-styles')) return;
    var css = [
      '.isel { display: flex; width: 100%; min-height: 400px; align-items: stretch; overflow: hidden; border-radius: var(--radius-lg, .5rem); }',
      '.isel-panel { position: relative; display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden; min-width: 60px; min-height: 100px; cursor: pointer; background-color: var(--surface, #141416); background-position: center; border: 2px solid var(--border, #252528); opacity: 0; transform: translateX(-60px); }',
      '.isel-panel.is-active { flex: 7 1 0%; border-color: var(--fg, #fff); box-shadow: 0 20px 60px rgba(0,0,0,.5); z-index: 10; background-size: auto 100%; }',
      '.isel-panel:not(.is-active) { flex: 1 1 0%; box-shadow: 0 10px 30px rgba(0,0,0,.3); z-index: 1; background-size: auto 120%; }',
      '.isel-panel.is-mounted { opacity: 1; transform: translateX(0); }',
      '.isel-panel:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }',
      '.isel-scrim { position: absolute; left: 0; right: 0; bottom: -40px; height: 120px; pointer-events: none; box-shadow: inset 0 -120px 0 -120px #000, inset 0 -120px 0 -80px #000; }',
      '.isel-panel.is-active .isel-scrim { bottom: 0; box-shadow: inset 0 -120px 120px -120px #000, inset 0 -120px 120px -80px #000; }',
      '.isel-label { position: absolute; left: 0; right: 0; bottom: 20px; display: flex; align-items: center; gap: 12px; padding: 0 16px; pointer-events: none; z-index: 2; }',
      '.isel-icon { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; flex-shrink: 0; border-radius: 50%; background: rgba(20,20,20,.85); backdrop-filter: blur(10px); border: 2px solid rgba(60,60,60,.9); box-shadow: 0 1px 4px rgba(0,0,0,.18); color: #fff; font-weight: 600; }',
      '.isel-text { color: #fff; white-space: pre; position: relative; }',
      '.isel-title, .isel-desc { display: block; opacity: 0; transform: translateX(25px); }',
      '.isel-title { font-size: 1.125rem; font-weight: 700; }',
      '.isel-desc  { font-size: 1rem; color: rgba(255,255,255,.85); }',
      '.isel-panel.is-active .isel-title, .isel-panel.is-active .isel-desc { opacity: 1; transform: translateX(0); }',
      /* Motion */
      '@media (prefers-reduced-motion: no-preference) {',
      '  .isel-panel { transition: flex-grow 700ms cubic-bezier(.22,1,.36,1), box-shadow 700ms, background-size 700ms, background-position 700ms, opacity 500ms, transform 500ms, border-color 700ms; }',
      '  .isel-scrim { transition: bottom 700ms, box-shadow 700ms; }',
      '  .isel-title, .isel-desc { transition: opacity 700ms, transform 700ms; }',
      '}',
      /* Responsive: stack vertically below 640px */
      '@media (max-width: 640px) {',
      '  .isel { flex-direction: column; min-height: auto; }',
      '  .isel-panel { min-height: 120px; }',
      '  .isel-panel.is-active { min-height: 260px; }',
      '}'
    ].join('\n');
    var s = document.createElement('style');
    s.id = 'isel-styles';
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  }

  function mount(container, options) {
    if (!container || !Array.isArray(options) || options.length === 0) return null;
    injectStyles();
    container.classList.add('isel');
    container.setAttribute('role', 'tablist');
    container.setAttribute('aria-orientation', 'horizontal');
    if (!container.getAttribute('aria-label')) container.setAttribute('aria-label', 'Category selector');
    container.innerHTML = '';

    var state = { activeId: options[0].id };
    var panels = {};

    options.forEach(function (opt) {
      var panel = document.createElement('button');
      panel.type = 'button';
      panel.setAttribute('role', 'tab');
      panel.setAttribute('data-id', opt.id);
      panel.setAttribute('aria-selected', 'false');
      panel.setAttribute('tabindex', '-1');
      panel.className = 'isel-panel';
      panel.style.backgroundImage = "url('" + encodeURI(opt.image) + "')";
      panel.innerHTML =
        '<span class="isel-scrim" aria-hidden="true"></span>' +
        '<span class="isel-label">' +
          '<span class="isel-icon">' + (opt.iconHTML || esc(opt.title.charAt(0))) + '</span>' +
          '<span class="isel-text">' +
            '<span class="isel-title">' + esc(opt.title) + '</span>' +
            '<span class="isel-desc">' + esc(opt.desc || '') + '</span>' +
          '</span>' +
        '</span>';
      panel.addEventListener('click', function () {
        if (opt.href && state.activeId === opt.id) {
          global.location.href = opt.href;
          return;
        }
        activate(opt.id);
      });
      panel.addEventListener('keydown', handleKey);
      panels[opt.id] = panel;
      container.appendChild(panel);
    });

    function activate(id) {
      if (id === state.activeId) return;
      state.activeId = id;
      Object.keys(panels).forEach(function (k) {
        var p = panels[k];
        var active = k === id;
        p.classList.toggle('is-active', active);
        p.setAttribute('aria-selected', active ? 'true' : 'false');
        p.setAttribute('tabindex', active ? '0' : '-1');
      });
    }

    function handleKey(e) {
      var ids = options.map(function (o) { return o.id; });
      var idx = ids.indexOf(state.activeId);
      if (idx < 0) return;
      var next = idx;
      switch (e.key) {
        case 'ArrowRight': next = (idx + 1) % ids.length; break;
        case 'ArrowLeft':  next = (idx - 1 + ids.length) % ids.length; break;
        case 'Home':       next = 0; break;
        case 'End':        next = ids.length - 1; break;
        case 'Enter':
        case ' ':          return; /* already active */
        default: return;
      }
      e.preventDefault();
      activate(ids[next]);
      panels[ids[next]].focus();
    }

    /* Staggered mount fade-in */
    options.forEach(function (opt, i) {
      var delay = reduceMotion ? 0 : STAGGER_MS * i;
      setTimeout(function () {
        panels[opt.id].classList.add('is-mounted');
      }, delay);
    });

    /* Activate initial */
    var initial = state.activeId;
    state.activeId = null;
    activate(initial);

    return {
      activate: activate,
      destroy: function () {
        container.innerHTML = '';
        container.classList.remove('isel');
      }
    };
  }

  global.InteractiveSelector = { mount: mount };
})(window);
