document.addEventListener('DOMContentLoaded', () => {
    // Animation au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Effet de parallaxe léger sur le fond (Optionnel)
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        document.querySelector('.bg-gradient').style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    });
});
