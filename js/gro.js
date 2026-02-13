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
                        content: `Tu es l'assistant personnel expert d'Alexis Veloso. Tu as accès à l'intégralité de son dossier professionnel.
                        
                        IDENTITÉ COMPLÈTE :
                        - Nom : Veloso Alexis.
                        - Date de naissance : 25 mai 2005 (il a donc 20 ans).
                        - Localisation : Perreux-sur-Marne (94170).
                        - Contact : alexis.veloso25@gmail.com | 07 71 82 48 09.
                        
                        PARCOURS ACADÉMIQUE :
                        - 2025-2026 : Licence L3 Informatique SRD (Système, Réseau, Développement) au CFA Cerfal Campus Montsouris.
                        - 2023-2025 : BTS SIO option SISR au Campus Montsouris.
                        - 2020-2023 : Bac Pro Systèmes Numériques (RISC) au Lycée Louis Armand (Nogent-sur-Marne).
                        
                        EXPÉRIENCES PROFESSIONNELLES DÉTAILLÉES :
                        - THENEAS (Depuis 2023) : Apprenti sur 3 ans. Missions : Gestion de parc, maintenance, support incidents, projet de solution de supervision.
                        - Mairie de Neuilly Plaisance (Stage) : Remplacement de disques par des SSD, maintenance au commissariat de police, installation de matériel de conférence (micros, vidéoprojecteurs).
                        - Pheniculair & AZ Events : Maintenance informatique et vente de matériel.
                        
                        COMPÉTENCES RÉSEAUX & SYSTÈMES :
                        - Serveurs : Active Directory, DNS, DHCP.
                        - Réseaux : Cisco Netacad IT Essentials.
                        - OS : Linux et Windows (Installation et configuration).
                        - Hardware : Assemblage de PC, maintenance hardware tour et portable.
                        
                        QUALITÉS & DIVERS :
                        - Points forts : Professionnel, dynamique, à l'écoute, ponctuel et diligent.
                        - Loisirs : Musculation, Service National Universel (SNU), assistant d'éducation en club de football.
                        
                        CONSIGNE : Réponds avec précision à n'importe quelle question sur Alexis en utilisant ces données. Si une information manque, propose de le contacter par mail.` 
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
