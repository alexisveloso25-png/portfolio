/* CURSOR */
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

/* BOOT */
const bootText = document.getElementById('boot-text');
const lines = [
    'Initializing SDR_OS...',
    'Loading security modules...',
    'Network secured',
    'User authenticated',
    'Access granted'
];

let i = 0;
const bootInterval = setInterval(() => {
    bootText.textContent += lines[i] + '\n';
    i++;
    if (i === lines.length) {
        clearInterval(bootInterval);
        setTimeout(() => document.getElementById('boot').style.display = 'none', 800);
    }
}, 500);

/* REVEAL + SKILLS */
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('active');
            e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.level + '%';
            });
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
