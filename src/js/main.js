/* ─── CONSTANTS ─── */
const PARTICLE = { COUNT: 60, LINK_DIST: 120, SPEED: 0.35, HUE_MIN: 210, HUE_MAX: 230 };
const HERO_SLIDE_MS = 6000;

const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── NAV ─── */
const nav = document.getElementById('nav');
function updateNav() { nav.classList.toggle('scrolled', window.scrollY > 60); }
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ─── PAGE-LOAD HERO STAGGER ─── */
if (!noMotion) {
  document.querySelectorAll('[data-anim]').forEach(el => {
    const isHeadline = el.dataset.anim === '1';
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)' + (isHeadline ? ' skewY(2deg)' : '');
    const delay = parseInt(el.dataset.anim, 10) * 150 + 260;
    setTimeout(() => {
      el.style.transition = 'opacity .7s ease, transform .8s cubic-bezier(.22,1,.36,1)';
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, delay);
  });
}

/* ─── SCROLL REVEAL (IntersectionObserver — broad compatibility) ─── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─── COUNTER ANIMATION ─── */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  if (target === 0 || noMotion) { el.textContent = target; return; }
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOutCubic(p) * target);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); }
  });
}, { threshold: 0.3 });
document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

/* ─── MOBILE MENU ─── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
function closeMobileMenu() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });

/* ─── BACK TO TOP ─── */
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: noMotion ? 'instant' : 'smooth' }));

/* ─── SCROLL INDICATOR ─── */
const scrollInd = document.getElementById('scroll-ind');
if (scrollInd) {
  window.addEventListener('scroll', () => {
    scrollInd.style.opacity = window.scrollY > 80 ? '0' : '';
  }, { passive: true });
}

/* ─── VIDEO PRELOAD FIX ─── */
const heroReel = document.getElementById('hero-reel');
if (heroReel) heroReel.preload = 'metadata';

/* ─── LUCIDE ICONS ─── */
if (typeof lucide !== 'undefined') lucide.createIcons();

/* ════════════════════════════════════════════
   PARTICLE CANVAS
════════════════════════════════════════════ */
(function initParticles() {
  if (noMotion) return;
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  try {
    const ctx = canvas.getContext('2d');
    let W, H, particles;
    let particlesPaused = false;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function mkParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - .5) * PARTICLE.SPEED,
        vy: (Math.random() - .5) * PARTICLE.SPEED,
        r: Math.random() * 1.5 + .6,
        hue: Math.random() > .5 ? PARTICLE.HUE_MIN : PARTICLE.HUE_MAX,
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: PARTICLE.COUNT }, mkParticle);
    }

    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

    new IntersectionObserver(([e]) => { particlesPaused = !e.isIntersecting; })
      .observe(document.getElementById('hero'));

    function draw() {
      if (particlesPaused) { requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, W, H);
      const speedMult = 1 + scrollY / window.innerHeight * 1.8;

      for (const p of particles) {
        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(' + p.hue + ',90%,65%,.55)';
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < PARTICLE.LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(37,99,235,' + ((1 - d / PARTICLE.LINK_DIST) * .12) + ')';
            ctx.lineWidth = .8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    init();
    requestAnimationFrame(draw);
  } catch(e) { console.error('[particles]', e); }
})();

