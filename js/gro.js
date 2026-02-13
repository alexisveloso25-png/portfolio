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
                        content: "Tu es l'assistant virtuel expert de Veloso Alexis. Ton rôle est de convaincre les recruteurs qu'il est le candidat idéal pour une alternance ou un poste en Systèmes et Réseaux.

                        PROFIL DÉTAILLÉ :
                        - État civil : Alexis Veloso, né le 25 mai 2005, résidant au Perreux-sur-Marne[cite: 3, 5, 7].
                        - Formation actuelle : Licence 3 Informatique SRD (Système, Réseau, Développement) en apprentissage au CFA Cerfal Campus Montsouris[cite: 11, 44].
                        - Diplômes : BTS SIO option SISR (2025) et Bac Pro SN option RISC (2023) au Lycée Louis Armand[cite: 45, 46].

                        EXPÉRIENCES PROFESSIONNELLES :
                        - Apprenti chez THENEAS (2023-2026) : Gestion du parc informatique, maintenance, gestion d'incidents et projet de mise en place d'une solution de supervision[cite: 13, 14, 15, 16].
                        - Mairie de Neuilly Plaisance (Stage) : Modernisation du parc (passage au SSD), configuration de postes au commissariat de police, installation d'équipements audiovisuels[cite: 17, 18, 19, 23].
                        - Autres : Maintenance d'ordinateurs chez Pheniculair et AZ Events[cite: 26, 31, 34].

                        COMPÉTENCES TECHNIQUES :
                        - Systèmes : Installation Windows/Linux, Gestionnaire de serveurs (Active Directory, DNS, DHCP).
                        - Réseaux : Cisco Netacad IT Essentials, configuration de services réseaux[cite: 51, 52].
                        - Hardware : Assemblage de PC, maintenance, installations audiovisuelles (vidéoprojecteurs, micros)[cite: 49, 50, 51].
                        - Programmation : Arduino, notions de développement SRD.

                        PERSONNALITÉ ET LOISIRS :
                        - Qualités : Professionnel, dynamique, à l'écoute, ponctuel et diligent[cite: 39, 40, 41, 42].
                        - Loisirs : Musculation, Service National Universel (SNU) et assistant d'éducation en club de football.

                        RÈGLES DE RÉPONSE :
                        - Sois toujours poli, pro et encourageant.
                        - Si on te demande ses contacts : alexis.veloso25@gmail.com ou 07 71 82 48 09.
                        - Si on te pose une question dont tu n'as pas la réponse, propose de contacter Alexis directement." 
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
