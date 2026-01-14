/**
 * YouTube Player - Version améliorée avec miniature garantie
 */
class YouTubePlayer extends HTMLElement {
  constructor() {
    super();
  }
  
  connectedCallback() {
    // Récupérer les attributs
    this.videoId = this.getAttribute('video');
    this.posterUrl = this.getAttribute('poster');
    this.durationText = this.getAttribute('duration') || '';
    
    // Créer le conteneur principal
    this.innerHTML = '';
    this.style.display = 'block';
    this.style.position = 'relative';
    this.style.width = '100%';
    this.style.paddingBottom = '56.25%';
    this.style.marginBottom = '2rem';
    
    // Créer le conteneur du lecteur
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = '#000';
    container.style.overflow = 'hidden';
    container.style.cursor = 'pointer';
    this.appendChild(container);
    
    // Créer l'image d'arrière-plan par défaut (affichée immédiatement)
    const defaultBackground = document.createElement('div');
    defaultBackground.style.position = 'absolute';
    defaultBackground.style.top = '0';
    defaultBackground.style.left = '0';
    defaultBackground.style.width = '100%';
    defaultBackground.style.height = '100%';
    defaultBackground.style.backgroundColor = '#000';
    defaultBackground.style.display = 'flex';
    defaultBackground.style.alignItems = 'center';
    defaultBackground.style.justifyContent = 'center';
    
    // Ajouter un logo YouTube au centre
    defaultBackground.innerHTML = `
      <svg width="68" height="48" viewBox="0 0 68 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="68" height="48" rx="10" fill="#${this.videoId ? 'ed1b24' : '3262ac'}"/>
        <path d="M27 16L45 24L27 32V16Z" fill="white"/>
      </svg>
    `;
    container.appendChild(defaultBackground);
    
    // Ajouter l'image d'aperçu (miniature YouTube)
    const poster = document.createElement('img');
    poster.style.position = 'absolute';
    poster.style.top = '0';
    poster.style.left = '0';
    poster.style.width = '100%';
    poster.style.height = '100%';
    poster.style.objectFit = 'cover';
    poster.style.opacity = '0'; // Caché par défaut
    poster.style.transition = 'opacity 0.3s ease';
    
    // Fonction pour essayer différentes sources de miniatures
    const tryMultipleSources = () => {
      // Essayer d'abord l'API YouTube oEmbed pour obtenir la miniature
      const corsProxy = '';
      const oembedUrl = `${corsProxy}https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${this.videoId}&format=json`;
      
      // Tableau des qualités de miniatures à essayer
      const thumbnailQualities = [
        `https://i.ytimg.com/vi/${this.videoId}/maxresdefault.jpg`,  // Haute qualité
        `https://i.ytimg.com/vi/${this.videoId}/sddefault.jpg`,      // Qualité standard
        `https://i.ytimg.com/vi/${this.videoId}/hqdefault.jpg`,      // Haute qualité par défaut
        `https://i.ytimg.com/vi/${this.videoId}/mqdefault.jpg`,      // Qualité moyenne
        `https://i.ytimg.com/vi/${this.videoId}/default.jpg`,         // Qualité par défaut
        `https://img.youtube.com/vi/${this.videoId}/maxresdefault.jpg`, // Alternative haute qualité
        `https://img.youtube.com/vi/${this.videoId}/hqdefault.jpg`     // Alternative haute qualité par défaut
      ];
      
      // Essayer chaque qualité de miniature
      const tryNextQuality = (index = 0) => {
        if (index >= thumbnailQualities.length) {
          // Toutes les qualités ont échoué, utiliser l'arrière-plan par défaut
          return;
        }
        
        const testImage = new Image();
        testImage.onload = () => {
          // La miniature est chargée avec succès
          poster.src = thumbnailQualities[index];
          poster.style.opacity = '1'; // Afficher la miniature
        };
        testImage.onerror = () => {
          // Essayer la qualité suivante
          tryNextQuality(index + 1);
        };
        testImage.src = thumbnailQualities[index];
      };
      
      // Commencer à essayer les qualités
      tryNextQuality();
    };
    
    // Si une URL d'image poster est fournie, l'utiliser
    // Sinon, essayer de récupérer la miniature YouTube
    if (this.posterUrl) {
      poster.src = this.posterUrl;
      poster.style.opacity = '1';
    } else if (this.videoId) {
      tryMultipleSources();
    }
    
    poster.alt = 'Aperçu de la vidéo';
    container.appendChild(poster);
    
    // Ajouter le bouton de lecture
    const playButton = document.createElement('div');
    playButton.style.position = 'absolute';
    playButton.style.top = '50%';
    playButton.style.left = '50%';
    playButton.style.transform = 'translate(-50%, -50%)';
    playButton.style.width = '68px';
    playButton.style.height = '48px';
    playButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    playButton.style.borderRadius = '10px';
    playButton.style.display = 'flex';
    playButton.style.alignItems = 'center';
    playButton.style.justifyContent = 'center';
    playButton.style.transition = 'background-color 0.3s ease';
    playButton.style.zIndex = '2'; // S'assurer que le bouton est au-dessus de l'image
    playButton.innerHTML = '<div style="width: 0; height: 0; border-style: solid; border-width: 10px 0 10px 20px; border-color: transparent transparent transparent #fff;"></div>';
    container.appendChild(playButton);
    
    // Ajouter un effet de survol sur le bouton de lecture
    container.addEventListener('mouseover', () => {
      playButton.style.backgroundColor = '#ed1b24'; // Rouge SA06
    });
    
    container.addEventListener('mouseout', () => {
      playButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    });
    
    // Ajouter la durée si fournie
    if (this.durationText) {
      const duration = document.createElement('div');
      duration.style.position = 'absolute';
      duration.style.bottom = '10px';
      duration.style.right = '10px';
      duration.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      duration.style.color = '#fff';
      duration.style.padding = '2px 6px';
      duration.style.borderRadius = '4px';
      duration.style.fontSize = '12px';
      duration.style.zIndex = '2'; // S'assurer que la durée est au-dessus de l'image
      duration.textContent = this.durationText;
      container.appendChild(duration);
    }
    
    // Ajouter l'événement de clic
    container.addEventListener('click', () => {
      // Remplacer le contenu par l'iframe YouTube
      container.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = '0';
      iframe.src = `https://www.youtube.com/embed/${this.videoId}?autoplay=1&rel=0`;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('frameborder', '0');
      container.appendChild(iframe);
    });
  }
}

// Enregistrer l'élément personnalisé
if (!customElements.get('youtube-player')) {
  customElements.define('youtube-player', YouTubePlayer);
}

// Initialiser les lecteurs existants après le chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  const players = document.querySelectorAll('youtube-player');
});
