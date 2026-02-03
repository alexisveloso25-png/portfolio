// TYPEWRITER
const nameElement = document.getElementById('typewriter');
const nameText = "ALEXIS VELOSO";
let idx = 0;

function type() {
    if (idx < nameText.length) {
        nameElement.textContent += nameText.charAt(idx);
        idx++;
        setTimeout(type, 120);
    }
}

// HORLOGE
function clock() {
    const el = document.getElementById('clock');
    setInterval(() => {
        const d = new Date();
        el.textContent = d.getHours().toString().padStart(2, '0') + ":" + 
                         d.getMinutes().toString().padStart(2, '0') + ":" + 
                         d.getSeconds().toString().padStart(2, '0');
    }, 1000);
}

// ANIMATION DES BARRES AU SCROLL
function animateSkills() {
    const bars = document.querySelectorAll('.progress-fill');
    bars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        if(rect.top < window.innerHeight) {
            bar.style.width = bar.getAttribute('data-width');
        }
    });
}

window.addEventListener('scroll', animateSkills);
window.onload = () => {
    type();
    clock();
    setTimeout(animateSkills, 500); // Lance l'anim des barres au début
};
