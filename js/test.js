// --- CONFIGURATION HUGGING FACE ---
const HF_TOKEN = "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"; 
const MODEL_ID = "meta-llama/Llama-3.1-8B-Instruct"; // Modèle très puissant et gratuit

async function askAI() {
    const input = document.getElementById('ai-input');
    const history = document.getElementById('ai-history');
    const userText = input.value.trim();

    if (!userText) return;

    // Affichage utilisateur
    history.innerHTML += `<div class="ai-msg user-msg"><b>></b> ${userText}</div>`;
    input.value = '';
    
    const loadingId = "loading-" + Date.now();
    history.innerHTML += `<div class="ai-msg bot-msg" id="${loadingId}"><i>Connexion au cluster Llama...</i></div>`;
    history.scrollTop = history.scrollHeight;

    try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${HF_TOKEN}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                inputs: userText,
                parameters: { max_new_tokens: 250 }
            })
        });

        const data = await response.json();

        // Sur Hugging Face, la réponse arrive souvent dans un tableau
        if (data[0] && data[0].generated_text) {
            // On nettoie la réponse pour ne garder que le texte de l'IA
            let aiReply = data[0].generated_text.replace(userText, "").trim();
            document.getElementById(loadingId).innerHTML = `<b>AI:</b> ${aiReply}`;
        } else if (data.error) {
            document.getElementById(loadingId).innerHTML = `<span style="color:orange">HF Error: ${data.error}</span>`;
        }

    } catch (error) {
        console.error("Erreur HF:", error);
        document.getElementById(loadingId).innerHTML = `<span style="color:red">ERREUR RÉSEAU</span>`;
    }
    
    history.scrollTop = history.scrollHeight;
}
