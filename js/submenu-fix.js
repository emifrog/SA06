/**
 * Script pour corriger le problème d'affichage des sous-menus
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Submenu fix script loaded');
    
    // Sélectionner tous les boutons qui contrôlent les sous-menus
    const submenuButtons = document.querySelectorAll('button[aria-controls^="menu-"]');
    
    // Vérifier dans la console si les boutons sont trouvés
    console.log('Submenu buttons found:', submenuButtons.length);
    
    // Ajouter des écouteurs d'événements à chaque bouton
    submenuButtons.forEach(button => {
        const submenuId = button.getAttribute('aria-controls');
        const submenu = document.getElementById(submenuId);
        
        // Vérifier si le sous-menu correspondant existe
        if (submenu) {
            console.log('Submenu found:', submenuId);
            
            // Supprimer les écouteurs d'événements existants pour éviter les conflits
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Ajouter un nouvel écouteur d'événement
            newButton.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                // Récupérer l'état actuel du sous-menu
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                console.log('Button clicked for', submenuId, 'Current state:', isExpanded ? 'expanded' : 'collapsed');
                
                // Basculer l'état du sous-menu
                if (isExpanded) {
                    // Fermer le sous-menu
                    this.setAttribute('aria-expanded', 'false');
                    submenu.setAttribute('data-state', 'closed');
                    console.log('Closing submenu:', submenuId);
                } else {
                    // Fermer les autres sous-menus d'abord
                    document.querySelectorAll('.submenu[data-state="opened"]').forEach(menu => {
                        if (menu.id !== submenuId) {
                            menu.setAttribute('data-state', 'closed');
                            const otherButton = document.querySelector(`button[aria-controls="${menu.id}"]`);
                            if (otherButton) {
                                otherButton.setAttribute('aria-expanded', 'false');
                            }
                        }
                    });
                    
                    // Ouvrir ce sous-menu
                    this.setAttribute('aria-expanded', 'true');
                    submenu.setAttribute('data-state', 'opened');
                    console.log('Opening submenu:', submenuId);
                }
            });
        } else {
            console.error('Submenu not found for button with aria-controls:', submenuId);
        }
    });
    
    // Sélectionner tous les boutons de fermeture des sous-menus
    const closeButtons = document.querySelectorAll('button[data-close]');
    
    // Ajouter des écouteurs d'événements à chaque bouton de fermeture
    closeButtons.forEach(button => {
        // Supprimer les écouteurs d'événements existants
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Ajouter un nouvel écouteur d'événement
        newButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
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
                
                console.log('Closed submenu via close button:', submenuId);
            }
        });
    });
    
    // Ajouter un gestionnaire pour fermer les sous-menus en cliquant en dehors
    document.addEventListener('click', function(event) {
        // Si on clique en dehors d'un sous-menu ouvert et de son bouton de contrôle
        document.querySelectorAll('.submenu[data-state="opened"]').forEach(submenu => {
            const button = document.querySelector(`button[aria-controls="${submenu.id}"]`);
            
            if (button && !submenu.contains(event.target) && !button.contains(event.target)) {
                // Fermer le sous-menu
                button.setAttribute('aria-expanded', 'false');
                submenu.setAttribute('data-state', 'closed');
                console.log('Closed submenu by clicking outside:', submenu.id);
            }
        });
    });
});
