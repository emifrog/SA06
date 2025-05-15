// script.js
document.addEventListener('DOMContentLoaded', () => {
    const infoPanel = document.getElementById('department-details');
    let selectedDepartment = null; // Pour suivre le département actuellement sélectionné
    let departementData = {}; // Sera rempli par les données JSON
    
    // Charger les données des départements depuis le fichier JSON externe
    fetch('data/departements.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Stocker les données des départements
        departementData = data.departements;
        
        // Initialiser l'affichage une fois les données chargées
        initializeDepartments();
        
        // Ajouter les événements aux départements
        setupDepartmentEvents();
      })
      .catch(error => {
        console.error('Erreur lors du chargement des données:', error);
        infoPanel.innerHTML = `
          <p class="error">Erreur lors du chargement des données des départements.</p>
          <p>${error.message}</p>
        `;
      });
    
    // Fonction pour configurer les événements des départements
    function setupDepartmentEvents() {
      const departments = document.querySelectorAll('path[data-numerodepartement]');
      
      departments.forEach((dept) => {
        const deptId = dept.getAttribute('data-numerodepartement');
        
        if (departementData[deptId]) {
          const data = departementData[deptId];
          
          // Événements
          dept.addEventListener('mouseenter', (e) => {
            if (!dept.querySelector('.info-bubble')) {
              const infoBubble = document.createElement('div');
              infoBubble.classList.add('info-bubble');
              infoBubble.textContent = 'Cliquez pour voir les coordonnées';
              document.body.appendChild(infoBubble);

              const rect = dept.getBoundingClientRect();
              infoBubble.style.position = 'fixed';
              infoBubble.style.left = `${rect.left + rect.width / 2 - infoBubble.offsetWidth / 2}px`;
              infoBubble.style.top = `${rect.top - 35}px`;
              infoBubble.style.pointerEvents = 'none';
              dept._infoBubble = infoBubble;
            }
          });
          dept.addEventListener('mouseleave', () => {
            if (dept._infoBubble && dept._infoBubble.parentNode) {
              dept._infoBubble.parentNode.removeChild(dept._infoBubble);
              dept._infoBubble = null;
            }
          });
          
          
          dept.addEventListener('click', () => {
            // Ne réagir que si le département n'est pas masqué par le filtre
            if (dept.style.opacity !== '0.3') {
              console.log(`Département cliqué : ${data.nom} (${deptId})`);
              
              // Si on clique sur le département déjà sélectionné, le désélectionner
              if (deptId === selectedDepartment) {
                selectedDepartment = null;
                dept.style.fill = '#3262ac'; // Tous les départements avec données sont en bleu
              } else {
                // Sinon, afficher les détails et mettre en évidence
                displayDepartmentDetails(deptId, true);
              }
            }
          });
        }
      });
    }
  
  
  
    // Fonction pour initialiser l'affichage des départements
    function initializeDepartments() {
      const departments = document.querySelectorAll('path[data-numerodepartement]');
      
      departments.forEach((dept) => {
        const deptId = dept.getAttribute('data-numerodepartement');
        const data = departementData[deptId];
        
        if (data) {
          // Département visible avec données
          dept.style.opacity = '1';
          
          // Si c'est le département sélectionné, utiliser la couleur de sélection
          if (deptId === selectedDepartment) {
            dept.style.fill = '#ed1b24';
          } else {
            dept.style.fill = '#3262ac'; // Tous les départements avec données sont en bleu
          }
          
          dept.style.cursor = 'pointer';
        } else {
          // Département sans données
          dept.style.opacity = '1'; // Opacité à 1 comme demandé
          dept.style.fill = '#ecf0f1';
          dept.style.cursor = 'default';
        }
      });
    }
  
  
  
    // Fonction pour afficher les détails d'un département
    function displayDepartmentDetails(deptId, highlight = false) {
      const data = departementData[deptId];
      if (!data) return;
      
      // Mettre à jour le panneau d'information
      infoPanel.innerHTML = `
        <p><strong>Département :</strong> ${data.nom} (${deptId})</p>
        <p><strong>Président :</strong> ${data.president || 'Non renseigné'}</p>
        <p><strong>Telephone :</strong> ${data.telephone || 'Non renseigné'}</p>
        <p><strong>Email :</strong> ${data.email ? `<a href="mailto:${data.email}">${data.email}</a>` : 'Non renseigné'}</p>
      `;
      
      // Mettre à jour le titre du panneau d'information
      const infoTitle = document.querySelector('.map-info-title');
      if (infoTitle) {
        infoTitle.textContent = `${data.nom} (${deptId})`;
      }  
  
      
      // Si demandé, mettre en évidence ce département
      if (highlight) {
        const departments = document.querySelectorAll('path[data-numerodepartement]');
        departments.forEach(d => {
          if (d.getAttribute('data-numerodepartement') !== deptId && d.style.opacity !== '0.3') {
            const dId = d.getAttribute('data-numerodepartement');
            const dData = departementData[dId];
            if (dData) {
              d.style.fill = '#3262ac'; // Tous les départements avec données sont en bleu
            }
          }
        });
        
        const dept = document.querySelector(`path[data-numerodepartement="${deptId}"]`);
        if (dept) dept.style.fill = '#ed1b24'; // Couleur de sélection
        
        // Mettre à jour le département sélectionné
        selectedDepartment = deptId;
      }
    }
  
  
  
    // Optimisation du chargement SVG
    const svgElement = document.querySelector('.carte svg');
    if (svgElement) {
      // Précharger les chemins SVG pour une meilleure performance
      const paths = svgElement.querySelectorAll('path');
      paths.forEach(path => {
        // Forcer un reflow pour s'assurer que les chemins sont correctement rendus
        path.getBoundingClientRect();
      });
      
      // Ajouter une classe pour indiquer que le SVG est chargé
      svgElement.classList.add('svg-loaded');
    }
     
    // L'initialisation est maintenant gérée dans le callback de fetch
  });