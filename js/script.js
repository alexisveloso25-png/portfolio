document.addEventListener('DOMContentLoaded', () => {
    // EFFET TYPEWRITER POUR LE TITRE
    const nameElement = document.getElementById('typewriter');
    const fullName = "ALEXIS VELOSO";
    let i = 0;
    function typeWriter() {
        if (i < fullName.length) {
            nameElement.innerHTML += fullName.charAt(i);
            i++;
            setTimeout(typeWriter, 150);
        }
    }
    typeWriter();

    // MISE À JOUR DU PING ALÉATOIRE (Pour le style)
    setInterval(() => {
        const ping = Math.floor(Math.random() * (28 - 18) + 18);
        document.getElementById('ping-val').innerText = `${ping}MS`;
    }, 3000);

    // HORLOGE TEMPS RÉEL
    setInterval(() => {
        const now = new Date();
        document.getElementById('clock').innerText = now.toLocaleTimeString('fr-FR');
    }, 1000);
});
