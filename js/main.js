// Initialisation du Log de Debug
function logMessage(message, type = 'info') {
    const logOutput = document.getElementById('log-output');
    const p = document.createElement('p');
    const timestamp = new Date().toLocaleTimeString();
    p.innerHTML = `<span style="color: grey;">[${timestamp}]</span> <span class="log-${type}">${message}</span>`;
    logOutput.appendChild(p);
    logOutput.scrollTop = logOutput.scrollHeight; // Scroll automatique
}

// Toggle de la console de Debug
function toggleDebugLog() {
    const console = document.getElementById('debug-log-console');
    console.classList.toggle('log-active');
    logMessage(`Console de debug ${console.classList.contains('log-active') ? 'ouverte' : 'fermée'}.`);
}

// Initialisation de Chart.js pour le graphique de compétences
document.addEventListener('DOMContentLoaded', () => {
    logMessage("Chargement du document terminé.");

    // Curseur Custom
    const customCursor = document.getElementById('custom-cursor');
    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    });
    logMessage("Curseur personnalisé initialisé.");

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.1 // L'élément est considéré "visible" dès que 10% de sa hauteur est à l'écran
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                logMessage(`Élément '${entry.target.tagName}' révélé.`);
                // observer.unobserve(entry.target); // Optionnel: pour ne l'animer qu'une seule fois
            }
        });
    }, observerOptions);
