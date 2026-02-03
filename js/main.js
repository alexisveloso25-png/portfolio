/**
 * main.js - Portfolio Alexis Veloso
 * Gestion du dynamisme et des animations de la Licence Générale
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialisation de l'animation au scroll
    const revealElements = () => {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        reveals.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    // Déclenchement au scroll et au chargement
    window.addEventListener('scroll', revealElements);
    revealElements();

    console.log("Portfolio d'Alexis Veloso chargé avec succès !");
});
