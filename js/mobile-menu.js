/**
 * Script pour améliorer le menu mobile
 */
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner les éléments du menu
    const menuToggle = document.querySelector('.menu-toggle');
    const menuWrapper = document.getElementById('menu');
    const submenuButtons = document.querySelectorAll('button[aria-controls^="menu-"]');
    const submenuCloseButtons = document.querySelectorAll('[data-close]');
    
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
                
                // Fermer tous les sous-menus ouverts
                closeAllSubmenus();
            }
        });
        
        // Ajouter un écouteur d'événement pour les clics sur les liens du menu
        const menuLinks = document.querySelectorAll('.menu-link--primary');
        menuLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                // Si c'est un bouton qui contrôle un sous-menu, ne pas fermer le menu principal
                if (this.getAttribute('aria-controls')) {
                    return;
                }
                
                // Fermer le menu principal après un clic sur un lien
                menuToggle.setAttribute('aria-expanded', 'false');
                menuWrapper.setAttribute('data-state', 'closed');
            });
        });
        
        // Gestion des sous-menus
        if (submenuButtons.length > 0) {
            submenuButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const submenuId = this.getAttribute('aria-controls');
                    const submenu = document.getElementById(submenuId);
                    const isExpanded = this.getAttribute('aria-expanded') === 'true';
                    
                    if (submenu) {
                        if (isExpanded) {
                            // Fermer le sous-menu
                            this.setAttribute('aria-expanded', 'false');
                            submenu.setAttribute('data-state', 'closed');
                        } else {
                            // Fermer tous les autres sous-menus d'abord
                            closeAllSubmenus();
                            
                            // Ouvrir ce sous-menu
                            this.setAttribute('aria-expanded', 'true');
                            submenu.setAttribute('data-state', 'opened');
                        }
                    }
                });
            });
        }
        
        // Gestion des boutons de fermeture des sous-menus
        if (submenuCloseButtons.length > 0) {
            submenuCloseButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const submenuId = this.getAttribute('data-close');
                    const submenu = document.getElementById(submenuId);
                    const submenuButton = document.querySelector(`[aria-controls="${submenuId}"]`);
                    
                    if (submenu && submenuButton) {
                        submenuButton.setAttribute('aria-expanded', 'false');
                        submenu.setAttribute('data-state', 'closed');
                    }
                });
            });
        }
        
        // Fonction pour fermer tous les sous-menus
        function closeAllSubmenus() {
            const openSubmenus = document.querySelectorAll('.submenu[data-state="opened"]');
            const expandedButtons = document.querySelectorAll('button[aria-expanded="true"][aria-controls^="menu-"]');
            
            openSubmenus.forEach(submenu => {
                submenu.setAttribute('data-state', 'closed');
            });
            
            expandedButtons.forEach(button => {
                button.setAttribute('aria-expanded', 'false');
            });
        }
        
        // Ajouter une classe pour indiquer que le script est chargé
        document.body.classList.add('mobile-menu-js-loaded');
        
        // Ajouter un gestionnaire pour fermer le menu en cliquant en dehors
        document.addEventListener('click', function(event) {
            // Si le menu est ouvert et que l'on clique en dehors du menu et du bouton de menu
            if (menuWrapper.getAttribute('data-state') === 'opened' && 
                !menuWrapper.contains(event.target) && 
                !menuToggle.contains(event.target)) {
                // Fermer le menu
                menuToggle.setAttribute('aria-expanded', 'false');
                menuWrapper.setAttribute('data-state', 'closed');
            }
        });
        
        console.log('Script du menu mobile amélioré chargé avec succès');
    }
});
