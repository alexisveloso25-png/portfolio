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
    history.innerHTML += `<div class="ai-msg bot-msg" id="${loadingId}"><i>Analyse des paquets...</i></div>`;
    history.scrollTop = history.scrollHeight;

    try {
        // --- URL CORRIGÉE POUR GEMINI 1.5 FLASH ---
        
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Tu es l'assistant d'Alexis Veloso. Réponds brièvement. Question: ${userText}` }]
                }]
            })
        });

        const data = await response.json();

        // 2. Debug en cas d'erreur de clé ou de domaine
        if (data.error) {
            console.error("Erreur Google détaillée:", data.error);
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
