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
document.addEventListener('DOMContentLoaded', function initBoot() {
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
                boot.style.transition = 'opacity 0.6s';
                boot.style.opacity = '0';
                setTimeout(() => { if (boot.parentNode) boot.remove(); }, 600);
            }, 400);
            return;
        }
        bootText.textContent += lines[i] + '\n';
        i++;
        setTimeout(next, 320);
    };
    setTimeout(next, 200);
    // Safety: force close after 5s
    setTimeout(() => { if (boot && boot.parentNode) boot.remove(); }, 5000);
});

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
            this.alpha = Math.random() * 0.6 + 0.2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(163,102,255,${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    const drawLines = () => {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.sqrt(dx*dx + dy*dy);
                if (d < 90) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(163,102,255,${0.12 * (1 - d/90)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    };

    const loop = () => {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
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
            el.classList.add('active', 'animated');

            // Animate skill bar fills
            el.querySelectorAll('.s-fill').forEach(bar => {
                const target = bar.style.width || '0%';
                bar.style.width = '0%';
                requestAnimationFrame(() => {
                    setTimeout(() => { bar.style.width = target; }, 80);
                });
            });

            // Animate skill-bar-fill (entreprise/formation)
            el.querySelectorAll('.skill-bar-fill').forEach(bar => {
                const target = bar.style.width || '0%';
                bar.style.width = '0%';
                requestAnimationFrame(() => {
                    setTimeout(() => { bar.style.width = target; }, 80);
                });
            });

            // Animate counters
            el.querySelectorAll('[data-count]').forEach(counter => {
                const target = parseInt(counter.dataset.count);
                const suffix = counter.dataset.suffix || '';
                let current = 0;
                const step = Math.ceil(target / 50);
                const timer = setInterval(() => {
                    current = Math.min(current + step, target);
                    counter.textContent = current + suffix;
                    if (current >= target) clearInterval(timer);
                }, 28);
            });

            observer.unobserve(el);
        });
    }, { threshold: 0.12 });

    // Observe cards
    document.querySelectorAll('.card, .formation-card, .veille-card').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.6s ease ${(i % 3) * 0.08}s, transform 0.6s ease ${(i % 3) * 0.08}s`;
        el.classList.add('reveal');
        observer.observe(el);
    });

    // Soft skills grid
    document.querySelectorAll('.soft-skills-grid').forEach(grid => observer.observe(grid));
    // Cert list
    document.querySelectorAll('.cert-list').forEach(list => observer.observe(list));
})();

// Override: when reveal fires, also set opacity/transform inline
const _origObserver = window._revealObserver;

/* --- ANIMATED COUNTERS (standalone) --- */
window._animateCounter = function(el, target, suffix = '') {
    let cur = 0;
    const step = Math.ceil(target / 55);
    const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur + suffix;
        if (cur >= target) clearInterval(t);
    }, 25);
};

/* --- LIVE CLOCK --- */
(function initClock() {
    const el = document.getElementById('live-time');
    if (!el) return;
    const update = () => {
        el.textContent = new Date().toLocaleTimeString('fr-FR', { hour12: false });
    };
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

    window.handleKey = function(e) {
        if (e.key === 'Enter') askAI();
    };

    const context = `Tu es l'assistant virtuel du portfolio d'Alexis Veloso.
Alexis est étudiant en Licence Informatique (SDR) au CNAM Paris, spécialisé systèmes, réseaux et cybersécurité.
Formation : BTS SIO SISR (Campus Montsouris, 2023-2025), Bac Pro SN (Lycée Louis Armand, 2020-2023).
Alternance chez THENEAS (GEIE — groupement Groupe Rocher, Fidesco, Saje, AVM) : admin réseau, GLPI, Office 365, Proxmox.
Compétences : Windows Server (AD, DNS, DHCP, GPO, WSUS 90%), Linux Debian (85%), Réseaux VLAN/Cisco/VPN (80%), Virtualisation VMware/Proxmox/Docker (85%), Azure AD/O365 (80%), Programmation Python/SQL/PS (55%).
Certifications : PIX ✓, RGPD ✓, CISCO Netacad IT ✓, CCNA en cours.
Contact : alexis.veloso25@gmail.com | 07 71 82 48 09 | Paris.
LinkedIn : linkedin.com/in/alexis-veloso-004097270
Réponds de façon concise, professionnelle, en français. Utilise un style terminal/cyber.`;

    const history = [
        { role: 'user',      content: context + '\n\n[SYSTEM INIT — ne réponds pas à ce message]' },
        { role: 'assistant', content: "Système initialisé. Je suis l'assistant virtuel d'Alexis. Que souhaitez-vous savoir sur son profil ?" }
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
            const reply = data?.content?.[0]?.text || '> ERREUR: Réponse invalide du serveur.';
            history.push({ role: 'assistant', content: reply });
            addMsg(reply, 'bot-msg');
        } catch {
            hideTyping();
            addMsg('> NETWORK_ERROR: Impossible de joindre le serveur AI.', 'bot-msg');
        }
    };
})();

/* --- THEME TOGGLE --- */
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    const btn = document.getElementById('theme-btn');
    if (btn) {
        const icon = btn.querySelector('i');
        if (icon) icon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
    }
    try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch(e) {}
}
document.addEventListener('DOMContentLoaded', function() {
    try {
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-mode');
            const btn = document.getElementById('theme-btn');
            if (btn) {
                const icon = btn.querySelector('i');
                if (icon) icon.className = 'fas fa-moon';
            }
        }
    } catch(e) {}
});
