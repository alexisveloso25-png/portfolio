// --- CONFIGURATION DU CHATBOT IA ALEXIS ---

// Ta clé API à récupérer sur https://aistudio.google.com/
const API_KEY = "AIzaSyB-tp5BP5s27cv_OosJPnl7kwrR_6pXm78"; 

// 1. Fonction pour ouvrir/fermer la fenêtre de chat
function toggleChat() {
    const win = document.getElementById('ai-window');
    if (win.style.display === 'none' || win.style.display === '') {
        win.style.display = 'flex';
    } else {
        win.style.display = 'none';
    }
}

// 2. Permettre l'envoi avec la touche "Entrée"
function handleKey(e) {
    if (e.key === 'Enter') {
        askAI();
    }
}

// 3. Fonction principale d'appel à l'IA
async function askAI() {
    const input = document.getElementById('ai-input');
    const history = document.getElementById('ai-history');
    const userText = input.value.trim();

    if (!userText) return;

    history.innerHTML += `<div class="ai-msg user-msg"><b>></b> ${userText}</div>`;
    input.value = '';
    
    const loadingId = "loading-" + Date.now();
    history.innerHTML += `<div class="ai-msg bot-msg" id="${loadingId}"><i>Analyse en cours...</i></div>`;
    history.scrollTop = history.scrollHeight;

    try {
        // L'URL DOIT ÊTRE EXACTEMENT CELLE-CI (v1beta)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userText }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            const aiReply = data.candidates[0].content.parts[0].text;
            document.getElementById(loadingId).innerHTML = `<b>AI:</b> ${aiReply}`;
        } else {
            // Affichage de l'erreur brute de Google pour débugger
            document.getElementById(loadingId).innerHTML = `<span style="color:orange">Erreur API: ${data.error ? data.error.message : 'Réponse invalide'}</span>`;
        }
    } catch (error) {
        document.getElementById(loadingId).innerHTML = `<span style="color:red">ERREUR RÉSEAU : Connexion au mainframe impossible.</span>`;
    }
    history.scrollTop = history.scrollHeight;
}
