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

    history.innerHTML += `<div class="ai-msg user-msg"><b>></b> ${userText}</div>`;
    input.value = '';
    
    const loadingId = "loading-" + Date.now();
    history.innerHTML += `<div class="ai-msg bot-msg" id="${loadingId}"><i>Recherche dans la base de données...</i></div>`;
    history.scrollTop = history.scrollHeight;

    try {
        // NOUVELLE URL TESTÉE ET VALIDÉE
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Tu es l'assistant d'Alexis Veloso (étudiant L3 SDR). Réponds très brièvement. Question: ${userText}`
                    }]
                }]
            })
        });

        const data = await response.json();

        // Si Google renvoie une erreur (comme sur tes captures)
        if (data.error) {
            document.getElementById(loadingId).innerHTML = `<span style="color:orange">Détail technique : ${data.error.message}</span>`;
            return;
        }

        if (data.candidates && data.candidates[0].content) {
            const aiReply = data.candidates[0].content.parts[0].text;
            document.getElementById(loadingId).innerHTML = `<b>AI:</b> ${aiReply}`;
        }

    } catch (error) {
        document.getElementById(loadingId).innerHTML = `<span style="color:red">ERREUR RÉSEAU : Vérifiez votre connexion.</span>`;
    }
    history.scrollTop = history.scrollHeight;
}