/* ════════════════════════════════════════════
   SCROLL → VIDEO SCRUB
════════════════════════════════════════════ */
(function initVideoScrub() {
  const reel = document.getElementById('hero-reel');
  if (!reel) return;

  reel.addEventListener('canplay', () => {
    reel.play().then(() => {
      setTimeout(() => { reel.pause(); }, 1800);
    }).catch(() => {});
  }, { once: true });

  function onScroll() {
    if (!reel.duration) return;
    const heroEl = document.getElementById('hero');
    const rect   = heroEl.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, 1 - rect.bottom / window.innerHeight));
    reel.currentTime = progress * reel.duration;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ════════════════════════════════════════════
   AUTO-SHUFFLE HERO SLIDES
════════════════════════════════════════════ */
(function initHeroShuffle() {
  const SLIDES = [
    {
      headline: 'Software engineered<br><span class="grad">to ship.</span>',
      sub: 'Custom web applications, security audits, data science, and DevOps infrastructure for SADC organisations. Every project ships with a test suite, CI/CD pipeline, and deployment documentation.',
      badge: 'Available for projects &nbsp;·&nbsp; Manzini, Eswatini',
    },
    {
      headline: 'AI systems built<br><span class="grad" style="background:linear-gradient(90deg,#22c55e,#22d3ee);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">for SADC.</span>',
      sub: 'RAG pipelines, embedding search, and agent orchestration tailored for SADC organisations. Hybrid dense + sparse retrieval. Self-hostable on a single server.',
      badge: 'BRT Platform &nbsp;·&nbsp; AI Orchestration',
    },
    {
      headline: 'Security that<br><span class="grad" style="background:linear-gradient(90deg,#ef4444,#f59e0b);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">actually holds.</span>',
      sub: 'OWASP Top 10 structural audits for PHP, Python, and Node.js. Auth flows, secrets hygiene, injection surfaces, session management. Written report + reproducible fixes.',
      badge: 'UEDF Sentinel Audited &nbsp;·&nbsp; 9 findings resolved',
    },
  ];

  const h1El    = document.querySelector('#hero h1');
  const subEl   = document.getElementById('hero-sub');
  const badgeEl = document.getElementById('badge-text');
  if (!h1El) return;

  let idx = 0;

  function applySlide(slide) {
    const fade = (el, html) => {
      el.style.transition = 'opacity .3s ease, transform .3s ease';
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      setTimeout(() => {
        el.innerHTML = html;
        el.style.transition = 'opacity .5s ease, transform .5s ease';
        el.style.opacity = '1';
        el.style.transform = 'none';
      }, 310);
    };
    fade(h1El, slide.headline);
    if (subEl)   fade(subEl,   slide.sub);
    if (badgeEl) fade(badgeEl, slide.badge);
  }

  const timer = setInterval(() => {
    idx = (idx + 1) % SLIDES.length;
    if (!noMotion) {
      applySlide(SLIDES[idx]);
    } else {
      h1El.innerHTML = SLIDES[idx].headline;
      if (subEl)   subEl.innerHTML   = SLIDES[idx].sub;
      if (badgeEl) badgeEl.innerHTML = SLIDES[idx].badge;
    }
  }, HERO_SLIDE_MS);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(timer);
  });
})();

/* ════════════════════════════════════════════
   PROJECT FILTER (keyboard + ARIA)
════════════════════════════════════════════ */
(function initProjectFilter() {
  const group       = document.querySelector('.proj-filter[role="group"]');
  const btns        = document.querySelectorAll('.filter-btn');
  const cards       = document.querySelectorAll('.proj-grid .proj-card');
  const announcer   = document.getElementById('filter-announcement');

  function applyFilter(btn) {
    btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    const filter = btn.dataset.filter;
    let count = 0;
    cards.forEach(card => {
      const cats = (card.dataset.cat || '').split(' ');
      const hidden = filter !== 'all' && !cats.includes(filter);
      card.classList.toggle('hidden', hidden);
      if (!hidden) count++;
    });
    if (announcer) {
      const label = btn.textContent.trim();
      announcer.textContent = filter === 'all'
        ? `Showing all ${count} projects`
        : `Showing ${count} ${label} project${count !== 1 ? 's' : ''}`;
    }
  }

  btns.forEach((btn, i) => {
    btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
    btn.addEventListener('click', () => applyFilter(btn));
    btn.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        btns[(i + 1) % btns.length].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        btns[(i - 1 + btns.length) % btns.length].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        btns[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        btns[btns.length - 1].focus();
      }
    });
  });
})();

/* ════════════════════════════════════════════
   CHARACTER COUNTS (name + email inputs)
════════════════════════════════════════════ */
(function initCharacterCounts() {
  [['cf-name', 80], ['cf-email', 254]].forEach(([id, max]) => {
    const input   = document.getElementById(id);
    const counter = document.getElementById(id + '-count');
    if (!input || !counter) return;
    function update() {
      const len = input.value.length;
      counter.textContent = len + ' / ' + max;
      counter.classList.toggle('near-limit', len >= Math.floor(max * 0.85) && len < max);
      counter.classList.toggle('at-limit',   len >= max);
    }
    input.addEventListener('input', update);
    update();
  });
})();

