// --- CONFIGURATION ---
// Ta clé est protégée par restriction de domaine sur Google Cloud
const API_KEY = "AIzaSyAUCOxB5LDJUreE1KYn00wmHHN0LHCgQtg"; 

// 1. Fonction pour ouvrir/fermer la fenêtre de chat
function toggleChat() {
    const win = document.getElementById('ai-window');
    win.style.display = (win.style.display === 'none' || win.style.display === '') ? 'flex' : 'none';
}

// 2. Gestion de la touche Entrée pour envoyer le message
function handleKey(e) {
    if (e.key === 'Enter') askAI();
}

// 3. Logique principale de l'IA
async function askAI() {
    const input = document.getElementById('ai-input');
    const history = document.getElementById('ai-history');
    const userText = input.value.trim();

    // Empêche l'envoi de messages vides
    if (!userText) return;

    // Affichage du message de l'utilisateur dans l'historique
    history.innerHTML += `<div class="ai-msg user-msg"><b>></b> ${userText}</div>`;
    input.value = '';
    
    // Création d'un indicateur de chargement avec un ID unique
    const loadingId = "loading-" + Date.now();
    history.innerHTML += `<div class="ai-msg bot-msg" id="${loadingId}"><i>Liaison satellite Gemini 2.0...</i></div>`;
    history.scrollTop = history.scrollHeight;

    try {
        // URL utilisant la version v1beta et le modèle gemini-2.0-flash
        // Cette syntaxe corrige l'erreur "Model not found" des versions précédentes
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

        // Gestion des erreurs renvoyées par l'API Google
        if (data.error) {
            document.getElementById(loadingId).innerHTML = `<span style="color:orange">Erreur: ${data.error.message}</span>`;
            return;
        }

        // Affichage de la réponse de l'IA si elle existe
        if (data.candidates && data.candidates[0].content) {
            const aiReply = data.candidates[0].content.parts[0].text;
            document.getElementById(loadingId).innerHTML = `<b>AI:</b> ${aiReply}`;
        }

    } catch (error) {
        // Gestion des erreurs réseau (coupure de connexion, etc.)
        document.getElementById(loadingId).innerHTML = `<span style="color:red">ERREUR RÉSEAU</span>`;
    }
    
    // Scroll automatique vers le bas pour voir la réponse
    history.scrollTop = history.scrollHeight;
}
