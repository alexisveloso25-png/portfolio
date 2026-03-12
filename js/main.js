/* ============================
   ALEXIS VELOSO — PORTFOLIO V5
   main.js
   ============================ */

/* --- BOOT SCREEN --- */
(function () {
    var boot = document.getElementById('boot');
    if (!boot) return;

    var killBoot = function () {
        boot.style.transition = 'opacity 0.6s ease';
        boot.style.opacity = '0';
        setTimeout(function () { if (boot && boot.parentNode) boot.parentNode.removeChild(boot); }, 650);
    };
    var safety = setTimeout(killBoot, 6000);

    var bootText = document.getElementById('boot-text');
    var bar      = document.querySelector('.boot-bar');
    if (!bootText) { clearTimeout(safety); killBoot(); return; }

    var lines = [
        '> Initializing SDR_OS v5.0...',
        '> Loading kernel modules............. [<span class="t-green">OK</span>]',
        '> Mounting encrypted volumes......... [<span class="t-green">OK</span>]',
        '> Starting firewall services......... [<span class="t-green">OK</span>]',
        '> Network interface eth0............. [<span class="t-green">SECURED</span>]',
        '> Authentication: <span class="t-purple">USER_ALEXIS_VELOSO</span>',
        '> <span class="t-green">Access granted. Welcome.</span>',
    ];

    var i = 0;
    var next = function () {
        if (i >= lines.length) {
            clearTimeout(safety);
            setTimeout(killBoot, 400);
            return;
        }
        var line = document.createElement('div');
        line.className = 'boot-line';
        line.innerHTML = lines[i];
        bootText.appendChild(line);
        // animate in
        requestAnimationFrame(function () {
            requestAnimationFrame(function () { line.style.opacity = '1'; line.style.transform = 'translateX(0)'; });
        });
        i++;
        setTimeout(next, i === lines.length ? 300 : 320);
    };
    setTimeout(next, 300);
}());

/* --- STICKY NAV + ACTIVE LINK --- */
(function () {
    const bar = document.querySelector('.top-bar');
    if (bar) {
        window.addEventListener('scroll', function () {
            bar.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
    }
    var path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
        if (a.getAttribute('href') === path) a.classList.add('active');
    });
}());

/* --- HERO CANVAS PARTICLES (index seulement) --- */
(function () {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, particles = [];

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function Particle() { this.reset(); }
    Particle.prototype.reset = function () {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r  = Math.random() * 1.4 + 0.3;
        this.a  = Math.random() * 0.5 + 0.15;
    };
    Particle.prototype.update = function () {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    };
    Particle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(163,102,255,' + this.a + ')';
        ctx.fill();
    };

    for (var k = 0; k < 55; k++) particles.push(new Particle());

    function loop() {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var d  = Math.sqrt(dx * dx + dy * dy);
                if (d < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(163,102,255,' + (0.1 * (1 - d / 100)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        particles.forEach(function (p) { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    }
    loop();
}());

/* --- SCROLL REVEAL + SKILL BARS + COUNTERS --- */
(function () {
    if (!window.IntersectionObserver) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            var el = e.target;

            el.style.opacity    = '1';
            el.style.transform  = 'translateY(0)';

            // Skill bars
            el.querySelectorAll('.s-fill, .skill-bar-fill').forEach(function (bar) {
                var target = bar.getAttribute('data-width') || bar.style.width || '0%';
                bar.setAttribute('data-width', target);
                bar.style.width = '0%';
                setTimeout(function () { bar.style.width = target; }, 120);
            });

            // Soft skills + cert stagger
            var sg = el.querySelector('.soft-skills-grid');
            if (sg) sg.classList.add('animated');
            var cl = el.querySelector('.cert-list');
            if (cl) cl.classList.add('animated');

            // Counters
            el.querySelectorAll('[data-count]').forEach(function (counter) {
                var target = parseInt(counter.dataset.count, 10);
                var suffix = counter.dataset.suffix || '';
                var cur = 0;
                var step = Math.max(1, Math.ceil(target / 50));
                var t = setInterval(function () {
                    cur = Math.min(cur + step, target);
                    counter.textContent = cur + suffix;
                    if (cur >= target) clearInterval(t);
                }, 28);
            });

            observer.unobserve(el);
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .formation-card, .profile-academic-group > *, .grid-layout > *').forEach(function (el, i) {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(22px)';
        el.style.transition = 'opacity 0.6s ease ' + ((i % 4) * 0.09) + 's, transform 0.6s ease ' + ((i % 4) * 0.09) + 's';
        observer.observe(el);
    });
}());

