// Gestion du Curseur Custom
document.addEventListener('mousemove', (e) => {
    const cursor = document.getElementById('custom-cursor');
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Gestion du Terminal
const terminal = document.getElementById('terminal-window');
const input = document.getElementById('cli-input');
const body = document.getElementById('terminal-body');

function toggleTerminal() {
    terminal.classList.toggle('hidden');
    if(!terminal.classList.contains('hidden')) input.focus();
}

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = input.value.toLowerCase();
        const line = document.createElement('div');
        line.innerHTML = `<span>> ${cmd}</span>`;
        body.insertBefore(line, body.querySelector('.input-line'));
        
        const response = document.createElement('div');
        if (cmd === 'help') response.innerText = "Commandes: clear, bio, contact, skills";
        else if (cmd === 'bio') response.innerText = "Alexis Veloso, Etudiant Licence SDR.";
        else if (cmd === 'contact') response.innerText = "Email: alexis.veloso25@gmail.com";
        else if (cmd === 'skills') response.innerText = "Win/Linux, AD, Cisco, O365, Arduino";
        else if (cmd === 'clear') { 
            body.querySelectorAll('div:not(.input-line)').forEach(el => el.remove());
        } else { response.innerText = "Commande inconnue."; }
        
        body.insertBefore(response, body.querySelector('.input-line'));
        input.value = "";
        body.scrollTop = body.scrollHeight;
    }
});

// Scroll Reveal Original
const revealElements = document.querySelectorAll('.reveal');
const scrollReveal = () => {
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < window.innerHeight - 100) el.classList.add('active');
    });
};
window.addEventListener('scroll', scrollReveal);
scrollReveal();
