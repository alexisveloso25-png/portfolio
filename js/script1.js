// --- CONFIGURATION DU CHATBOT IA ALEXIS ---

// Ta clé API à récupérer sur https://aistudio.google.com/
const API_KEY = "AIzaSyCsaZCot2QqMahY1HlXcov61TOzZOzv7xo"; 

// 1. Fonction pour ouvrir/fermer la fenêtre de chat
function toggleChat() {
    const win = document.getElementById('ai-window');
    if (win.style.display === 'none' || win.style.display === '') {
        win.style.display = 'flex';
    } else {
        win.style.display = 'none';
    }
}

// 2. Permettre l'envoi avec la touche "Entrée"
function handleKey(e) {
    if (e.key === 'Enter') {
        askAI();
    }
}

// 3. Fonction principale d'appel à l'IA
async function askAI() {
    const input = document.getElementById('ai-input');
    const history = document.getElementById('ai-history');
    const userText = input.value.trim();

    // Si le champ est vide, on ne fait rien
    if (!userText) return;

    // Affiche le message de l'utilisateur dans l'historique
    history.innerHTML += `<div class="ai-msg user-msg"><b>></b> ${userText}</div>`;
    
    // Vide le champ de saisie et scroll vers le bas
    input.value = '';
    history.scrollTop = history.scrollHeight;

    // Création d'un ID unique pour l'animation de chargement
    const loadingId = "loading-" + Date.now();
    history.innerHTML += `<div class="ai-msg bot-msg" id="${loadingId}"><i>Analyse de la requête...</i></div>`;
    history.scrollTop = history.scrollHeight;

    try {
        // Appel à l'API Gemini 1.5 Flash
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Tu es l'assistant IA du portfolio d'Alexis Veloso. 
                        Alexis est en L3 SDR (Systèmes et Réseaux). 
                        Il est expert Windows Server, Linux, Cisco, Azure et Virtualisation.
                        Tes consignes :
                        - Réponds de façon courte (max 3 phrases).
                        - Utilise un ton pro, technique et futuriste.
                        - Si on te demande ses coordonnées : alexis.veloso25@gmail.com ou 07 71 82 48 09.
                        - Ne réponds qu'aux questions concernant Alexis ou l'informatique système/réseau.
                        
                        Question de l'utilisateur : ${userText}`
                    }]
                }]
            })
        });

        const data = await response.json();
        
        // Extraction de la réponse
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const aiReply = data.candidates[0].content.parts[0].text;
            // On remplace le texte "Analyse..." par la réponse de l'IA
            document.getElementById(loadingId).innerHTML = `<b>AI:</b> ${aiReply}`;
        } else {
            throw new Error("Réponse vide");
        }

    } catch (error) {
        // En cas d'erreur (mauvaise clé API, pas d'internet, etc.)
        document.getElementById(loadingId).innerHTML = `<span style="color:#ff4d4d">ERREUR: Connexion au Mainframe impossible. Vérifiez la clé API.</span>`;
        console.error("Détails de l'erreur:", error);
    }

    // Scroll final pour voir la réponse
    history.scrollTop = history.scrollHeight;
}