/* ════════════════════════════════════════════
   INFO TIPS ("Why .dev?")
════════════════════════════════════════════ */
(function initInfoTips() {
  document.querySelectorAll('.cf-info-tip').forEach(btn => {
    const targetId = btn.getAttribute('aria-controls');
    const target   = targetId ? document.getElementById(targetId) : null;
    if (!target) return;
    btn.addEventListener('click', () => {
      const open = target.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    btn.setAttribute('aria-expanded', 'false');
  });
})();

/* ════════════════════════════════════════════
   STICKY CTA DOCK
════════════════════════════════════════════ */
(function initCtaDock() {
  const dock    = document.getElementById('cta-dock');
  const closeBtn = document.getElementById('dock-close');
  const btt     = document.getElementById('back-top');
  const waFab   = document.getElementById('wa-fab');
  if (!dock || !closeBtn) return;
  let dismissed = false;
  function setPushed(on) {
    if (btt)   btt.classList.toggle('dock-pushed', on);
    if (waFab) waFab.classList.toggle('dock-pushed', on);
  }
  function updateDock() {
    if (dismissed) return;
    const show = window.scrollY > 450;
    dock.classList.toggle('visible', show);
    dock.setAttribute('aria-hidden', String(!show));
    setPushed(show);
  }
  window.addEventListener('scroll', updateDock, { passive: true });
  closeBtn.addEventListener('click', () => {
    dismissed = true;
    dock.classList.remove('visible');
    dock.setAttribute('aria-hidden', 'true');
    setPushed(false);
  });
  dock.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    dock.classList.remove('visible');
    setPushed(false);
  }));
})();

/* ════════════════════════════════════════════
   SCROLLSPY
════════════════════════════════════════════ */
(function initScrollspy() {
  const ids = ['portfolio', 'pricing', 'contact'];
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const link = document.querySelector(`.nav-links a[data-nav="${e.target.id}"]`);
      if (link) link.classList.toggle('nav-active', e.isIntersecting);
    });
  }, { threshold: 0.35 });
  ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
})();

/* ════════════════════════════════════════════
   SECTION DOTS
════════════════════════════════════════════ */
(function initSectionDots() {
  const dots = document.querySelectorAll('.section-dot');
  const obs  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const dot = document.querySelector(`.section-dot[data-target="${e.target.id}"]`);
      if (dot) dot.classList.toggle('active', e.isIntersecting);
    });
  }, { threshold: 0.4 });
  dots.forEach(dot => {
    const target = document.getElementById(dot.dataset.target);
    if (target) obs.observe(target);
    dot.addEventListener('click', () => {
      if (target) target.scrollIntoView({ behavior: noMotion ? 'instant' : 'smooth' });
    });
  });
})();

/* ════════════════════════════════════════════
   FULL CARD CLICKABILITY
════════════════════════════════════════════ */
(function initCardClickability() {
  document.querySelectorAll('.proj-card').forEach(card => {
    const link = card.querySelector('.proj-link');
    if (!link) return;
    card.setAttribute('data-clickable', '');
    card.addEventListener('click', e => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      link.click();
    });
  });
})();

