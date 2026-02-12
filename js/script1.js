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

    history.innerHTML += `<div class="ai-msg user-msg"><b>></b> ${userText}</div>`;
    input.value = '';
    
    const loadingId = "loading-" + Date.now();
    history.innerHTML += `<div class="ai-msg bot-msg" id="${loadingId}"><i>Connexion au serveur...</i></div>`;
    history.scrollTop = history.scrollHeight;

    try {
        // CHANGEMENT : Utilisation de la version v1 stable et vérification de la structure
        const baseUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
        
        const response = await fetch(`${baseUrl}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Tu es l'assistant d'Alexis Veloso. Sois bref. Question : ${userText}`
                    }]
                }]
            })
        });

        // Diagnostic si la réponse n'est pas OK (pour voir la 404 en direct)
        if (!response.ok) {
            const errorDetail = await response.json();
            document.getElementById(loadingId).innerHTML = 
                `<span style="color:red">Erreur HTTP ${response.status}: ${errorDetail.error.message}</span>`;
            return;
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content) {
            const aiReply = data.candidates[0].content.parts[0].text;
            document.getElementById(loadingId).innerHTML = `<b>AI:</b> ${aiReply}`;
        }

    } catch (error) {
        document.getElementById(loadingId).innerHTML = `<span style="color:red">ERREUR DE CONNEXION</span>`;
        console.error("Détails :", error);
    }
    history.scrollTop = history.scrollHeight;
}
