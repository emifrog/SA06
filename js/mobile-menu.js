/**
 * Script pour améliorer le menu mobile
 * Compatible iOS PWA standalone mode
 *
 * IMPORTANT : ne pas utiliser de double binding click + touchend,
 * cela provoque un toggle open/close instantané sur iOS standalone.
 * Un seul addEventListener('click') suffit car iOS déclenche bien
 * l'événement click après un tap, même en mode standalone.
 */
document.addEventListener('DOMContentLoaded', function() {
    var menuToggle = document.querySelector('.menu-toggle');
    var menuWrapper = document.getElementById('menu');

    if (!menuToggle || !menuWrapper) return;

    // Fonction pour fermer tous les sous-menus
    function closeAllSubmenus() {
        document.querySelectorAll('.submenu[data-state="opened"]').forEach(function(menu) {
            menu.setAttribute('data-state', 'closed');
            var btn = document.querySelector('button[aria-controls="' + menu.id + '"]');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });
    }

    // Basculer le menu
    function toggleMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        var isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuWrapper.setAttribute('data-state', 'closed');
            document.body.style.overflow = '';
        } else {
            menuToggle.setAttribute('aria-expanded', 'true');
            menuWrapper.setAttribute('data-state', 'opened');
            document.body.style.overflow = 'hidden';
            closeAllSubmenus();
        }
    }

    menuToggle.addEventListener('click', toggleMenu);

    // Liens du menu : fermer le menu au clic
    var menuLinks = document.querySelectorAll('.menu-link--primary');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (link.getAttribute('aria-controls')) return;
            menuToggle.setAttribute('aria-expanded', 'false');
            menuWrapper.setAttribute('data-state', 'closed');
            document.body.style.overflow = '';
        });
    });

    document.body.classList.add('mobile-menu-js-loaded');

    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', function(event) {
        if (menuWrapper.getAttribute('data-state') === 'opened' &&
            !menuWrapper.contains(event.target) &&
            !menuToggle.contains(event.target)) {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuWrapper.setAttribute('data-state', 'closed');
            document.body.style.overflow = '';
        }
    });
});
