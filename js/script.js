document.addEventListener('DOMContentLoaded', () => {
    // Typewriter
    const nameText = "ALEXIS VELOSO";
    let idx = 0;
    function type() {
        if (idx < nameText.length) {
            document.getElementById('typewriter').innerHTML += nameText.charAt(idx);
            idx++;
            setTimeout(type, 150);
        }
    }
    type();

    // Simulation Ping Réel
    setInterval(() => {
        const ping = Math.floor(Math.random() * (32 - 14) + 14);
        document.getElementById('ping-val').innerText = `${ping}MS`;
    }, 2000);

    // Horloge
    setInterval(() => {
        const now = new Date();
        document.getElementById('clock').innerText = now.toLocaleTimeString('fr-FR');
    }, 1000);
});
