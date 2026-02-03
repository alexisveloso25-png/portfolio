document.addEventListener('DOMContentLoaded', () => {
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

    // Horloge
    setInterval(() => {
        const now = new Date();
        document.getElementById('clock').innerText = now.toLocaleTimeString('fr-FR');
    }, 1000);
});