/* --- LIVE CLOCK --- */
(function () {
    var el = document.getElementById('live-time');
    if (!el) return;
    function update() { el.textContent = new Date().toLocaleTimeString('fr-FR', { hour12: false }); }
    update();
    setInterval(update, 1000);
}());

/* --- AI CHATBOT --- */
(function () {
    var win   = document.getElementById('ai-window');
    var input = document.getElementById('ai-input');
    var hist  = document.getElementById('ai-history');
    if (!win) return;

    window.toggleChat = function () {
        var isOpen = win.style.display === 'flex';
        win.style.display = isOpen ? 'none' : 'flex';
        if (!isOpen && input) setTimeout(function () { input.focus(); }, 50);
    };
    window.handleKey = function (e) { if (e.key === 'Enter') window.askAI(); };

    var context = [
        "Tu es l'assistant virtuel du portfolio d'Alexis Veloso.",
        "Alexis est etudiant en Licence Informatique (SDR) au CNAM Paris.",
        "Specialite : systemes, reseaux, cybersecurite.",
        "Formation : BTS SIO SISR (Campus Montsouris 2023-2025), Bac Pro SN (Lycee Louis Armand 2020-2023).",
        "Alternance chez THENEAS (GEIE) : admin reseau, GLPI, Office 365, Proxmox.",
        "Competences : Windows Server 90%, Linux 85%, Reseaux 80%, Virtualisation 85%, Azure AD 80%, Programmation 55%.",
        "Certifications : PIX, RGPD, CISCO Netacad IT, CCNA en cours.",
        "Contact : alexis.veloso25@gmail.com | 07 71 82 48 09 | Paris.",
        "Reponds de facon concise, professionnelle, en francais. Style terminal/cyber."
    ].join('\n');

    var history = [
        { role: 'user',      content: context + '\n\n[SYSTEM INIT]' },
        { role: 'assistant', content: "Systeme initialise. Je suis l'assistant virtuel d'Alexis. Que souhaitez-vous savoir ?" }
    ];

    function addMsg(text, cls) {
        var div = document.createElement('div');
        div.className = 'ai-msg ' + cls;
        div.innerHTML = text.replace(/\n/g, '<br>');
        hist.appendChild(div);
        hist.scrollTop = hist.scrollHeight;
    }

    function showTyping() {
        var d = document.createElement('div');
        d.className = 'ai-msg bot-msg typing-dots';
        d.id = 'typing-ind';
        d.innerHTML = '<span></span><span></span><span></span>';
        hist.appendChild(d);
        hist.scrollTop = hist.scrollHeight;
    }

    function hideTyping() {
        var t = document.getElementById('typing-ind');
        if (t) t.parentNode.removeChild(t);
    }

    window.askAI = async function () {
        var q = (input ? input.value : '').trim();
        if (!q) return;
        addMsg(q, 'user-msg');
        input.value = '';
        history.push({ role: 'user', content: q });
        showTyping();
        try {
            var res = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 350, messages: history })
            });
            var data = await res.json();
            hideTyping();
            var reply = (data && data.content && data.content[0] && data.content[0].text)
                ? data.content[0].text : '> ERREUR: Reponse invalide.';
            history.push({ role: 'assistant', content: reply });
            addMsg(reply, 'bot-msg');
        } catch (err) {
            hideTyping();
            addMsg('> NETWORK_ERROR: Impossible de joindre le serveur AI.', 'bot-msg');
        }
    };
}());

/* --- THEME TOGGLE (soleil / lune) --- */
function toggleTheme() {
    var body = document.body;
    var btn  = document.getElementById('theme-btn');
    body.classList.toggle('light-mode');
    var isLight = body.classList.contains('light-mode');
    if (btn) btn.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch(e){}
}

(function () {
    try {
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-mode');
            var btn = document.getElementById('theme-btn');
            if (btn) btn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    } catch(e){}
}());
