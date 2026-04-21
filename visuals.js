(() => {
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- 1. Boot sequence loader ----------
  const bootLoader = document.getElementById('boot-loader');
  if (bootLoader) {
    const lines = [
      { text: '[ BOOT ] initializing neural core…', cls: 'grey',  delay: 0   },
      { text: '[  OK  ] loading /kernel/skills.so', cls: 'ok',    delay: 140 },
      { text: '[  OK  ] mounting /projects',        cls: 'ok',    delay: 260 },
      { text: '[ WARN ] caffeine levels low',       cls: 'warn',  delay: 380 },
      { text: '[  OK  ] establishing link to github.com',       cls: 'ok', delay: 520 },
      { text: '[  OK  ] decrypting portfolio payload',          cls: 'ok', delay: 660 },
      { text: '[ DONE ] welcome, visitor.',         cls: 'grey',  delay: 820 },
    ];

    lines.forEach(({ text, cls, delay }) => {
      const el = document.createElement('div');
      el.className = `boot-line ${cls}`;
      el.style.animationDelay = `${delay}ms`;
      el.textContent = text;
      bootLoader.appendChild(el);
    });

    const bar = document.createElement('div');
    bar.className = 'boot-bar';
    bootLoader.appendChild(bar);

    const hide = () => {
      bootLoader.classList.add('hidden');
      setTimeout(() => bootLoader.remove(), 900);
    };
    const dismissDelay = prefersReduce ? 400 : 2200;
    setTimeout(hide, dismissDelay);
    bootLoader.addEventListener('click', hide);
  }

  // ---------- 2. Scroll reveals ----------
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => io.observe(el));
  }

  // ---------- 3. Parallax on [data-parallax] ----------
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !prefersReduce) {
    let ticking = false;
    const update = () => {
      const scrollY = window.scrollY;
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }

  // ---------- 4. Magnetic hover on [data-magnetic] ----------
  const magEls = document.querySelectorAll('[data-magnetic]');
  if (magEls.length && !prefersReduce && !('ontouchstart' in window)) {
    magEls.forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic) || 0.25;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top  - r.height / 2;
        el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ---------- 5. Glitch trigger on section titles ----------
  const glitchEls = document.querySelectorAll('.glitch');
  if (glitchEls.length && !prefersReduce && 'IntersectionObserver' in window) {
    const go = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          setTimeout(() => entry.target.classList.remove('active'), 900);
          go.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    glitchEls.forEach((el) => go.observe(el));
  }
})();
