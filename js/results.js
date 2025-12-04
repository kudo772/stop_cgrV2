// results.js - Version Corrigée

console.log("Le script results.js est bien chargé !");

document.addEventListener('DOMContentLoaded', () => {
    // Récupération des éléments par leur ID
    const readMoreBtn = document.getElementById('read-more-btn');
    const studyShort = document.getElementById('study-short');
    const studyLong = document.getElementById('study-long');

    // Vérification de sécurité : est-ce que les éléments existent ?
    if (!readMoreBtn || !studyShort || !studyLong) {
        console.error("Erreur : Un des éléments (bouton ou textes) est introuvable dans le HTML.");
        return; // On arrête tout si un élément manque
    }

    // Ajout de l'événement au clic
    readMoreBtn.addEventListener('click', () => {
        console.log("Bouton cliqué !");

        // 1. Masquer le résumé
        studyShort.style.display = 'none';
        
        // 2. Masquer le bouton lui-même
        readMoreBtn.style.display = 'none';

        // 3. Afficher le texte long (bloc)
        studyLong.style.display = 'block';
        
        // Petit effet d'apparition simple (opacity)
        studyLong.style.opacity = 0;
        setTimeout(() => {
            studyLong.style.transition = "opacity 0.5s";
            studyLong.style.opacity = 1;
        }, 10);
    });
});