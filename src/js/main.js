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

/* ─── THEME TOGGLE ─── */
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) themeBtn.addEventListener('click', () => window.__brtCycleTheme());

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
