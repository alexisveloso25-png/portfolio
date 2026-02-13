// --- CONFIGURATION GROQ ---
const GROQ_API_KEY = "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"; 

function toggleChat() {
    const win = document.getElementById('ai-window');
    if (!win) return;
    win.style.display = (win.style.display === 'none' || win.style.display === '') ? 'flex' : 'none';
}

function handleKey(event) {
    if (event.key === 'Enter') askAI();
}

async function askAI() {
    const input = document.getElementById('ai-input');
    const history = document.getElementById('ai-history');
    if (!input || !history) return;

    const userText = input.value.trim();
    if (!userText) return;

    history.innerHTML += `<div class="ai-msg user-msg"><b>></b> ${userText}</div>`;
    input.value = '';
    
    const loadingId = "loading-" + Date.now();
    history.innerHTML += `<div class="ai-msg bot-msg" id="${loadingId}"><i>Connexion...</i></div>`;
    history.scrollTop = history.scrollHeight;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // UTILISATION DU MODÈLE LE PLUS STABLE POUR ÉVITER LES DEPRECATIONS
                model: "llama3-8b-8192", 
                messages: [
                    { role: "system", content: "Tu es l'assistant d'Alexis. Réponds brièvement." },
                    { role: "user", content: userText }
                ]
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            document.getElementById(loadingId).innerHTML = `<b>AI:</b> ${data.choices[0].message.content}`;
        } else {
            // Si Groq renvoie encore une erreur, on l'affiche ici
            document.getElementById(loadingId).innerHTML = `Erreur: ${data.error.message}`;
        }
    } catch (error) {
        document.getElementById(loadingId).innerHTML = "Serveur injoignable.";
    }
    history.scrollTop = history.scrollHeight;
}
