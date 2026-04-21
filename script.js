document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scroll for Anchor Links (Optional enhancement if native scroll-behavior isn't enough)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const pill = document.querySelector('#anime-navbar');
                const headerOffset = pill ? Math.min(100, pill.getBoundingClientRect().height + 20) : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -50% 0px',
        threshold: 0
    };

    sections.forEach(() => {});

    const animeContainer = document.querySelector('#anime-navbar .anime-navbar');
    const animeItems = document.querySelectorAll('#anime-navbar .anime-nav-item');
    const animeIndicator = document.querySelector('#anime-navbar .anime-indicator');
    const mobileItems = document.querySelectorAll('.mobile-nav-item');

    function moveAnimeIndicator(el) {
        if (!animeContainer || !animeIndicator || !el) return;
        const left = el.offsetLeft;
        const width = el.offsetWidth;
        animeIndicator.style.width = `${width - 12}px`;
        animeIndicator.style.transform = `translateX(${left + 6}px)`;
    }

    function setAnimeActive(el) {
        animeItems.forEach(a => a.classList.remove('is-active'));
        el.classList.add('is-active');
        moveAnimeIndicator(el);
    }

    function setMobileActive(el) {
        mobileItems.forEach(a => {
            a.classList.remove('text-primary');
            a.classList.add('text-muted');
        });
        el.classList.remove('text-muted');
        el.classList.add('text-primary');
    }

    if (animeItems.length > 0) {
        setAnimeActive(animeItems[0]);
        animeItems.forEach(a => {
            a.addEventListener('mouseenter', () => setAnimeActive(a));
            a.addEventListener('focus', () => setAnimeActive(a));
        });
        
        // Initialize mobile active state
        if (mobileItems.length > 0) {
            setMobileActive(mobileItems[0]);
        }

        const animeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const link = document.querySelector(`#anime-navbar .anime-nav-item[href="#${entry.target.id}"]`);
                    if (link) setAnimeActive(link);
                    
                    const mobileLink = document.querySelector(`#anime-navbar-mobile .mobile-nav-item[href="#${entry.target.id}"]`);
                    if (mobileLink) setMobileActive(mobileLink);
                }
            });
        }, observerOptions);
        sections.forEach(section => animeObserver.observe(section));
    }

    const cards = document.querySelectorAll('.effect-card');
    cards.forEach(card => {
        let rect = null;
        function onEnter() {
            rect = card.getBoundingClientRect();
            card.classList.add('hovering');
        }
        function onMove(e) {
            if (!rect) rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const midX = rect.width / 2;
            const midY = rect.height / 2;
            const rotateY = ((x - midX) / midX) * 6;
            const rotateX = -((y - midY) / midY) * 6;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
        }
        function onLeave() {
            card.classList.remove('hovering');
            card.style.transform = '';
            rect = null;
        }
        card.addEventListener('mouseenter', onEnter);
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
        card.addEventListener('touchstart', onEnter, { passive: true });
        card.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            if (!touch) return;
            const fake = { clientX: touch.clientX, clientY: touch.clientY };
            onMove(fake);
        }, { passive: true });
        card.addEventListener('touchend', onLeave);
    });

    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
    document.querySelectorAll('.scramble').forEach(el => {
        const original = (el.getAttribute('data-text') || el.textContent || '').trim();
        let interval = null;
        let frame = 0;
        let isScrambling = false;
        el.innerHTML = '';
        for (let i = 0; i < original.length; i++) {
            const span = document.createElement('span');
            span.textContent = original[i];
            span.className = 'inline-block transition-all duration-150 text-white';
            span.style.transitionDelay = `${i * 10}ms`;
            el.appendChild(span);
        }
        el.addEventListener('mouseenter', () => {
            if (isScrambling) return;
            isScrambling = true;
            frame = 0;
            const duration = original.length * 3;
            if (interval) clearInterval(interval);
            interval = setInterval(() => {
                frame++;
                const progress = frame / duration;
                const revealedLength = Math.floor(progress * original.length);
                const current = original.split('').map((char, i) => {
                    if (char === ' ') return ' ';
                    if (i < revealedLength) return original[i];
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                });
                for (let i = 0; i < current.length; i++) {
                    const node = el.childNodes[i];
                    if (!node) continue;
                    node.textContent = current[i];
                    const isRandom = current[i] !== original[i];
                    node.className = 'inline-block transition-all duration-150 ' + (isRandom ? 'text-primary scale-110' : 'text-white');
                    node.style.transitionDelay = `${i * 10}ms`;
                }
                if (frame >= duration) {
                    clearInterval(interval);
                    for (let i = 0; i < original.length; i++) {
                        const node = el.childNodes[i];
                        if (!node) continue;
                        node.textContent = original[i];
                        node.className = 'inline-block transition-all duration-150 text-white';
                        node.style.transitionDelay = `${i * 10}ms`;
                    }
                    isScrambling = false;
                }
            }, 30);
        });
        el.addEventListener('mouseleave', () => {});
    });

    const heroBg = document.getElementById('hero-bg');
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-desc');
    const heroCtas = document.getElementById('hero-ctas');
    if (heroBg && heroTitle && heroDesc && heroCtas) {
        requestAnimationFrame(() => {
            heroBg.classList.add('active');
            setTimeout(() => heroTitle.classList.add('in'), 300);
            setTimeout(() => heroDesc.classList.add('in'), 600);
            const children = Array.from(heroCtas.children);
            children.forEach((child, i) => {
                child.classList.add('cta-child');
                setTimeout(() => child.classList.add('in'), 800 + i * 120);
            });
        });
    }

    const trailContainer = document.getElementById('pixel-trail');
    if (trailContainer && !('ontouchstart' in window)) {
        const COLORS = ["#ffffff", "#FFD600", "#F7931A", "#94A3B8"];
        const PIXEL_SIZE = 12;
        const TRAIL_LENGTH = 40;
        const FADE_SPEED = 0.04;
        const pool = [];
        let poolIndex = 0;
        let lastX = 0, lastY = 0;
        for (let i = 0; i < TRAIL_LENGTH; i++) {
            const node = document.createElement('div');
            node.className = 'pixel-node';
            node.style.opacity = '0';
            trailContainer.appendChild(node);
            pool.push({ node, x: 0, y: 0, opacity: 0, age: 0 });
        }
        function placePixel(x, y) {
            const p = pool[poolIndex];
            poolIndex = (poolIndex + 1) % TRAIL_LENGTH;
            p.x = x; p.y = y; p.opacity = 1; p.age = 0;
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            p.node.style.backgroundColor = color;
            p.node.style.opacity = '1';
            p.node.style.transform = `translate3d(${x - PIXEL_SIZE / 2}px, ${y - PIXEL_SIZE / 2}px, 0) scale(1)`;
        }
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            const dx = x - lastX;
            const dy = y - lastY;
            const distance = Math.sqrt(dx*dx + dy*dy);
            if (distance > PIXEL_SIZE) {
                placePixel(x, y);
                lastX = x; lastY = y;
            }
        });
        function animate() {
            for (let i = 0; i < pool.length; i++) {
                const p = pool[i];
                if (p.opacity <= 0) continue;
                p.age += 1;
                p.opacity -= FADE_SPEED;
                const sizeMultiplier = Math.max(0.3, 1 - p.age / 100);
                p.node.style.opacity = String(Math.max(0, p.opacity));
                p.node.style.transform = `translate3d(${p.x - (PIXEL_SIZE * sizeMultiplier) / 2}px, ${p.y - (PIXEL_SIZE * sizeMultiplier) / 2}px, 0) scale(${sizeMultiplier})`;
            }
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }

    // --- 5. Back to Top Button ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.remove('opacity-0', 'translate-y-10');
                backToTopBtn.classList.add('opacity-100', 'translate-y-0');
            } else {
                backToTopBtn.classList.add('opacity-0', 'translate-y-10');
                backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const orbitRoot = document.getElementById('orbit-container');
    if (orbitRoot) {
        const skillsConfig = [
            { id: 'html', radius: 100, size: 40, speed: 1, phase: 0, color: '#E34F26', label: 'HTML5', icon: 'html5' },
            { id: 'css', radius: 100, size: 45, speed: 1, phase: (2 * Math.PI) / 3, color: '#1572B6', label: 'CSS3', icon: 'css3' },
            { id: 'javascript', radius: 100, size: 40, speed: 1, phase: (4 * Math.PI) / 3, color: '#F7DF1E', label: 'JavaScript', icon: 'javascript' },
            { id: 'react', radius: 180, size: 50, speed: -0.6, phase: 0, color: '#61DAFB', label: 'React', icon: 'react' },
            { id: 'node', radius: 180, size: 45, speed: -0.6, phase: (2 * Math.PI) / 3, color: '#339933', label: 'Node.js', icon: 'nodedotjs' },
            { id: 'tailwind', radius: 180, size: 40, speed: -0.6, phase: (4 * Math.PI) / 3, color: '#06B6D4', label: 'Tailwind CSS', icon: 'tailwindcss' },
        ];
        const nodes = [];
        skillsConfig.forEach(cfg => {
            const el = document.createElement('div');
            el.className = 'orbit-icon';
            el.style.width = `${cfg.size}px`;
            el.style.height = `${cfg.size}px`;
            el.style.setProperty('--glow', `${cfg.color}55`);
            const img = document.createElement('img');
            img.src = `https://cdn.simpleicons.org/${cfg.icon}/${cfg.color.replace('#','')}`;
            img.alt = cfg.label;
            img.width = cfg.size;
            img.height = cfg.size;
            img.style.width = '70%';
            img.style.height = '70%';
            img.loading = 'lazy';
            img.addEventListener('error', () => {
                el.removeChild(img);
                if (cfg.icon === 'css3') {
                    const s = document.createElement('div');
                    s.style.width = '70%';
                    s.style.height = '70%';
                    s.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:100%;height:100%"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.751L12 19.351l5.379-1.443.744-8.157z" fill="${cfg.color}"/></svg>`;
                    el.appendChild(s);
                }
            });
            const label = document.createElement('span');
            label.className = 'orbit-label';
            label.textContent = cfg.label;
            el.appendChild(img);
            el.appendChild(label);
            orbitRoot.appendChild(el);
            nodes.push({ el, cfg });
            el.addEventListener('mouseenter', () => el.classList.add('hovering'));
            el.addEventListener('mouseleave', () => el.classList.remove('hovering'));
            el.addEventListener('touchstart', () => el.classList.add('hovering'), { passive: true });
            el.addEventListener('touchend', () => el.classList.remove('hovering'));
        });
        let isPaused = false;
        orbitRoot.addEventListener('mouseenter', () => { isPaused = true; });
        orbitRoot.addEventListener('mouseleave', () => { isPaused = false; });
        let last = performance.now();
        let t = 0;
        function step(now) {
            const dt = (now - last) / 1000;
            last = now;
            if (!isPaused) t += dt;
            nodes.forEach(n => {
                const angle = t * n.cfg.speed + n.cfg.phase;
                const x = Math.cos(angle) * n.cfg.radius;
                const y = Math.sin(angle) * n.cfg.radius;
                n.el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
            });
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    const btn = document.getElementById('magnet-btn');
    if (btn) {
        const particleCount = 14;
        const radius = 60;
        const particles = [];
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.className = 'magnet-particle';
            // Random polar position
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * radius;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            p.dataset.x = String(x);
            p.dataset.y = String(y);
            p.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
            p.style.left = '50%';
            p.style.top = '50%';
            btn.appendChild(p);
            particles.push(p);
        }
        const icon = btn.querySelector('svg, i[data-lucide="magnet"]');
        function attract() {
            btn.classList.add('attracting');
            particles.forEach(p => {
                p.style.transform = `translate(-50%, -50%)`;
                p.style.opacity = '1';
            });
            if (icon && icon.classList) {
                icon.classList.add('scale-110');
            }
        }
        function release() {
            btn.classList.remove('attracting');
            particles.forEach(p => {
                const x = Number(p.dataset.x || '0');
                const y = Number(p.dataset.y || '0');
                p.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
                p.style.opacity = '0.4';
            });
            if (icon && icon.classList) {
                icon.classList.remove('scale-110');
            }
        }
        btn.addEventListener('mouseenter', attract);
        btn.addEventListener('mouseleave', release);
        btn.addEventListener('touchstart', attract, { passive: true });
        btn.addEventListener('touchend', release);
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const ratingRoot = document.getElementById('emoji-rating');
    if (ratingRoot) {
        const buttons = Array.from(ratingRoot.querySelectorAll('button'));
        const defaultLabel = document.getElementById('emoji-rating-default');
        const labelWrap = document.getElementById('emoji-rating-label');
        const labelSpan = labelWrap ? labelWrap.querySelector('span') : null;
        const labels = ['Terrible', 'Poor', 'Okay', 'Good', 'Amazing'];
        let rating = 0;
        let hover = 0;
        function update() {
            const display = hover || rating;
            buttons.forEach((btn, i) => {
                const value = i + 1;
                const active = value <= display;
                const exact = value === display;
                const span = btn.querySelector('span');
                const container = btn.querySelector('div');
                if (!span || !container) return;
                container.className = 'relative flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 ease-out ' + (active ? 'scale-110' : 'scale-100');
                span.className = 'text-3xl transition-all duration-300 ease-out select-none ' + (active ? 'grayscale-0 drop-shadow-lg' : 'grayscale opacity-40');
            });
            if (labelWrap && labelSpan && defaultLabel) {
                if (display > 0) {
                    defaultLabel.className = 'absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out opacity-0 blur-md scale-95';
                    labelWrap.className = 'absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out opacity-100 blur-0 scale-100';
                    labelSpan.textContent = labels[display - 1];
                } else {
                    defaultLabel.className = 'absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out opacity-100 blur-0 scale-100';
                    labelWrap.className = 'absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out opacity-0 blur-md scale-105';
                    labelSpan.textContent = '';
                }
            }
        }
        buttons.forEach((btn, i) => {
            const value = i + 1;
            btn.addEventListener('mouseenter', () => { hover = value; update(); });
            btn.addEventListener('mouseleave', () => { hover = 0; update(); });
            btn.addEventListener('click', () => { rating = value; update(); });
        });
        update();
    }
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    // Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercent + "%";
        });
    }

    // Number Counter Animation
    const statsSection = document.getElementById('stats-section');
    const counters = document.querySelectorAll('.counter');
    let started = false;

    if (statsSection && counters.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !started) {
                started = true;
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const suffix = counter.getAttribute('data-suffix');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60 FPS
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.ceil(current) + suffix;
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target + suffix;
                        }
                    };
                    updateCounter();
                });
            }
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (cursorDot && cursorOutline && !('ontouchstart' in window)) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            // Outline follows with delay
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover effects
        document.querySelectorAll('a, button, .hover-trigger').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(247, 147, 26, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }

    // --- 2. Workflow Animation ---
    const workflowSteps = document.querySelectorAll('.workflow-step');
    const circuitNodes = document.querySelectorAll('.circuit-node');
    
    if (workflowSteps.length > 0) {
        const workflowObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('active');
                        // Activate corresponding node
                        const node = circuitNodes[Array.from(workflowSteps).indexOf(entry.target)];
                        if (node) node.classList.add('active');
                    }, index * 200);
                }
            });
        }, { threshold: 0.2 });

        workflowSteps.forEach(step => workflowObserver.observe(step));
    }

    // --- 3. GitHub Intelligence (Terminal) ---
    const terminalContent = document.getElementById('terminal-content');
    if (terminalContent) {
        const GH_USER = 'runFast123';
        const CACHE_KEY = `gh_data_${GH_USER}`;
        const CACHE_TTL = 60 * 60 * 1000; // 1 hour

        const mockData = [
            { cmd: "git status", output: "On branch master\nYour branch is up to date with 'origin/master'." },
            { cmd: "cat recent_activity.log", output: "2024-12-19: Pushed 3 commits to 'portfolio-v2'\n2024-12-18: Merged PR #42 'Feature: AI Chatbot'\n2024-12-15: Created repository 'neural-network-from-scratch'" },
            { cmd: "whoami", output: "aman_dubey\nRole: Full Stack Python Developer\nLocation: Mumbai, IN" }
        ];

        const fetchGitHub = async () => {
            try {
                const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
                if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

                const [userRes, eventsRes, reposRes] = await Promise.all([
                    fetch(`https://api.github.com/users/${GH_USER}`),
                    fetch(`https://api.github.com/users/${GH_USER}/events/public?per_page=10`),
                    fetch(`https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=5`)
                ]);
                if (!userRes.ok || !eventsRes.ok || !reposRes.ok) throw new Error('GitHub API error');

                const user = await userRes.json();
                const events = await eventsRes.json();
                const repos = await reposRes.json();

                const activityLines = events.slice(0, 3).map(e => {
                    const date = new Date(e.created_at).toISOString().slice(0, 10);
                    const type = e.type.replace('Event', '');
                    return `${date}: ${type} on ${e.repo.name}`;
                }).join('\n') || 'No recent public activity.';

                const recentRepos = repos.slice(0, 3).map(r => `${r.name} (${r.language || 'n/a'}) - ${r.stargazers_count}★`).join('\n');

                const data = [
                    { cmd: `git log --author=${GH_USER} --oneline -3`, output: activityLines },
                    { cmd: 'ls ~/repos --sort=updated', output: recentRepos || 'No public repositories.' },
                    { cmd: 'whoami', output: `${user.login}\nName: ${user.name || 'N/A'}\nBio: ${user.bio || 'N/A'}\nRepos: ${user.public_repos}  Followers: ${user.followers}` }
                ];

                localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
                return data;
            } catch (err) {
                console.warn('GitHub API fetch failed, using mock data:', err);
                return mockData;
            }
        };

        let step = 0;

        const typeWriter = (text, element, speed = 30) => {
            return new Promise(resolve => {
                let i = 0;
                element.classList.add('typing-cursor');
                const interval = setInterval(() => {
                    element.textContent += text.charAt(i);
                    i++;
                    if (i > text.length - 1) {
                        clearInterval(interval);
                        element.classList.remove('typing-cursor');
                        resolve();
                    }
                }, speed);
            });
        };

        const runTerminal = async () => {
            terminalContent.innerHTML = '';
            const ghData = await fetchGitHub();

            for (const data of ghData) {
                // Command line
                const cmdLine = document.createElement('div');
                cmdLine.className = 'cmd-line mb-2';
                terminalContent.appendChild(cmdLine);
                await typeWriter(data.cmd, cmdLine, 50);
                
                // Output
                await new Promise(r => setTimeout(r, 300)); // Process delay
                const outputLine = document.createElement('div');
                outputLine.className = 'text-green-400 whitespace-pre-wrap mb-4';
                outputLine.textContent = data.output;
                terminalContent.appendChild(outputLine);
                
                await new Promise(r => setTimeout(r, 800)); // Next command delay
            }
        };
        
        // Start when visible
        const termObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                runTerminal();
                termObserver.disconnect();
            }
        });
        termObserver.observe(terminalContent);
    }

    // --- 4. Skill Constellation Canvas ---
    const canvas = document.getElementById('skills-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouse = { x: null, y: null };
        
        // Resize
        const resize = () => {
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
            initParticles();
        };

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
        
        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse Interaction
                if (mouse.x != null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        const forceDirectionX = dx / dist;
                        const forceDirectionY = dy / dist;
                        const force = (100 - dist) / 100;
                        const directionX = forceDirectionX * force * 0.5;
                        const directionY = forceDirectionY * force * 0.5;
                        this.vx -= directionX;
                        this.vy -= directionY;
                    }
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = "#F7931A";
                ctx.fill();
            }
        }
        
        function initParticles() {
            particles = [];
            const count = Math.floor(width * height / 15000); 
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                // Draw connections
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(247, 147, 26, ${1 - dist/100})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        
        window.addEventListener('resize', resize);
        resize();
        animate();
    }
});
