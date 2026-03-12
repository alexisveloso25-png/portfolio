/* ============================
   ALEXIS VELOSO — PORTFOLIO V5
   main.js — Polish Edition
   ============================ */

/* --- CUSTOM CURSOR --- */
(function initCursor() {
    const cursor = document.querySelector('.cursor');
    const ring   = document.querySelector('.cursor-ring');
    if (!cursor) return;
    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    const tick = () => {
        cursor.style.left = mx + 'px';
        cursor.style.top  = my + 'px';
        rx += (mx - rx) * 0.14;
        ry += (my - ry) * 0.14;
        if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    document.querySelectorAll('a, button, .card, .soft-tag, .tab-btn, .veille-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '20px'; cursor.style.height = '20px'; cursor.style.opacity = '0.6';
            if (ring) { ring.style.width = '52px'; ring.style.height = '52px'; }
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '12px'; cursor.style.height = '12px'; cursor.style.opacity = '1';
            if (ring) { ring.style.width = '36px'; ring.style.height = '36px'; }
        });
    });
})();

/* --- BOOT SCREEN --- */
(function initBoot() {
    const boot     = document.getElementById('boot');
    const bootText = document.getElementById('boot-text');
    if (!boot || !bootText) return;
    const lines = [
        '> Initializing SDR_OS v5.0...',
        '> Loading security modules... [OK]',
        '> Mounting encrypted volumes... [OK]',
        '> Network interface: eth0 SECURED',
        '> Authentication: USER_ALEXIS_VELOSO',
        '> Access granted. Welcome.'
    ];
    let i = 0;
    const next = () => {
        if (i >= lines.length) {
            setTimeout(() => {
                boot.style.transition = 'opacity 0.5s';
                boot.style.opacity = '0';
                setTimeout(() => boot.remove(), 500);
            }, 300);
            return;
        }
        bootText.textContent += lines[i] + '\n';
        i++;
        setTimeout(next, 320);
    };
    setTimeout(next, 150);
})();

/* --- STICKY NAV + ACTIVE LINK --- */
(function initNav() {
    const bar = document.querySelector('.top-bar');
    if (bar) window.addEventListener('scroll', () => {
        bar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
        if (a.getAttribute('href') === path) a.classList.add('active');
    });
})();

