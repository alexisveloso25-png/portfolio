// --- CONFIGURATION ---
const API_KEY = "AIzaSyAUCOxB5LDJUreE1KYn00wmHHN0LHCgQtg"; 

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

    // 1. Affichage utilisateur
    history.innerHTML += `<div class="ai-msg user-msg"><b>></b> ${userText}</div>`;
    input.value = '';
    
    const loadingId = "loading-" + Date.now();
    history.innerHTML += `<div class="ai-msg bot-msg" id="${loadingId}"><i>Liaison satellite Gemini 2.0...</i></div>`;
    history.scrollTop = history.scrollHeight;

    try {
        // --- URL MISE À JOUR AVEC GEMINI 2.0 FLASH ---
        // On utilise v1beta et gemini-2.0-flash avec le séparateur ":"
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: userText }]
                }]
            })
        });

        const data = await response.json();

        // 2. Gestion des erreurs
        if (data.error) {
            document.getElementById(loadingId).innerHTML = `<span style="color:orange">Erreur: ${data.error.message}</span>`;
            return;
        }

        // 3. Affichage de la réponse
        if (data.candidates && data.candidates[0].content) {
            const aiReply = data.candidates[0].content.parts[0].text;
            document.getElementById(loadingId).innerHTML = `<b>AI:</b> ${aiReply}`;
        }

    } catch (error) {
        document.getElementById(loadingId).innerHTML = `<span style="color:red">ERREUR RÉSEAU</span>`;
    }
    history.scrollTop = history.scrollHeight;
}
