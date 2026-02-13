// --- CONFIGURATION GROQ ---
// Ta clé API actuelle (valide d'après tes logs)
const GROQ_API_KEY = "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"; 

/**
 * Gère l'ouverture et la fermeture de la fenêtre de chat
 */
function toggleChat() {
    const win = document.getElementById('ai-window');
    if (!win) return;
    
    // Alterne entre 'none' et 'flex'
    if (win.style.display === 'none' || win.style.display === '') {
        win.style.display = 'flex';
    } else {
        win.style.display = 'none';
    }
}

/**
 * Gère la touche Entrée pour envoyer le message
 */
function handleKey(event) {
    if (event.key === 'Enter') {
        askAI();
    }
}

/**
 * Fonction principale d'appel à l'IA
 */
async function askAI() {
    const input = document.getElementById('ai-input');
    const history = document.getElementById('ai-history');
    
    if (!input || !history) return;
    
    const userText = input.value.trim();
    if (!userText) return;

    // 1. Afficher le message de l'utilisateur dans l'historique
    history.innerHTML += `<div class="ai-msg user-msg"><b>></b> ${userText}</div>`;
    input.value = ''; // Vide le champ de saisie
    
    // 2. Créer un message de chargement temporaire
    const loadingId = "loading-" + Date.now();
    history.innerHTML += `<div class="ai-msg bot-msg" id="${loadingId}"><i>Connexion au serveur...</i></div>`;
    history.scrollTop = history.scrollHeight;

    try {
        // 3. Appel à l'API Groq
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // Modèle à jour pour éviter l'erreur 400 (Bad Request)
                model: "llama-3.3-70b-versatile", 
                messages: [
                    { 
                        role: "system", 
                        content: "Tu es l'assistant virtuel d'Alexis, étudiant en SDR (Systèmes et Réseaux). Réponds de manière concise et professionnelle." 
                    },
                    { role: "user", content: userText }
                ]
            })
        });

        const data = await response.json();

        // 4. Traitement de la réponse
        if (data.choices && data.choices[0]) {
            let aiReply = data.choices[0].message.content;
            document.getElementById(loadingId).innerHTML = `<b>AI:</b> ${aiReply}`;
        } else {
            // Affiche l'erreur renvoyée par Groq (ex: Quota ou Modèle)
            const errorMsg = data.error ? data.error.message : "Erreur de réponse";
            document.getElementById(loadingId).innerHTML = `<span style="color:orange">Erreur: ${errorMsg}</span>`;
        }
    } catch (error) {
        console.error("Erreur réseau:", error);
        document.getElementById(loadingId).innerHTML = `<span style="color:red">Impossible de joindre l'IA.</span>`;
    }
    
    // Auto-scroll vers le bas
    history.scrollTop = history.scrollHeight;
}
