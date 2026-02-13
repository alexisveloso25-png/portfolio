// --- CONFIGURATION ---
// 1. Remplace par ton token Hugging Face (hf_...)
const HF_TOKEN = "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"; 
// 2. Modèle Llama 3.1 (puissant et gratuit)
const MODEL_ID = "meta-llama/Llama-3.1-8B-Instruct"; 

/**
 * Gère l'ouverture et la fermeture de la fenêtre de chat
 */
function toggleChat() {
    const chatWindow = document.getElementById('ai-window');
    if (!chatWindow) {
        console.error("Erreur : L'élément 'ai-window' est introuvable dans le HTML.");
        return;
    }

    if (chatWindow.style.display === 'none' || chatWindow.style.display === '') {
        chatWindow.style.display = 'flex';
        console.log("Fenêtre de chat ouverte");
    } else {
        chatWindow.style.display = 'none';
        console.log("Fenêtre de chat fermée");
    }
}

/**
 * Envoie la question à l'IA et affiche la réponse
 */
async function askAI() {
    const input = document.getElementById('ai-input');
    const history = document.getElementById('ai-history');
    
    if (!input || !history) return;

    const userText = input.value.trim();
    if (!userText) return;

    // 1. Afficher le message de l'utilisateur
    history.innerHTML += `<div class="ai-msg user-msg"><b>></b> ${userText}</div>`;
    input.value = ''; // Vide le champ
    
    // 2. Créer un message d'attente
    const loadingId = "loading-" + Date.now();
    history.innerHTML += `<div class="ai-msg bot-msg" id="${loadingId}"><i>L'IA réfléchit...</i></div>`;
    history.scrollTop = history.scrollHeight;

    try {
        // 3. Appel à l'API Hugging Face
        const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${HF_TOKEN}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                inputs: `<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n\n${userText}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`,
                parameters: { 
                    max_new_tokens: 500,
                    return_full_text: false
                }
            })
        });

        const data = await response.json();

        // 4. Traitement de la réponse
        if (response.ok && data[0] && data[0].generated_text) {
            let aiReply = data[0].generated_text.trim();
            document.getElementById(loadingId).innerHTML = `<b>AI:</b> ${aiReply}`;
        } else {
            // Gestion des erreurs de quota ou d'API
            const errorMsg = data.error || "Erreur inconnue";
            document.getElementById(loadingId).innerHTML = `<span style="color:orange">Erreur : ${errorMsg}</span>`;
        }

    } catch (error) {
        console.error("Erreur réseau :", error);
        document.getElementById(loadingId).innerHTML = `<span style="color:red">Impossible de contacter l'IA.</span>`;
    }
    
    // Auto-scroll vers le bas
    history.scrollTop = history.scrollHeight;
}

// Permettre d'envoyer avec la touche "Entrée"
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('ai-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') askAI();
        });
    }
});
