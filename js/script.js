// TYPEWRITER EFFECT
const nameElement = document.getElementById('typewriter');
const fullName = "ALEXIS VELOSO";
let i = 0;

function typeWriter() {
    if (i < fullName.length) {
        nameElement.innerHTML += fullName.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
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

// SIMULATED PING
function simulatePing() {
    const pingElement = document.getElementById('ping-val');
    setInterval(() => {
        const ping = Math.floor(Math.random() * 15) + 15;
        pingElement.innerText = `LATENCY: ${ping}MS`;
    }, 3000);
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    typeWriter();
    startClock();
    simulatePing();
});
