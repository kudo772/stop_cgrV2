// script.js

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // --- 1. FONCTION DE CHARGEMENT DU THÈME PERSISTANT ---
    function loadTheme() {
        // 1.1. Tenter de récupérer le thème sauvegardé
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'dark-mode') {
            // 1.2. Si le thème sombre est sauvegardé, l'appliquer
            body.classList.add('dark-mode');
            if (themeToggle) {
                themeToggle.textContent = 'Mode Clair ☀️';
            }
        } else {
            // 1.3. Sinon (thème clair par défaut ou sauvegardé), ne rien faire (car le thème clair est par défaut)
            if (themeToggle) {
                themeToggle.textContent = 'Mode Sombre 🌙';
            }
        }
    }

    // --- 2. FONCTION DE CHANGEMENT DE THÈME ET DE SAUVEGARDE ---
    function toggleThemeAndSave() {
        // Changer la classe (Dark Mode <-> Light Mode)
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            // Si on est en mode sombre :
            if (themeToggle) {
                themeToggle.textContent = 'Mode Clair ☀️';
            }
            // Sauvegarder la préférence
            localStorage.setItem('theme', 'dark-mode');
        } else {
            // Si on passe en mode clair :
            if (themeToggle) {
                themeToggle.textContent = 'Mode Sombre 🌙';
            }
            // Supprimer l'entrée pour revenir au défaut (ou la définir sur 'light-mode')
            localStorage.setItem('theme', 'light-mode'); 
            // Alternative : localStorage.removeItem('theme');
        }
    }

    // --- 3. MISE EN PLACE DES ÉVÉNEMENTS ---

    // Exécuter la fonction de chargement au démarrage de la page
    loadTheme();

    // Attacher l'écouteur d'événement au bouton si celui-ci existe
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleThemeAndSave);
    }
});