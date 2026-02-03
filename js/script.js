// TYPEWRITER EFFECT
const nameElement = document.getElementById('typewriter');
const fullName = "ALEXIS VELOSO";
let i = 0;

function typeWriter() {
    if (i < fullName.length) {
        nameElement.innerHTML += fullName.charAt(i);
        i++;
        setTimeout(typeWriter, 120);
    }
}

// REAL TIME CLOCK
function startClock() {
    const clockElement = document.getElementById('clock');
    setInterval(() => {
        const now = new Date();
        clockElement.innerText = now.toLocaleTimeString('fr-FR', { hour12: false });
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    typeWriter();
    startClock();
});
