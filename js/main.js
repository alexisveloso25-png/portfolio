document.addEventListener('DOMContentLoaded', () => {
    // Animation au scroll
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

    // Effet Typing pour les titres "highlight"
    const typingEffect = () => {
        const texts = document.querySelectorAll('.highlight');
        texts.forEach(text => {
            const content = text.innerHTML;
            if(!text.classList.contains('typed')) {
                text.innerHTML = '';
                let i = 0;
                const speed = 50;
                const type = () => {
                    if (i < content.length) {
                        text.innerHTML += content.charAt(i);
                        i++;
                        setTimeout(type, speed);
                    }
                };
                type();
                text.classList.add('typed');
            }
        });
    };

    window.addEventListener('scroll', revealElements);
    revealElements();
    typingEffect();

    console.log("LOG: Portfolio Alexis Veloso - SYSTEM_READY");
});
