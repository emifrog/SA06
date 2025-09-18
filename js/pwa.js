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
                console.log('Service Worker enregistré avec succès:', registration);
                
                // Écouter les mises à jour du service worker
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
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

    showUpdateNotification() {
        // Créer une notification de mise à jour
        const notification = document.createElement('div');
        notification.id = 'pwa-update-notification';
        notification.innerHTML = `
            <div class="pwa-notification">
                <span>Une nouvelle version est disponible</span>
                <button onclick="window.pwaManager.updateApp()">Mettre à jour</button>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        notification.className = 'pwa-update-banner';
        
        document.body.appendChild(notification);
        
        // Auto-hide après 10 secondes
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    async updateApp() {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            }
        }
    }
}

// Les styles PWA sont maintenant dans le fichier style.css

// Initialiser le gestionnaire PWA
window.pwaManager = new PWAManager();
