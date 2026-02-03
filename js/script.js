// 1. Horloge Système
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
    // Mise à jour de la date dans les logs
    document.getElementById('current-date').textContent = now.toLocaleDateString('fr-FR');
}
setInterval(updateClock, 1000);
updateClock();

// 2. Monitoring Ping & Sparkline
const canvas = document.getElementById('sparkline');
const ctx = canvas.getContext('2d');
let points = Array(10).fill(10);

function drawSparkline() {
    // Simuler un ping variable
    const newPing = Math.floor(Math.random() * (40 - 15) + 15);
    document.getElementById('ping-val').textContent = `PING: ${newPing}ms`;
    
    points.push(20 - (newPing / 2)); // Ajuster à la hauteur du canvas
    if (points.length > 15) points.shift();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#00f2ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, points[0]);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(i * (canvas.width / 14), points[i]);
    }
    ctx.stroke();
}
setInterval(drawSparkline, 800);
