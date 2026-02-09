// PWA Service Worker Registration and Installation
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        this.isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                                   window.navigator.standalone === true;
        this.init();
    }

    async init() {
        // Fix pour iOS en mode standalone : les liens internes doivent rester dans l'app
        if (this.isInStandaloneMode) {
            this.fixIOSLinks();
        }

        // Enregistrer le service worker (unifié avec OneSignal)
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

                // Écouter les mises à jour du service worker
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Rechargement automatique silencieux
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                        }
                    });
                });

                // Recharger la page quand le nouveau SW prend le contrôle
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    window.location.reload();
                });

            } catch (error) {
                console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
            }
        }

        // Sur iOS, afficher un guide d'installation si pas déjà installé
        if (this.isIOS && !this.isInStandaloneMode) {
            this.showIOSInstallGuide();
        }

        // Gérer l'événement beforeinstallprompt (Android / Desktop)
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Gérer l'installation de l'app
        window.addEventListener('appinstalled', () => {
            console.log('PWA installée avec succès');
            this.hideInstallButton();
            this.hideIOSInstallGuide();
            this.deferredPrompt = null;
        });
    }

    showInstallButton() {
        // Utiliser le bouton d'installation existant dans le HTML
        const installBtn = document.getElementById('installButton');
        if (installBtn) {
            installBtn.style.display = 'block';
            installBtn.addEventListener('click', () => this.installPWA());
        }
    }

    hideInstallButton() {
        const installBtn = document.getElementById('installButton');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }

    showIOSInstallGuide() {
        // Ne pas afficher si déjà fermé récemment
        if (sessionStorage.getItem('iosInstallDismissed')) return;

        const guide = document.createElement('div');
        guide.id = 'iosInstallGuide';
        guide.innerHTML = `
            <div class="ios-install-guide">
                <button class="ios-install-close" aria-label="Fermer">&times;</button>
                <p class="ios-install-text">
                    Installez <strong>SA06</strong> sur votre iPhone : appuyez sur 
                    <span class="ios-install-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                            <polyline points="16 6 12 2 8 6"/>
                            <line x1="12" y1="2" x2="12" y2="15"/>
                        </svg>
                    </span>
                    puis <strong>« Sur l'écran d'accueil »</strong>
                </p>
            </div>
        `;
        guide.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:10000;padding:12px;background:#fff;box-shadow:0 -2px 10px rgba(0,0,0,0.15);border-top-left-radius:12px;border-top-right-radius:12px;';
        
        const style = document.createElement('style');
        style.textContent = `
            .ios-install-guide { display:flex; align-items:center; gap:8px; padding:4px 0; }
            .ios-install-text { margin:0; font-size:14px; line-height:1.4; color:#333; flex:1; }
            .ios-install-icon { display:inline-flex; vertical-align:middle; }
            .ios-install-close { background:none; border:none; font-size:24px; color:#999; cursor:pointer; padding:0 8px; flex-shrink:0; }
        `;
        document.head.appendChild(style);
        document.body.appendChild(guide);

        guide.querySelector('.ios-install-close').addEventListener('click', () => {
            this.hideIOSInstallGuide();
            sessionStorage.setItem('iosInstallDismissed', 'true');
        });
    }

    hideIOSInstallGuide() {
        const guide = document.getElementById('iosInstallGuide');
        if (guide) guide.remove();
    }

    async installPWA() {
        if (!this.deferredPrompt) return;

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('Utilisateur a accepté l\'installation');
        } else {
            console.log('Utilisateur a refusé l\'installation');
        }

        this.deferredPrompt = null;
        this.hideInstallButton();
    }

    // Fix pour iOS : empecher Safari d'ouvrir les liens internes dans un nouvel onglet
    fixIOSLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            // Ne pas intercepter si c'est dans un bouton ou un element de menu
            if (e.target.closest('button, .menu-toggle')) return;

            const href = link.getAttribute('href');
            if (!href) return;

            // Ignorer les liens speciaux
            if (href.startsWith('mailto:') || href.startsWith('tel:') || href === '#') return;

            // Ignorer les ancres internes
            if (href.startsWith('#')) return;

            // Ignorer les liens avec target="_blank"
            if (link.getAttribute('target') === '_blank') return;

            // Ignorer les liens externes
            if (href.startsWith('http') && !href.includes(window.location.hostname)) return;

            // Lien interne : naviguer dans l'app sans ouvrir Safari
            e.preventDefault();
            window.location.assign(new URL(href, window.location.href).href);
        });
    }

}

// Les styles PWA sont maintenant dans le fichier style.css

// Initialiser le gestionnaire PWA
window.pwaManager = new PWAManager();
