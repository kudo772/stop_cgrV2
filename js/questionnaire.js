// js/questionnaire.js - Version 1.0 (Corrigée et Complète pour 18 étapes)

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quitting-form');
    // Sélecteur mis à jour pour récupérer correctement toutes les étapes
    const allSteps = Array.from(form.querySelectorAll('.step')); 
    const progressIndicator = document.getElementById('progress-indicator');
    const stepDisplay = document.getElementById('current-step-display');
    // Le bouton submit doit être dans le HTML, ici on le cherche juste pour la dernière étape
    const submitButton = form.querySelector('button[type="submit"]'); 

    const TOTAL_STEPS = allSteps.length;
    let currentStepIndex = 0; // Index du tableau (0 à 17 pour 18 étapes)


    // --- LOGIQUE DE PROFILAGE ET REDIRECTION ---
    // --- LOGIQUE DE PROFILAGE ET REDIRECTION (UNIQUEMENT QTE) ---
function determineProfileAndRedirect(answers) {
    // Collecte uniquement la réponse pertinente
    const cigsPerDay = parseInt(answers.cigs_par_jour) || 0;
    
    let targetPage = '';

    // Détermination du profil basé SEULEMENT sur la quantité, avec les seuils 5 et 12
    if (cigsPerDay >= 13) {
        // 13 cigarettes ou plus
        targetPage = 'grosfumeur.html';
        
    } else if (cigsPerDay >= 6) {
        // Entre 6 et 12 cigarettes
        targetPage = 'moyenfumeur.html';
        
    } else {
        // 5 cigarettes ou moins
        targetPage = 'petitfumeur.html';
    }
    
    // Log des données (essentiel pour l'envoi au propriétaire du site)
    console.log("Quantité de cigarettes par jour : " + cigsPerDay);
    console.log("Redirection basée uniquement sur la quantité vers : " + targetPage);

    // Redirection finale
    window.location.href = targetPage;
}


    // --- 1. FONCTIONS UTILITAIRES ---

    function checkIfLastStep() {
        return currentStepIndex === TOTAL_STEPS - 1;
    }

    function validateStep(stepElement) {
        let isValid = true;
        
        // Cacher les messages d'erreur précédents
        stepElement.querySelectorAll('[required]').forEach(input => {
            input.style.border = ''; 
        });

        // Validation des champs requis (text, number, email, date, select)
        const requiredInputs = stepElement.querySelectorAll('[required]');
        
        requiredInputs.forEach(input => {
            if (input.type === 'radio' || input.type === 'checkbox') return;
            if (!input.value) {
                isValid = false;
                input.style.border = '2px solid red';
            }
        });
        
        // Validation spécifique pour les groupes de Radio et Select
        const radioGroups = stepElement.querySelectorAll('input[type="radio"][required]');
        if (radioGroups.length > 0) {
            const groupName = radioGroups[0].name;
            const checkedRadio = stepElement.querySelector(`input[name="${groupName}"]:checked`);
            if (!checkedRadio) {
                isValid = false;
            }
        }
        
        // Validation spécifique pour les Select (option par défaut avec value="")
        const selectFields = stepElement.querySelectorAll('select[required]');
        selectFields.forEach(select => {
            if (!select.value) {
                isValid = false;
                select.style.border = '2px solid red';
            }
        });
        
        return isValid;
    }


    function updateStepsDisplay() {
        const currentStepElement = allSteps[currentStepIndex];

        // Masquer toutes les étapes et marquer celles qui sont complétées
        allSteps.forEach((step, index) => {
            step.classList.remove('active-step', 'completed');
            if (index < currentStepIndex) {
                step.classList.add('completed');
            }
        });

        if (currentStepElement) {
            // 💡 AFFICHAGE : Active l'étape courante
            currentStepElement.classList.add('active-step'); 
            
            // Fait défiler jusqu'à l'étape active 
            currentStepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Gérer l'affichage des boutons Continuer (auto-show)
            const nextBtn = currentStepElement.querySelector('.next-btn.auto-show');
            const manualNextBtn = currentStepElement.querySelector('.next-btn:not(.auto-show)');

            // Masquer les boutons submit/next/manual
            if (submitButton) submitButton.style.display = 'none'; 
            if (nextBtn) nextBtn.style.display = 'none';
            if (manualNextBtn) manualNextBtn.style.display = 'inline-block'; // Par défaut pour les étapes non radio/checkbox

            
            if (checkIfLastStep()) {
                // ÉTAPE 18 (FINALE) : Afficher le bouton de Soumission
                if(nextBtn) nextBtn.style.display = 'none'; 
                if(manualNextBtn) manualNextBtn.style.display = 'none';
                if (submitButton) submitButton.style.display = 'inline-block';
            } else {
                // Étapes intermédiaires
                if (nextBtn) {
                    // 🚨 CORRECTION n°1 : Afficher le bouton par défaut sur l'étape 1 (où rien n'est coché)
                    if (currentStepIndex === 0) {
                         nextBtn.style.display = 'inline-block';
                    } else {
                        // Logique standard d'affichage automatique pour les étapes radio suivantes
                        const checkedInput = currentStepElement.querySelector('input[type="radio"]:checked');
                        nextBtn.style.display = checkedInput ? 'inline-block' : 'none';
                    }
                }
            }
        }

        // Mettre à jour la barre de progression et le compteur
        const progressPercent = (currentStepIndex) / (TOTAL_STEPS - 1) * 100;
        progressIndicator.style.width = `${progressPercent}%`;
        stepDisplay.textContent = `${currentStepIndex + 1} sur ${TOTAL_STEPS}`;
    }


    // --- 2. GESTION DES ÉVÉNEMENTS ---

    // Gère le passage à l'étape suivante (validation et affichage)
    form.addEventListener('click', (event) => {
        if (event.target.classList.contains('next-btn')) {
            const currentStepElement = allSteps[currentStepIndex];
            
            // Si le bouton 'next-btn' est cliqué manuellement (non auto-show)
            if (validateStep(currentStepElement)) {
                if (currentStepIndex < TOTAL_STEPS - 1) {
                    currentStepIndex++;
                    updateStepsDisplay();
                }
            }
        }
    });

    // Gère le retour à l'étape précédente
    form.addEventListener('click', (event) => {
        if (event.target.classList.contains('prev-btn')) {
            if (currentStepIndex > 0) {
                currentStepIndex--;
                updateStepsDisplay();
            }
        }
    });

    // Gère les changements (pour afficher les boutons auto-show)
    form.addEventListener('change', (event) => {
        const input = event.target;
        const currentStepElement = input.closest('.step');
        
        if (!currentStepElement) return;

        // Si l'input est une radio qui utilise l'auto-show, on recalcule l'affichage
        const nextBtn = currentStepElement.querySelector('.next-btn.auto-show');
        if (input.type === 'radio' && nextBtn) {
             updateStepsDisplay(); 
        } 
    });


    // Gère la soumission finale
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const finalStepElement = allSteps[currentStepIndex];

        if (!checkIfLastStep()) {
            console.error("Tentative de soumission avant l'étape finale.");
            return;
        }

        if (validateStep(finalStepElement)) {
            
            // Collecte de toutes les réponses
            const formData = new FormData(form);
            const answers = Object.fromEntries(formData.entries());
            
            // Détermine le profil et redirige
            determineProfileAndRedirect(answers);
        } else {
            // Affichera les erreurs visuelles grâce à validateStep
        }
    });

    // Initialisation du questionnaire (pour afficher la première étape)
    updateStepsDisplay();
});