// --- CONFIGURATION ---
const API_KEY = "AIzaSyB-tp5BP5s27cv_OosJPnl7kwrR_6pXm78"; // <--- METS BIEN TA CLÉ ICI

// 1. Fonction pour ouvrir/fermer
function toggleChat() {
    const win = document.getElementById('ai-window');
    win.style.display = (win.style.display === 'none' || win.style.display === '') ? 'flex' : 'none';
}

// 2. Touche Entrée
function handleKey(e) {
    if (e.key === 'Enter') askAI();
}

// 3. Logique IA
async function askAI() {
    const input = document.getElementById('ai-input');
    const history = document.getElementById('ai-history');
    const userText = input.value.trim();

    if (!userText) return;

    // Affichage utilisateur
    history.innerHTML += `<div class="ai-msg user-msg"><b>></b> ${userText}</div>`;
    input.value = '';
    
    const loadingId = "loading-" + Date.now();
    history.innerHTML += `<div class="ai-msg bot-msg" id="${loadingId}"><i>Transmission des paquets...</i></div>`;
    history.scrollTop = history.scrollHeight;

    try {
        // --- CETTE URL EST LA SEULE VALIDE POUR GEMINI 1.5 FLASH ---
     const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Tu es l'assistant d'Alexis Veloso. Réponds en 2 phrases max. Question : ${userText}`
                    }]
                }]
            })
        });

        const data = await response.json();

        // Si l'API renvoie quand même une erreur
        if (data.error) {
            document.getElementById(loadingId).innerHTML = `<span style="color:orange">Erreur Google: ${data.error.message}</span>`;
            return;
        }

        if (data.candidates && data.candidates[0].content) {
            const aiReply = data.candidates[0].content.parts[0].text;
            document.getElementById(loadingId).innerHTML = `<b>AI:</b> ${aiReply}`;
        }

    } catch (error) {
        document.getElementById(loadingId).innerHTML = `<span style="color:red">ERREUR RÉSEAU : Impossible de joindre l'API.</span>`;
    }
    history.scrollTop = history.scrollHeight;
}
