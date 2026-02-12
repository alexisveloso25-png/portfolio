// --- CONFIGURATION DE L'IA ALEXIS ---
const API_KEY = "AIzaSyB-tp5BP5s27cv_OosJPnl7kwrR_6pXm78"; // Assure-toi de mettre ta clé ici

// 1. Fonction pour ouvrir/fermer le chat
function toggleChat() {
    const win = document.getElementById('ai-window');
    win.style.display = (win.style.display === 'none' || win.style.display === '') ? 'flex' : 'none';
}

// 2. Envoi avec la touche Entrée
function handleKey(e) {
    if (e.key === 'Enter') askAI();
}

// 3. Logique de l'IA
async function askAI() {
    const input = document.getElementById('ai-input');
    const history = document.getElementById('ai-history');
    const userText = input.value.trim();

    if (!userText) return;

    // Affichage message utilisateur
    history.innerHTML += `<div class="ai-msg user-msg"><b>></b> ${userText}</div>`;
    input.value = '';
    
    // Animation de chargement
    const loadingId = "loading-" + Date.now();
    history.innerHTML += `<div class="ai-msg bot-msg" id="${loadingId}"><i>Traitement des paquets...</i></div>`;
    history.scrollTop = history.scrollHeight;

    try {
        // URL MISE À JOUR : gemini-1.5-flash-latest
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Tu es l'assistant IA d'Alexis Veloso. 
                        PROFIL : Alexis est en L3 SDR. Expert : Windows Server (AD, GPO), Linux (Debian), Cisco (VLAN, Routage), Virtualisation (VMware, Proxmox).
                        CONTACT : alexis.veloso25@gmail.com / 07 71 82 48 09.
                        CONSIGNE : Réponds brièvement (2 phrases max) avec un ton technique.
                        
                        QUESTION : ${userText}`
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            const aiReply = data.candidates[0].content.parts[0].text;
            document.getElementById(loadingId).innerHTML = `<b>AI:</b> ${aiReply}`;
        } else {
            // Affiche l'erreur précise de Google si ça échoue encore
            document.getElementById(loadingId).innerHTML = `<span style="color:orange">Détail erreur: ${data.error ? data.error.message : 'Erreur de modèle'}</span>`;
        }

    } catch (error) {
        document.getElementById(loadingId).innerHTML = `<span style="color:red">ERREUR : Rupture de la liaison satellite.</span>`;
    }

    history.scrollTop = history.scrollHeight;
}