/* --- HERO CANVAS PARTICLES --- */
(function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    const resize = () => {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x  = Math.random() * W;
            this.y  = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r  = Math.random() * 1.5 + 0.3;
            this.alpha = Math.random() * 0.5 + 0.15;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(163,102,255,${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 55; i++) particles.push(new Particle());

    const loop = () => {
        ctx.clearRect(0, 0, W, H);
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.sqrt(dx*dx + dy*dy);
                if (d < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(163,102,255,${0.1 * (1 - d/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    };
    loop();
})();

/* --- SCROLL REVEAL + SKILL BARS + STAGGER --- */
(function initReveal() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;

            // Fade in
            el.style.opacity = '1';
            el.style.transform = 'none';

            // Skill bars
            el.querySelectorAll('.s-fill, .skill-bar-fill').forEach(bar => {
                const target = bar.style.width || '0%';
                bar.style.width = '0%';
                setTimeout(() => { bar.style.width = target; }, 100);
            });

            // Soft skills stagger
            const softGrid = el.querySelector('.soft-skills-grid');
            if (softGrid) softGrid.classList.add('animated');

            // Cert list stagger
            const certList = el.querySelector('.cert-list');
            if (certList) certList.classList.add('animated');

            // Counters
            el.querySelectorAll('[data-count]').forEach(counter => {
                const target = parseInt(counter.dataset.count);
                const suffix = counter.dataset.suffix || '';
                let cur = 0;
                const step = Math.max(1, Math.ceil(target / 50));
                const t = setInterval(() => {
                    cur = Math.min(cur + step, target);
                    counter.textContent = cur + suffix;
                    if (cur >= target) clearInterval(t);
                }, 28);
            });

            observer.unobserve(el);
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .formation-card, .profile-academic-group > *, .grid-layout > *').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(22px)';
        el.style.transition = `opacity 0.6s ease ${(i % 4) * 0.09}s, transform 0.6s ease ${(i % 4) * 0.09}s`;
        observer.observe(el);
    });
})();

/* --- LIVE CLOCK --- */
(function initClock() {
    const el = document.getElementById('live-time');
    if (!el) return;
    const update = () => { el.textContent = new Date().toLocaleTimeString('fr-FR', { hour12: false }); };
    update();
    setInterval(update, 1000);
})();

/* --- AI CHATBOT --- */
(function initAI() {
    const win   = document.getElementById('ai-window');
    const input = document.getElementById('ai-input');
    const hist  = document.getElementById('ai-history');
    if (!win) return;

    window.toggleChat = function() {
        const isOpen = win.style.display === 'flex';
        win.style.display = isOpen ? 'none' : 'flex';
        if (!isOpen && input) setTimeout(() => input.focus(), 50);
    };
    window.handleKey = function(e) { if (e.key === 'Enter') askAI(); };

    const context = `Tu es l'assistant virtuel du portfolio d'Alexis Veloso.
Alexis est etudiant en Licence Informatique (SDR) au CNAM Paris, specialise systemes, reseaux et cybersecurite.
Formation : BTS SIO SISR (Campus Montsouris, 2023-2025), Bac Pro SN (Lycee Louis Armand, 2020-2023).
Alternance chez THENEAS (GEIE — groupement Groupe Rocher, Fidesco, Saje, AVM) : admin reseau, GLPI, Office 365, Proxmox.
Competences : Windows Server 90%, Linux Debian 85%, Reseaux VLAN/Cisco/VPN 80%, Virtualisation VMware/Proxmox/Docker 85%, Azure AD/O365 80%, Programmation Python/SQL/PS 55%.
Certifications : PIX, RGPD, CISCO Netacad IT, CCNA en cours.
Contact : alexis.veloso25@gmail.com | 07 71 82 48 09 | Paris.
Reponds de facon concise, professionnelle, en francais. Style terminal/cyber.`;

    const history = [
        { role: 'user',      content: context + '\n\n[SYSTEM INIT]' },
        { role: 'assistant', content: "Systeme initialise. Je suis l'assistant virtuel d'Alexis. Que souhaitez-vous savoir ?" }
    ];

    const addMsg = (text, cls) => {
        const div = document.createElement('div');
        div.className = 'ai-msg ' + cls;
        div.innerHTML = text.replace(/\n/g, '<br>');
        hist.appendChild(div);
        hist.scrollTop = hist.scrollHeight;
    };
    const showTyping = () => {
        const d = document.createElement('div');
        d.className = 'ai-msg bot-msg typing-dots'; d.id = 'typing-ind';
        d.innerHTML = '<span></span><span></span><span></span>';
        hist.appendChild(d); hist.scrollTop = hist.scrollHeight;
    };
    const hideTyping = () => { document.getElementById('typing-ind')?.remove(); };

    window.askAI = async function() {
        const q = (input?.value || '').trim();
        if (!q) return;
        addMsg(q, 'user-msg');
        input.value = '';
        history.push({ role: 'user', content: q });
        showTyping();
        try {
            const res = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 350, messages: history })
            });
            const data = await res.json();
            hideTyping();
            const reply = data?.content?.[0]?.text || '> ERREUR: Reponse invalide.';
            history.push({ role: 'assistant', content: reply });
            addMsg(reply, 'bot-msg');
        } catch {
            hideTyping();
            addMsg('> NETWORK_ERROR: Impossible de joindre le serveur AI.', 'bot-msg');
        }
    };
})();

/* --- ACCESSIBILITY --- */
function toggleZoom() {
    document.body.classList.toggle('is-zoomed');
    const txt = document.getElementById('zoom-text');
    if (txt) txt.innerText = document.body.classList.contains('is-zoomed') ? 'Normal' : 'Visibilite';
}
function toggleSimple() { document.body.classList.toggle('is-simple'); }
