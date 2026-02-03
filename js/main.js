document.addEventListener('DOMContentLoaded', () => {
    // 1. Animation au scroll (Reveal)
    const revealElements = () => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealElements);
    revealElements();

    // 2. Effet d'écriture sur les titres Highlight
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(h => {
        const originalText = h.innerText;
        h.innerText = '';
        let i = 0;
        const type = () => {
            if (i < originalText.length) {
                h.innerText += originalText.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        };
        // On lance l'effet au chargement
        type();
    });

    console.log("SEC-OPS Terminal: Access Granted for Alexis Veloso");
});
