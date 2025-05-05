/**
 * Script pour améliorer le menu mobile
 */
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner le bouton de menu
    const menuToggle = document.querySelector('.menu-toggle');
    const menuWrapper = document.getElementById('menu');
    
    // Vérifier si les éléments existent
    if (menuToggle && menuWrapper) {
        // Ajouter un écouteur d'événement pour le clic sur le bouton de menu
        menuToggle.addEventListener('click', function() {
            // Vérifier l'état actuel du menu
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            
            // Basculer l'état du menu
            if (isExpanded) {
                // Fermer le menu
                menuToggle.setAttribute('aria-expanded', 'false');
                menuWrapper.setAttribute('data-state', 'closed');
            } else {
                // Ouvrir le menu
                menuToggle.setAttribute('aria-expanded', 'true');
                menuWrapper.setAttribute('data-state', 'opened');
            }
        });
        
        // Ajouter un écouteur d'événement pour les clics sur les liens du menu
        const menuLinks = document.querySelectorAll('.menu-link--primary');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Si c'est un bouton qui contrôle un sous-menu, ne pas fermer le menu principal
                if (this.getAttribute('aria-controls')) {
                    return;
                }
                
                // Fermer le menu principal après un clic sur un lien
                menuToggle.setAttribute('aria-expanded', 'false');
                menuWrapper.setAttribute('data-state', 'closed');
            });
        });
        
        // Ajouter une classe pour indiquer que le script est chargé
        document.body.classList.add('mobile-menu-js-loaded');
        
        console.log('Script du menu mobile chargé avec succès');
    }
});
