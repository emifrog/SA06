// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker enregistré avec succès:', registration.scope);
      })
      .catch(error => {
        console.error("Échec de l'enregistrement du Service Worker:", error);
      });
  });
}

// Gestion de l'installation de la PWA
let deferredPrompt;
const installButton = document.getElementById('installButton');

window.addEventListener('beforeinstallprompt', (e) => {
  // Empêcher le mini-infobar d'apparaître sur mobile
  e.preventDefault();
  
  // Stocker l'événement pour pouvoir le déclencher plus tard
  deferredPrompt = e;
  
  // Afficher le bouton d'installation
  if (installButton) {
    installButton.style.display = 'flex';
    installButton.classList.add('visible');
    
    // Ajouter un gestionnaire d'événements pour le clic sur le bouton
    installButton.addEventListener('click', installApp);
  }
  
  // Optionnel: journalisation pour le débogage
  console.log('beforeinstallprompt event was fired');
});

// Fonction pour gérer l'installation
function installApp() {
  if (!deferredPrompt) return;
  
  // Afficher l'invite d'installation
  deferredPrompt.prompt();
  
  // Attendre que l'utilisateur réponde à l'invite
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('L\'utilisateur a accepté l\'installation');
      // Masquer le bouton après l'installation
      if (installButton) {
        installButton.style.display = 'none';
      }
    } else {
      console.log('L\'utilisateur a refusé l\'installation');
    }
    
    // Réinitialiser la variable deferredPrompt car il ne peut être utilisé qu'une seule fois
    deferredPrompt = null;
  });
}

// Cacher le bouton si l'application est déjà installée
window.addEventListener('appinstalled', (evt) => {
  console.log('L\'application a été installée avec succès');
  if (installButton) {
    installButton.style.display = 'none';
  }
  // Réinitialiser la variable deferredPrompt
  deferredPrompt = null;
});

// Vérifier si l'application est déjà installée
const isAppInstalled = () => {
  return (window.matchMedia('(display-mode: standalone)').matches) || 
         (window.navigator.standalone) || 
         document.referrer.includes('android-app://');
};

// Cacher le bouton si l'application est déjà installée
if (isAppInstalled() && installButton) {
  installButton.style.display = 'none';
}

// Gérer l'installation depuis le menu du navigateur
if (window.navigator && window.navigator.serviceWorker) {
  window.navigator.serviceWorker.getRegistrations().then(registrations => {
    if (registrations.length > 0) {
      console.log('Service Worker déjà enregistré');
    }
  });
}

// Amélioration de l'expérience hors ligne
window.addEventListener('online', () => {
  // Mettre à jour l'interface utilisateur pour indiquer que l'application est en ligne
  console.log('Application en ligne');
});

window.addEventListener('offline', () => {
  // Mettre à jour l'interface utilisateur pour indiquer que l'application est hors ligne
  console.log('Application hors ligne - Mode hors ligne activé');
});

// Vérifier l'état de la connexion au chargement
if (!navigator.onLine) {
  console.log('Application chargée en mode hors ligne');
}
