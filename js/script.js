// --- CONFIGURATION GROQ ---
const GROQ_API_KEY = "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"; 

function toggleChat() {
    const win = document.getElementById('ai-window');
    if (win.style.display === 'none' || win.style.display === '') {
        win.style.display = 'flex';
    } else {
        win.style.display = 'none';
    }
}

function handleKey(event) {
    if (event.key === 'Enter') askAI();
}

async function askAI() {
    const input = document.getElementById('ai-input');
    const history = document.getElementById('ai-history');
    const userText = input.value.trim();

    if (!userText) return;

    history.innerHTML += `<div class="ai-msg user-msg"><b>></b> ${userText}</div>`;
    input.value = '';
    
    const loadingId = "loading-" + Date.now();
    history.innerHTML += `<div class="ai-msg bot-msg" id="${loadingId}"><i>Connexion au serveur Groq...</i></div>`;
    history.scrollTop = history.scrollHeight;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-70b-versatile",
                messages: [
                    { role: "system", content: "Tu es l'assistant virtuel d'Alexis, étudiant en SDR. Réponds de manière concise." },
                    { role: "user", content: userText }
                ]
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            let aiReply = data.choices[0].message.content;
            document.getElementById(loadingId).innerHTML = `<b>AI:</b> ${aiReply}`;
        } else {
            document.getElementById(loadingId).innerHTML = `Erreur: ${data.error.message || "Quota atteint"}`;
        }
    } catch (error) {
        document.getElementById(loadingId).innerHTML = "Impossible de joindre Groq.";
    }
    history.scrollTop = history.scrollHeight;
}
