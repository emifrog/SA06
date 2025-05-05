/**
 * Script pour corriger le problème des sous-menus
 */
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner tous les boutons qui contrôlent les sous-menus
    const submenuButtons = document.querySelectorAll('button[aria-controls^="menu-"]');
    
    // Ajouter des écouteurs d'événements à chaque bouton
    submenuButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Récupérer l'ID du sous-menu à partir de l'attribut aria-controls
            const submenuId = this.getAttribute('aria-controls');
            const submenu = document.getElementById(submenuId);
            
            if (submenu) {
                // Vérifier l'état actuel du sous-menu
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                // Basculer l'état du sous-menu
                if (isExpanded) {
                    // Fermer le sous-menu
                    this.setAttribute('aria-expanded', 'false');
                    submenu.setAttribute('data-state', 'closed');
                } else {
                    // Ouvrir le sous-menu
                    this.setAttribute('aria-expanded', 'true');
                    submenu.setAttribute('data-state', 'opened');
                    
                    // Fermer les autres sous-menus
                    document.querySelectorAll('.submenu[data-state="opened"]').forEach(menu => {
                        if (menu.id !== submenuId) {
                            menu.setAttribute('data-state', 'closed');
                            const otherButton = document.querySelector(`button[aria-controls="${menu.id}"]`);
                            if (otherButton) {
                                otherButton.setAttribute('aria-expanded', 'false');
                            }
                        }
                    });
                }
            }
        });
    });
    
    // Sélectionner tous les boutons de fermeture des sous-menus
    const closeButtons = document.querySelectorAll('button[data-close]');
    
    // Ajouter des écouteurs d'événements à chaque bouton de fermeture
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Récupérer l'ID du sous-menu à partir de l'attribut data-close
            const submenuId = this.getAttribute('data-close');
            const submenu = document.getElementById(submenuId);
            
            if (submenu) {
                // Fermer le sous-menu
                submenu.setAttribute('data-state', 'closed');
                
                // Mettre à jour l'état du bouton qui contrôle ce sous-menu
                const controlButton = document.querySelector(`button[aria-controls="${submenuId}"]`);
                if (controlButton) {
                    controlButton.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
});
