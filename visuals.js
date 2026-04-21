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

  // ---------- 6. Scramble text decode on [data-scramble] ----------
  const scrambleEls = document.querySelectorAll('[data-scramble]');
  if (scrambleEls.length) {
    const CHARS = '!<>-_\\/[]{}—=+*^?#01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)];

    const scramble = (el) => {
      const target = el.textContent.trim();
      const duration = parseInt(el.dataset.scramble) || 1200;
      if (prefersReduce) { el.textContent = target; return; }
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        let out = '';
        for (let i = 0; i < target.length; i++) {
          const reveal = i / target.length;
          if (t > reveal + 0.15) out += target[i];
          else if (target[i] === ' ') out += ' ';
          else out += rand();
        }
        el.textContent = out;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      const so = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { scramble(entry.target); so.unobserve(entry.target); }
        });
      }, { threshold: 0.4 });
      scrambleEls.forEach((el) => so.observe(el));
    } else {
      scrambleEls.forEach(scramble);
    }
  }

  // ---------- 7. Cursor-follow ambient glow orb ----------
  const glow = document.getElementById('cursor-glow');
  if (glow && !prefersReduce && !('ontouchstart' in window)) {
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let x = tx, y = ty;
    document.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      glow.classList.add('on');
    });
    document.addEventListener('mouseleave', () => glow.classList.remove('on'));
    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  // ---------- 8. Live clock + location for HUD ----------
  const clock = document.getElementById('hud-clock');
  if (clock) {
    const pad = (n) => String(n).padStart(2, '0');
    const update = () => {
      const d = new Date();
      clock.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} IST`;
    };
    update();
    setInterval(update, 1000);
  }

  // ---------- 9. Status ticker rotation ----------
  const ticker = document.getElementById('status-ticker-text');
  if (ticker) {
    const messages = [
      'LINK: stable',
      'UPLINK: github.com/runFast123',
      'LOC: 19.07°N, 72.87°E',
      'MODE: accepting interviews',
      'STACK: python / ml / data',
      'SYS: all subsystems nominal',
    ];
    let i = 0;
    const cycle = () => {
      ticker.style.opacity = '0';
      setTimeout(() => {
        i = (i + 1) % messages.length;
        ticker.textContent = messages[i];
        ticker.style.opacity = '1';
      }, 350);
    };
    ticker.textContent = messages[0];
    ticker.style.transition = 'opacity 350ms ease';
    setInterval(cycle, 3200);
  }
})();
