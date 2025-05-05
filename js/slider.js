document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner les éléments du slider
    const sliderTrack = document.querySelector('.slider-track');
    const sliderItems = document.querySelectorAll('.slider-item');
    const prevButton = document.querySelector('.slider-arrow--prev');
    const nextButton = document.querySelector('.slider-arrow--next');
    const progressBar = document.querySelector('.slider-progress');
    
    // Si les éléments n'existent pas, ne pas exécuter le script
    if (!sliderTrack || !sliderItems.length || !prevButton || !nextButton || !progressBar) {
        return;
    }
    
    let currentIndex = 0;
    const itemCount = sliderItems.length;
    
    // Initialiser la barre de progression
    updateProgressBar();
    
    // Fonction pour mettre à jour la barre de progression
    function updateProgressBar() {
        // Calculer la largeur de la barre de progression en pourcentage
        const progressWidth = ((currentIndex + 1) / itemCount) * 100;
        progressBar.style.width = `${progressWidth}%`;
    }
    
    // Fonction pour aller à un élément spécifique
    function goToItem(index) {
        // S'assurer que l'index est dans les limites
        if (index < 0) {
            index = 0;
        } else if (index >= itemCount) {
            index = itemCount - 1;
        }
        
        currentIndex = index;
        
        // Calculer la position de défilement
        const itemWidth = sliderItems[0].offsetWidth;
        const scrollPosition = currentIndex * itemWidth;
        
        // Faire défiler le slider
        sliderTrack.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        // Mettre à jour la barre de progression
        updateProgressBar();
    }
    
    // Gestionnaires d'événements pour les boutons
    prevButton.addEventListener('click', function() {
        goToItem(currentIndex - 1);
    });
    
    nextButton.addEventListener('click', function() {
        goToItem(currentIndex + 1);
    });
    
    // Gérer le défilement manuel
    sliderTrack.addEventListener('scroll', function() {
        // Calculer l'index actuel en fonction de la position de défilement
        const itemWidth = sliderItems[0].offsetWidth;
        const scrollPosition = sliderTrack.scrollLeft;
        const newIndex = Math.round(scrollPosition / itemWidth);
        
        if (newIndex !== currentIndex) {
            currentIndex = newIndex;
            updateProgressBar();
        }
    });
    
    // Initialiser le slider
    goToItem(0);
});
