// --- CONFIGURATION DU CHATBOT AI ---
const API_KEY = "TON_API_KEY_ICI"; // Remplace par ta vraie clé Google AI Studio

function toggleChat() {
    const win = document.getElementById('ai-window');
    if (win.style.display === 'none' || win.style.display === '') {
        win.style.display = 'flex';
    } else {
        win.style.display = 'none';
    }
}

function handleKey(e) {
    if (e.key === 'Enter') askAI();
}

async function askAI() {
    const input = document.getElementById('ai-input');
    const history = document.getElementById('ai-history');
    const userText = input.value.trim();

    if (!userText) return;

    // Affichage message utilisateur
    history.innerHTML += `<div class="ai-msg user-msg"><b>></b> ${userText}</div>`;
    input.value = '';
    history.scrollTop = history.scrollHeight;

    // Animation de chargement
    const loadingId = "loading-" + Date.now();
    history.innerHTML += `<div class="ai-msg bot-msg" id="${loadingId}"><i>Analyse en cours...</i></div>`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `Tu es l'assistant virtuel d'Alexis Veloso. 
                        Alexis est un expert en Systèmes et Réseaux (L3 SDR). 
                        Il maîtrise Windows Server, Linux, Cisco et Azure.
                        Réponds de manière concise, technique et futuriste. 
                        Si on te demande ses contacts : alexis.veloso25@gmail.com.
                        Question de l'utilisateur : ${userText}` 
                    }] 
                }]
            })
        });

        const data = await response.json();
        const aiReply = data.candidates[0].content.parts[0].text;

        // On remplace le chargement par la vraie réponse
        document.getElementById(loadingId).innerHTML = `<b>AI:</b> ${aiReply}`;
        
    } catch (error) {
        document.getElementById(loadingId).innerHTML = `<span style="color:red">ERREUR: Connexion au mainframe interrompue.</span>`;
        console.error("Erreur API:", error);
    }
    history.scrollTop = history.scrollHeight;
}
