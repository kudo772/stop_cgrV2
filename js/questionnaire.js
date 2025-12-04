// questionnaire.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quitting-form');
    const allSteps = Array.from(form.querySelectorAll('.step'));
    const progressIndicator = document.getElementById('progress-indicator');
    const stepDisplay = document.getElementById('current-step-display');
    const totalStepsInForm = 18;
    
    // Contient uniquement les étapes visibles/actives
    let visibleSteps = []; 
    let currentStepIndex = 0; // Index dans le tableau visibleSteps

    // --- 1. FONCTIONS UTILITAIRES DE GESTION DES ÉTAPES VISIBLES ---

    // Met à jour le tableau 'visibleSteps' en tenant compte des conditions
    function updateVisibleSteps() {
        visibleSteps = allSteps.filter(step => {
            if (step.classList.contains('conditional-step')) {
                const parentName = step.dataset.parentQuestion;
                const requiredValue = step.dataset.parentValue;
                
                // Vérifie si la réponse à la question parente correspond
                const parentInput = form.querySelector(`input[name="${parentName}"]:checked`);
                return parentInput && parentInput.value === requiredValue;
            }
            // Inclut toutes les étapes non conditionnelles
            return true;
        });

        // S'assurer que l'index actuel ne dépasse pas la nouvelle taille du tableau
        if (currentStepIndex >= visibleSteps.length) {
            currentStepIndex = visibleSteps.length - 1;
        }
        if (currentStepIndex < 0) currentStepIndex = 0;
    }

    // Fonction pour valider l'étape active
    function validateStep(stepElement) {
        let isValid = true;
        
        // 1. Validation des champs requis (sauf radios et checkboxes)
        const requiredInputs = stepElement.querySelectorAll('input[required], select[required]');
        
        requiredInputs.forEach(input => {
            if (input.type !== 'radio' && input.type !== 'checkbox' && !input.value) {
                isValid = false;
                input.style.border = '2px solid red';
            } else if (input.type !== 'radio' && input.type !== 'checkbox') {
                input.style.border = ''; 
            }
        });
        
        // 2. Validation spécifique pour les groupes de Radio
        const radioGroups = stepElement.querySelectorAll('input[type="radio"][required]');
        if (radioGroups.length > 0) {
            // Un seul groupe de radio est généralement requis par étape
            const groupName = radioGroups[0].name;
            const checkedRadio = stepElement.querySelector(`input[name="${groupName}"]:checked`);
            if (!checkedRadio) {
                isValid = false;
            }
        }

        return isValid;
    }

    // Fonction pour mettre à jour l'affichage de l'étape et la barre de progression
    function updateStepsDisplay() {
        // 1. Mettre à jour la liste des étapes visibles en fonction des réponses conditionnelles
        updateVisibleSteps(); 

        const currentStepElement = visibleSteps[currentStepIndex];
        
        allSteps.forEach(step => {
            step.classList.remove('active-step', 'completed');
            step.style.display = 'none';

            // Afficher les étapes déjà complétées (toutes celles avant l'étape active)
            const stepIndexInVisible = visibleSteps.indexOf(step);
            if (stepIndexInVisible >= 0 && stepIndexInVisible < currentStepIndex) {
                 step.classList.add('completed');
                 step.style.display = 'block';
            }
        });

        if (currentStepElement) {
            // Afficher l'étape active
            currentStepElement.classList.add('active-step');
            currentStepElement.style.display = 'block';
            
            // Défilement automatique vers l'étape active
            currentStepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Gérer l'affichage du bouton auto-show (pour les cartes radio)
            const nextBtn = currentStepElement.querySelector('.next-btn.auto-show');
            if (nextBtn) {
                 const checkedInput = currentStepElement.querySelector('input[type="radio"]:checked');
                 nextBtn.style.display = checkedInput ? 'inline-block' : 'none';
            }
        }


        // 2. Mettre à jour la barre de progression et le compteur
        const progressPercent = (currentStepIndex + 1) / visibleSteps.length * 100;
        progressIndicator.style.width = `${progressPercent}%`;

        // Affichage numérique : X sur Y (Y étant le nombre d'étapes visibles)
        stepDisplay.textContent = `${currentStepIndex + 1} sur ${visibleSteps.length}`;
    }

    // --- 2. GESTION DES ÉVÉNEMENTS ---

    // Gère le passage à l'étape suivante (validation et affichage)
    form.addEventListener('click', (event) => {
        if (event.target.classList.contains('next-btn')) {
            const currentStepElement = visibleSteps[currentStepIndex];
            
            if (validateStep(currentStepElement)) {
                if (currentStepIndex < visibleSteps.length - 1) {
                    currentStepIndex++;
                    // Si on saute des étapes conditionnelles, on met à jour la liste visibleSteps
                    updateVisibleSteps(); 
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
                // Mise à jour car l'étape précédente pourrait être l'étape de contrôle
                updateVisibleSteps(); 
                updateStepsDisplay();
            }
        }
    });

    // Gère l'interaction avec les radios et sélecteurs pour les boutons auto-show et les étapes conditionnelles
    form.addEventListener('change', (event) => {
        const input = event.target;
        const currentStepElement = input.closest('.step');
        
        if (!currentStepElement) return;

        // 1. Gérer l'affichage du bouton Continuer (pour les radios/cartes)
        const nextBtn = currentStepElement.querySelector('.next-btn.auto-show');
        if (input.type === 'radio' && nextBtn) {
            nextBtn.style.display = 'inline-block';
        } 
        // 2. Si c'est une question qui contrôle une étape conditionnelle (Q13 ou Q16), recalculer les étapes visibles
        if (currentStepElement.querySelector('[data-control-target]')) {
            // Mise à jour car la réponse change le chemin
            updateVisibleSteps();
            
            // Si la réponse change (ex: passe de OUI à NON), on se replace correctement
            // On s'assure que l'étape active est toujours affichée
            const newIndex = visibleSteps.indexOf(currentStepElement);
            if (newIndex !== -1) {
                currentStepIndex = newIndex;
            }
        }
    });


    // Gère la soumission finale
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const finalStepElement = visibleSteps[currentStepIndex];
        if (validateStep(finalStepElement)) {
            
            // --- LOGIQUE DE PROFILAGE ET REDIRECTION (PROCHAINE ÉTAPE) ---
            const formData = new FormData(form);
            const answers = Object.fromEntries(formData.entries());
            console.log("Réponses soumises :", answers);

            alert('Évaluation terminée. Redirection vers la page de résultats...');
            
            // Appeler ici la fonction de profilage et de redirection
            // exemple: determineProfileAndRedirect(answers);

            // Pour l'instant, on redirige juste à titre d'exemple
            window.location.href = 'index.html'; // Remplacez par la logique de redirection réelle
        }
    });

    // Initialisation
    updateVisibleSteps();
    updateStepsDisplay();
});