/* ════════════════════════════════════════════
   CONTACT FORM (Formspree)
════════════════════════════════════════════ */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  if (!form) return;
  const status  = form.querySelector('.cf-status');
  const submit  = form.querySelector('.cf-submit');
  const msgArea = document.getElementById('cf-msg');
  const counter = form.querySelector('.cf-count');

  if (msgArea && counter) {
    msgArea.addEventListener('input', () => {
      counter.textContent = msgArea.value.length + ' / ' + msgArea.maxLength;
    });
  }

  function validate() {
    let ok = true;
    form.querySelectorAll('[required]').forEach(el => {
      const err = el.closest('.cf-field').querySelector('.cf-err');
      const empty = !el.value.trim();
      const badEmail = el.type === 'email' && !empty && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);
      el.classList.toggle('invalid', empty || badEmail);
      if (err) err.textContent = empty ? 'Required' : badEmail ? 'Enter a valid email' : '';
      if (empty || badEmail) ok = false;
    });
    return ok;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) return;
    submit.disabled = true;
    submit.textContent = 'Sending…';
    status.className = 'cf-status';
    status.textContent = '';
    try {
      const payload = {
        name:     (form.querySelector('#cf-name')    || {}).value || '',
        email:    (form.querySelector('#cf-email')   || {}).value || '',
        subject:  (form.querySelector('#cf-subject') || {}).value || '',
        message:  (form.querySelector('#cf-msg')     || {}).value || '',
        _gotcha:  (form.querySelector('[name="_gotcha"]') || {}).value || '',
      };
      const res = await fetch(form.action, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      });
      if (res.ok) {
        const container = document.getElementById('cf-container') || form.parentNode;
        container.innerHTML = `
          <div class="cf-success-msg" role="status" aria-live="polite">
            <div class="cf-tick" aria-hidden="true">✓</div>
            <h3>Message sent!</h3>
            <p>I'll reply within 24 hours.<br>For urgent matters: <a href="https://wa.me/26879657744">WhatsApp →</a></p>
          </div>`;
      } else {
        let msg = 'Send failed — email charleskris9@gmail.com directly.';
        try { const d = await res.json(); if (d.error) msg = d.error; } catch {}
        throw new Error(msg);
      }
    } catch (err) {
      status.className = 'cf-status error';
      status.textContent = err.message || 'Send failed — email charleskris9@gmail.com directly.';
      submit.textContent = 'Send enquiry →';
    } finally {
      submit.disabled = false;
    }
  });

  form.querySelectorAll('[required]').forEach(el => {
    el.addEventListener('blur', () => {
      const err = el.closest('.cf-field').querySelector('.cf-err');
      const empty = !el.value.trim();
      const badEmail = el.type === 'email' && !empty && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);
      el.classList.toggle('invalid', empty || badEmail);
      if (err) err.textContent = empty ? 'Required' : badEmail ? 'Enter a valid email' : '';
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('invalid') && el.value.trim()) {
        el.classList.remove('invalid');
        const err = el.closest('.cf-field').querySelector('.cf-err');
        if (err) err.textContent = '';
      }
    });
  });
})();

/* ─── PULL-TO-REFRESH (Möbius strip) ─── */
(function initPullRefresh() {
  const el    = document.getElementById('pull-refresh');
  const fill  = el?.querySelector('.mobius-fill');
  const label = el?.querySelector('.pr-label');
  if (!el || !fill) return;

  const THRESHOLD = 90;
  let totalLength = 0;
  let pullDelta   = 0;
  let decayTimer  = null;
  let done        = false;

  // Measure path length after fonts/layout settle
  window.addEventListener('load', () => {
    totalLength = fill.getTotalLength?.() || 180;
    fill.style.strokeDasharray  = totalLength;
    fill.style.strokeDashoffset = totalLength;
  });

  function setProgress(p) {
    p = Math.max(0, Math.min(1, p));
    el.style.opacity   = Math.min(1, p * 1.6);
    // slide down proportionally: at p=0 fully hidden, at p=1 fully shown
    el.style.transform = `translateX(-50%) translateY(${(p - 1) * 100}%)`;
    if (totalLength) fill.style.strokeDashoffset = totalLength * (1 - p);
    if (label) label.textContent = p >= 1 ? 'Release to refresh' : 'Pull to refresh';
  }

  function trigger() {
    if (done) return;
    done = true;
    el.classList.add('pr-complete');
    if (label) label.textContent = 'Refreshing…';
    setTimeout(() => location.reload(), 420);
  }

  function reset() {
    pullDelta = 0;
    setProgress(0);
  }

  /* ── Touch (mobile) ── */
  let touchStartY = 0;
  document.addEventListener('touchstart', e => {
    if (window.scrollY === 0) touchStartY = e.touches[0].clientY;
    else touchStartY = 0;
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!touchStartY || done) return;
    const dy = e.touches[0].clientY - touchStartY;
    if (dy > 0 && window.scrollY === 0) {
      pullDelta = dy;
      setProgress(pullDelta / THRESHOLD);
    }
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (done) return;
    if (pullDelta >= THRESHOLD) trigger();
    else reset();
    touchStartY = 0;
  });

  /* ── Wheel (desktop) ── */
  document.addEventListener('wheel', e => {
    if (done || window.scrollY > 0 || e.deltaY >= 0) return;
    pullDelta = Math.min(pullDelta + Math.abs(e.deltaY) * 0.6, THRESHOLD * 1.4);
    setProgress(pullDelta / THRESHOLD);
    clearTimeout(decayTimer);
    if (pullDelta >= THRESHOLD) { trigger(); return; }
    decayTimer = setTimeout(reset, 180);
  }, { passive: true });
})();

