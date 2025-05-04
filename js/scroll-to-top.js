/**
 * Script pour le bouton de remontée de page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Récupérer le bouton
    const scrollToTopButton = document.getElementById('scroll-to-top');
    
    // Fonction pour vérifier la position de défilement et afficher/masquer le bouton
    function toggleScrollToTopButton() {
        if (window.scrollY > 300) {
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
        }
    }
    
    // Ajouter un écouteur d'événement pour le défilement de la page
    window.addEventListener('scroll', toggleScrollToTopButton);
    
    // Ajouter un écouteur d'événement pour le clic sur le bouton
    scrollToTopButton.addEventListener('click', function() {
        // Faire défiler la page vers le haut en douceur
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Vérifier la position initiale au chargement de la page
    toggleScrollToTopButton();
});
