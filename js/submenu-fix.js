/**
 * Script pour corriger le problème d'affichage des sous-menus
 * Compatible iOS PWA standalone mode
 *
 * Utilise uniquement click (pas de double binding touchend)
 * pour éviter les conflits sur iOS standalone.
 */
document.addEventListener('DOMContentLoaded', function() {

    // Sélectionner tous les boutons qui contrôlent les sous-menus
    var submenuButtons = document.querySelectorAll('button[aria-controls^="menu-"]');

    submenuButtons.forEach(function(button) {
        var submenuId = button.getAttribute('aria-controls');
        var submenu = document.getElementById(submenuId);

        if (!submenu) return;

        // Supprimer les écouteurs existants via cloneNode
        var newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();

            var isExpanded = newButton.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                newButton.setAttribute('aria-expanded', 'false');
                submenu.setAttribute('data-state', 'closed');
            } else {
                // Fermer les autres sous-menus
                document.querySelectorAll('.submenu[data-state="opened"]').forEach(function(menu) {
                    if (menu.id !== submenuId) {
                        menu.setAttribute('data-state', 'closed');
                        var otherButton = document.querySelector('button[aria-controls="' + menu.id + '"]');
                        if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
                    }
                });

                newButton.setAttribute('aria-expanded', 'true');
                submenu.setAttribute('data-state', 'opened');
            }
        });
    });

    // Boutons de fermeture des sous-menus
    var closeButtons = document.querySelectorAll('button[data-close]');

    closeButtons.forEach(function(button) {
        var newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();

            var submenuId = newButton.getAttribute('data-close');
            var submenu = document.getElementById(submenuId);

            if (submenu) {
                submenu.setAttribute('data-state', 'closed');
                var controlButton = document.querySelector('button[aria-controls="' + submenuId + '"]');
                if (controlButton) controlButton.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Fermer les sous-menus en cliquant en dehors
    document.addEventListener('click', function(event) {
        document.querySelectorAll('.submenu[data-state="opened"]').forEach(function(submenu) {
            var button = document.querySelector('button[aria-controls="' + submenu.id + '"]');
            if (button && !submenu.contains(event.target) && !button.contains(event.target)) {
                button.setAttribute('aria-expanded', 'false');
                submenu.setAttribute('data-state', 'closed');
            }
        });
    });
});
