document.addEventListener('DOMContentLoaded', () => {
    // Clock
    setInterval(() => {
        document.getElementById('clock').innerText = new Date().toLocaleTimeString('fr-FR', { hour12: false });
    }, 1000);

    // Typewriter
    const text = "ALEXIS VELOSO";
    let i = 0;
    const speed = 150;
    function type() {
        if (i < text.length) {
            document.getElementById("typewriter").innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
});
