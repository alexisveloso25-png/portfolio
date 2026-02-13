// --- CONFIGURATION ---
// Ta clé est protégée par la restriction de domaine (Referer HTTP) sur Google Cloud
const API_KEY = "X"; 

/**
 * 1. GESTION DE L'INTERFACE (Ouverture/Fermeture)
 */
function toggleChat() {
    const win = document.getElementById('ai-window');
    // Alterne l'affichage entre 'none' et 'flex'
    win.style.display = (win.style.display === 'none' || win.style.display === '') ? 'flex' : 'none';
}

/**
 * 2. GESTION DU CLAVIER
 */
function handleKey(e) {
    // Permet d'envoyer le message en appuyant sur la touche 'Entrée'
    if (e.key === 'Enter') askAI();
}

/**
 * 3. LOGIQUE D'APPEL À L'IA GEMINI 2.0 FLASH
 */
async function askAI() {
    const input = document.getElementById('ai-input');
    const history = document.getElementById('ai-history');
    const userText = input.value.trim();

    // Arrête la fonction si l'entrée est vide
    if (!userText) return;

    // Affiche le message de l'utilisateur
    history.innerHTML += `<div class="ai-msg user-msg"><b>></b> ${userText}</div>`;
    input.value = ''; // Vide le champ de saisie
    
    // Crée un élément de chargement avec un ID unique pour le remplacer plus tard
    const loadingId = "loading-" + Date.now();
    history.innerHTML += `<div class="ai-msg bot-msg" id="${loadingId}"><i>Liaison satellite Gemini 2.0...</i></div>`;
    history.scrollTop = history.scrollHeight;

    try {
        // URL configurée avec le modèle gemini-2.0-flash et la version v1beta
        // On passe sur le modèle "flash-live" qui est le seul en Illimité chez toi
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ 
                        // Tu peux ajouter une instruction ici pour personnaliser les réponses
                        text: userText 
                    }]
                }]
            })
        });

        const data = await response.json();

        // Gestion des erreurs spécifiques (Quota, Domaine bloqué, etc.)
        if (data.error) {
            console.error("Détails de l'erreur:", data.error);
            document.getElementById(loadingId).innerHTML = `<span style="color:orange">Erreur: ${data.error.message}</span>`;
            return;
        }

        // Extraction et affichage de la réponse texte
        if (data.candidates && data.candidates[0].content) {
            const aiReply = data.candidates[0].content.parts[0].text;
            document.getElementById(loadingId).innerHTML = `<b>AI:</b> ${aiReply}`;
        } else {
            document.getElementById(loadingId).innerHTML = `<b>AI:</b> (Pas de réponse générée)`;
        }

    } catch (error) {
        // En cas de problème de connexion ou d'erreur réseau majeure
        console.error("Erreur réseau:", error);
        document.getElementById(loadingId).innerHTML = `<span style="color:red">ERREUR RÉSEAU</span>`;
    }
    
    // Garde l'historique scrollé vers le bas
    history.scrollTop = history.scrollHeight;
}
