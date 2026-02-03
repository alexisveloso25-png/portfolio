// TYPEWRITER EFFECT
const text = "ALEXIS VELOSO";
let i = 0;
function typeWriter() {
    if (i < text.length) {
        document.getElementById("typewriter").innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 150);
    }
}

// HUD CLOCK
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
}

// SPARKLINE PING
const canvas = document.getElementById('sparkline');
const ctx = canvas.getContext('2d');
let points = Array(10).fill(10);

function drawPing() {
    const ping = Math.floor(Math.random() * (40 - 20) + 20);
    document.getElementById('ping-val').textContent = ping + "MS";
    points.push(20 - (ping / 3));
    if (points.length > 10) points.shift();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, points[0]);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(i * (canvas.width / 9), points[i]);
    }
    ctx.stroke();
}

// INIT
window.onload = () => {
    typeWriter();
    setInterval(updateClock, 1000);
    setInterval(drawPing, 1000);
};
