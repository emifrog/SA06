// PWA Service Worker Registration and Installation
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    async init() {
        // Enregistrer le service worker
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');

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

        // Gérer l'événement beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Gérer l'installation de l'app
        window.addEventListener('appinstalled', () => {
            console.log('PWA installée avec succès');
            this.hideInstallButton();
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

}

// Les styles PWA sont maintenant dans le fichier style.css

// Initialiser le gestionnaire PWA
window.pwaManager = new PWAManager();