/* ─── CUSTOM CURSOR ─── */
(function initCursor() {
  if (noMotion || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  let mx = -200, my = -200, rx = -200, ry = -200;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
  const interactives = 'a,button,[role=button],input,select,textarea,.testi-card,.proj-card,.intent-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactives)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactives)) document.body.classList.remove('cursor-hover');
  });
  let raf;
  function loop() {
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);
  document.addEventListener('mouseleave', () => { dot.style.opacity='0'; ring.style.opacity='0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity=''; ring.style.opacity=''; });
})();

/* ─── MAGNETIC BUTTONS ─── */
(function initMagnetic() {
  if (noMotion || !window.matchMedia('(hover:hover)').matches) return;
  const STRENGTH = 0.35;
  document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r   = btn.getBoundingClientRect();
      const cx  = r.left + r.width  / 2;
      const cy  = r.top  + r.height / 2;
      const dx  = (e.clientX - cx) * STRENGTH;
      const dy  = (e.clientY - cy) * STRENGTH;
      btn.style.transform = `translate(${dx}px,${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform .4s var(--ease-spring)';
      btn.style.transform  = '';
      setTimeout(() => btn.style.transition = '', 400);
    });
    btn.addEventListener('mouseenter', () => { btn.style.transition = 'transform .1s ease'; });
  });
})();

/* ─── 3D CARD TILT ─── */
(function initTilt() {
  if (noMotion || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const MAX_TILT = 10;
  document.querySelectorAll('.proj-card, .testi-card, .intent-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = (e.clientX - r.left)  / r.width  - 0.5;
      const y  = (e.clientY - r.top)   / r.height - 0.5;
      const rx =  y * MAX_TILT * -1;
      const ry =  x * MAX_TILT;
      card.style.transition = 'transform .08s ease';
      card.style.transform  = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .5s var(--ease-spring)';
      card.style.transform  = '';
    });
  });
})();

/* ─── TEXT SCRAMBLE ─── */
(function initScramble() {
  if (noMotion) return;
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  function scramble(el, finalText, duration) {
    const len = finalText.length;
    let frame = 0;
    const totalFrames = Math.ceil(duration / 16);
    function tick() {
      const progress = frame / totalFrames;
      const revealed = Math.floor(progress * len);
      let out = '';
      for (let i = 0; i < len; i++) {
        if (finalText[i] === ' ') { out += ' '; continue; }
        if (i < revealed) { out += finalText[i]; continue; }
        out += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      el.textContent = out;
      if (frame++ < totalFrames) requestAnimationFrame(tick);
      else el.textContent = finalText;
    }
    requestAnimationFrame(tick);
  }
  // Scramble the hero gradient text 800ms after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const gradEl = document.querySelector('h1 .grad');
      if (gradEl) {
        const original = gradEl.textContent.trim();
        scramble(gradEl, original, 900);
      }
    }, 800);
  });
  // Re-scramble section labels on scroll entry
  const labelObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const orig = e.target.dataset.scramble;
        if (orig) scramble(e.target, orig, 600);
        labelObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.section-label').forEach(el => {
    el.dataset.scramble = el.textContent.trim();
    labelObs.observe(el);
  });
})();
