// Carte des syndicats autonomes
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'élément de carte existe
    const mapContainer = document.getElementById('france-map-container');
    if (!mapContainer) return;

    // Données des syndicats par département
    const syndicats = [
        { dept: "01", nom: "Ain", president: "Jean Dupont", tel: "06 XX XX XX XX", email: "contact@sa01.fr" },
        { dept: "02", nom: "Aisne", president: "Marie Martin", tel: "06 XX XX XX XX", email: "contact@sa02.fr" },
        { dept: "03", nom: "Allier", president: "Pierre Durand", tel: "06 XX XX XX XX", email: "contact@sa03.fr" },
        { dept: "04", nom: "Alpes-de-Haute-Provence", president: "Sophie Petit", tel: "06 XX XX XX XX", email: "contact@sa04.fr" },
        { dept: "05", nom: "Hautes-Alpes", president: "Thomas Bernard", tel: "06 XX XX XX XX", email: "contact@sa05.fr" },
        { dept: "06", nom: "Alpes-Maritimes", president: "Julie Leroy", tel: "06 XX XX XX XX", email: "contact@sa06.fr" },
        { dept: "07", nom: "Ardèche", president: "Nicolas Moreau", tel: "06 XX XX XX XX", email: "contact@sa07.fr" },
        { dept: "08", nom: "Ardennes", president: "Isabelle Fournier", tel: "06 XX XX XX XX", email: "contact@sa08.fr" },
        { dept: "09", nom: "Ariège", president: "Laurent Girard", tel: "06 XX XX XX XX", email: "contact@sa09.fr" },
        { dept: "10", nom: "Aube", president: "Céline Dubois", tel: "06 XX XX XX XX", email: "contact@sa10.fr" },
        { dept: "11", nom: "Aude", president: "Frédéric Michel", tel: "06 XX XX XX XX", email: "contact@sa11.fr" },
        { dept: "12", nom: "Aveyron", president: "Nathalie Robert", tel: "06 XX XX XX XX", email: "contact@sa12.fr" },
        { dept: "13", nom: "Bouches-du-Rhône", president: "David Simon", tel: "06 XX XX XX XX", email: "contact@sa13.fr" },
        { dept: "14", nom: "Calvados", president: "Caroline Laurent", tel: "06 XX XX XX XX", email: "contact@sa14.fr" },
        { dept: "15", nom: "Cantal", president: "Philippe Blanc", tel: "06 XX XX XX XX", email: "contact@sa15.fr" },
        { dept: "16", nom: "Charente", president: "Stéphanie Rousseau", tel: "06 XX XX XX XX", email: "contact@sa16.fr" },
        { dept: "17", nom: "Charente-Maritime", president: "Éric Gauthier", tel: "06 XX XX XX XX", email: "contact@sa17.fr" },
        { dept: "18", nom: "Cher", president: "Valérie Morel", tel: "06 XX XX XX XX", email: "contact@sa18.fr" },
        { dept: "19", nom: "Corrèze", president: "Christophe Perrin", tel: "06 XX XX XX XX", email: "contact@sa19.fr" },
        { dept: "2A", nom: "Corse-du-Sud", president: "Anne Lefevre", tel: "06 XX XX XX XX", email: "contact@sa2a.fr" },
        { dept: "2B", nom: "Haute-Corse", president: "Julien Roux", tel: "06 XX XX XX XX", email: "contact@sa2b.fr" },
        { dept: "21", nom: "Côte-d'Or", president: "Sandrine Mercier", tel: "06 XX XX XX XX", email: "contact@sa21.fr" },
        { dept: "22", nom: "Côtes-d'Armor", president: "Thierry Dupuis", tel: "06 XX XX XX XX", email: "contact@sa22.fr" },
        { dept: "23", nom: "Creuse", president: "Aurélie Fontaine", tel: "06 XX XX XX XX", email: "contact@sa23.fr" },
        { dept: "24", nom: "Dordogne", president: "Sébastien Brunet", tel: "06 XX XX XX XX", email: "contact@sa24.fr" },
        { dept: "25", nom: "Doubs", president: "Émilie Chevalier", tel: "06 XX XX XX XX", email: "contact@sa25.fr" },
        { dept: "26", nom: "Drôme", president: "Olivier Legrand", tel: "06 XX XX XX XX", email: "contact@sa26.fr" },
        { dept: "27", nom: "Eure", president: "Sylvie Garnier", tel: "06 XX XX XX XX", email: "contact@sa27.fr" },
        { dept: "28", nom: "Eure-et-Loir", president: "Jérôme Faure", tel: "06 XX XX XX XX", email: "contact@sa28.fr" },
        { dept: "29", nom: "Finistère", president: "Laure Bertrand", tel: "06 XX XX XX XX", email: "contact@sa29.fr" },
        { dept: "30", nom: "Gard", president: "Sébastien Perrier", tel: "06 46 43 37 02", email: "contact@sa30.fr" },
        { dept: "31", nom: "Haute-Garonne", president: "Mathieu Dumont", tel: "06 XX XX XX XX", email: "contact@sa31.fr" },
        { dept: "32", nom: "Gers", president: "Yannick Martuning", tel: "06 29 57 35 45", email: "syndicat.autonome.32@gmail.com" },
        { dept: "33", nom: "Gironde", president: "Sébastien Dephot", tel: "06 59 33 43 27", email: "contact@sa33.fr" },
        { dept: "34", nom: "Hérault", president: "Gautier Neolas", tel: "06 85 25 13 21", email: "contact@sa34.fr" },
        { dept: "35", nom: "Ille-et-Vilaine", president: "Mickael Troufflard", tel: "06 80 25 50 89", email: "contact@sa35.fr" },
        { dept: "36", nom: "Indre", president: "Hélène Guerin", tel: "06 XX XX XX XX", email: "contact@sa36.fr" },
        { dept: "37", nom: "Indre-et-Loire", president: "Cyril Dubois", tel: "06 37 14 84 59", email: "sasdis37@gmail.com" },
        { dept: "38", nom: "Isère", president: "Frédéric Bologna", tel: "06 73 57 96 16", email: "contact@sa38.fr" },
        { dept: "39", nom: "Jura", president: "Virginie Lemaire", tel: "06 XX XX XX XX", email: "contact@sa39.fr" },
        { dept: "40", nom: "Landes", president: "Nicolas Chevalier", tel: "06 32 61 62 04", email: "nico.chevalier40@gmail.com" },
        { dept: "41", nom: "Loir-et-Cher", president: "Fabien Durand", tel: "06 19 74 11 48", email: "contact@sa41.fr" },
        { dept: "42", nom: "Loire", president: "Alexandre Marchand", tel: "06 XX XX XX XX", email: "contact@sa42.fr" },
        { dept: "43", nom: "Haute-Loire", president: "Béatrice Leroux", tel: "06 XX XX XX XX", email: "contact@sa43.fr" },
        { dept: "44", nom: "Loire-Atlantique", president: "Franck Bonnet", tel: "06 XX XX XX XX", email: "contact@sa44.fr" },
        { dept: "45", nom: "Loiret", president: "Jérôme San-Filippo", tel: "06 81 57 24 59", email: "contact@sa45.fr" },
        { dept: "46", nom: "Lot", president: "Sébastien Bonis", tel: "06 63 57 99 82", email: "contact@sa46.fr" },
        { dept: "47", nom: "Lot-et-Garonne", president: "Christophe Vidal", tel: "06 31 76 24 73", email: "christophe.vidal17@gmail.com" },
        { dept: "48", nom: "Lozère", president: "Delphine Brun", tel: "06 XX XX XX XX", email: "contact@sa48.fr" },
        { dept: "49", nom: "Maine-et-Loire", president: "Bernard Hamelin", tel: "06 32 26 01 49", email: "contact@sa49.fr" },
        { dept: "50", nom: "Manche", president: "Romain Collet", tel: "06 XX XX XX XX", email: "contact@sa50.fr" },
        { dept: "51", nom: "Marne", president: "Frédéric Fougere", tel: "07 70 48 13 17", email: "contact@sa51.fr" },
        { dept: "52", nom: "Haute-Marne", president: "Loïc Louvet", tel: "06 62 23 41 81", email: "fa.sdis52.louvetloic@gmail.com" },
        { dept: "53", nom: "Mayenne", president: "Camille Renaud", tel: "06 XX XX XX XX", email: "contact@sa53.fr" },
        { dept: "54", nom: "Meurthe-et-Moselle", president: "Patrick Jacquot", tel: "06 73 73 05 54", email: "jacquotpatrick54@gmail.com" },
        { dept: "55", nom: "Meuse", president: "Adrien Masson", tel: "06 XX XX XX XX", email: "contact@sa55.fr" },
        { dept: "56", nom: "Morbihan", president: "Gilles Texier", tel: "06 XX XX XX XX", email: "contact@sa56.fr" },
        { dept: "57", nom: "Moselle", president: "David Krettnich", tel: "06 08 43 99 01", email: "dave.k@9online.fr" },
        { dept: "58", nom: "Nièvre", president: "Lucie Barbier", tel: "06 XX XX XX XX", email: "contact@sa58.fr" },
        { dept: "59", nom: "Nord", president: "Sébastien Lucas", tel: "06 71 35 51 58", email: "contact@sa59.fr" },
        { dept: "60", nom: "Oise", president: "Yannick Gosnet", tel: "06 15 73 63 11", email: "contact@sa60.fr" },
        { dept: "61", nom: "Orne", president: "Nicolas Vigneron", tel: "06 13 07 10 45", email: "nicolas.vigneron.spp@hotmail.com" },
        { dept: "62", nom: "Pas-de-Calais", president: "Gabriel Delhomez", tel: "06 07 28 87 30", email: "contact@sa62.fr" },
        { dept: "63", nom: "Puy-de-Dôme", president: "Stéphane Nael", tel: "06 61 75 57 30", email: "contact@sa63.fr" },
        { dept: "64", nom: "Pyrénées-Atlantiques", president: "Julien Sorgon", tel: "06 21 29 29 61", email: "contact@sa64.fr" },
        { dept: "65", nom: "Hautes-Pyrénées", president: "Stéphane Millet", tel: "06 43 28 91 12", email: "contact@sa65.fr" },
        { dept: "66", nom: "Pyrénées-Orientales", president: "Antoine Rey", tel: "06 XX XX XX XX", email: "contact@sa66.fr" },
        { dept: "67", nom: "Bas-Rhin", president: "Gilles Klotz", tel: "06 85 78 05 13", email: "president.sa67@gmail.com" },
        { dept: "68", nom: "Haut-Rhin", president: "Maxime Weber", tel: "06 XX XX XX XX", email: "contact@sa68.fr" },
        { dept: "69", nom: "Rhône", president: "Steeve Martinez", tel: "06 23 87 05 50", email: "contact@sa69.fr" },
        { dept: "70", nom: "Haute-Saône", president: "Cédric Mougin", tel: "06 XX XX XX XX", email: "contact@sa70.fr" },
        { dept: "71", nom: "Saône-et-Loire", president: "Romuald Proriol", tel: "06 60 45 21 17", email: "contact@sa71.fr" },
        { dept: "72", nom: "Sarthe", president: "Florent Pichon", tel: "06 XX XX XX XX", email: "contact@sa72.fr" },
        { dept: "73", nom: "Savoie", president: "Loïc Haon", tel: "06 60 78 40 65", email: "contact@sa73.fr" },
        { dept: "74", nom: "Haute-Savoie", president: "Guillaume Leclerc", tel: "06 XX XX XX XX", email: "contact@sa74.fr" },
        { dept: "75", nom: "Paris", president: "Mathilde Lecomte", tel: "06 XX XX XX XX", email: "contact@sa75.fr" },
        { dept: "76", nom: "Seine-Maritime", president: "Vincent Roussel", tel: "06 XX XX XX XX", email: "contact@sa76.fr" },
        { dept: "77", nom: "Seine-et-Marne", president: "Audrey Meunier", tel: "06 XX XX XX XX", email: "contact@sa77.fr" },
        { dept: "78", nom: "Yvelines", president: "Grégory Lambert", tel: "06 XX XX XX XX", email: "contact@sa78.fr" },
        { dept: "79", nom: "Deux-Sèvres", president: "Pauline Gaillard", tel: "06 XX XX XX XX", email: "contact@sa79.fr" },
        { dept: "80", nom: "Somme", president: "Damien Boucher", tel: "06 XX XX XX XX", email: "contact@sa80.fr" },
        { dept: "81", nom: "Tarn", president: "Corinne Leroy", tel: "06 XX XX XX XX", email: "contact@sa81.fr" },
        { dept: "82", nom: "Tarn-et-Garonne", president: "Benoît Duval", tel: "06 XX XX XX XX", email: "contact@sa82.fr" },
        { dept: "83", nom: "Var", president: "Yann Moreau", tel: "06 XX XX XX XX", email: "contact@sa83.fr" },
        { dept: "84", nom: "Vaucluse", president: "Estelle Berger", tel: "06 XX XX XX XX", email: "contact@sa84.fr" },
        { dept: "85", nom: "Vendée", president: "Rémi Dumas", tel: "06 XX XX XX XX", email: "contact@sa85.fr" },
        { dept: "86", nom: "Vienne", president: "Cécile Giraud", tel: "06 XX XX XX XX", email: "contact@sa86.fr" },
        { dept: "87", nom: "Haute-Vienne", president: "Pascal Ferrand", tel: "06 XX XX XX XX", email: "contact@sa87.fr" },
        { dept: "88", nom: "Vosges", president: "Sylvain Roussel", tel: "06 XX XX XX XX", email: "contact@sa88.fr" },
        { dept: "89", nom: "Yonne", president: "Karine Boulanger", tel: "06 XX XX XX XX", email: "contact@sa89.fr" },
        { dept: "90", nom: "Territoire de Belfort", president: "Didier Meunier", tel: "06 XX XX XX XX", email: "contact@sa90.fr" },
        { dept: "91", nom: "Essonne", president: "Stéphane Guerin", tel: "06 XX XX XX XX", email: "contact@sa91.fr" },
        { dept: "92", nom: "Hauts-de-Seine", president: "Nathalie Dupont", tel: "06 XX XX XX XX", email: "contact@sa92.fr" },
        { dept: "93", nom: "Seine-Saint-Denis", president: "François Martin", tel: "06 XX XX XX XX", email: "contact@sa93.fr" },
        { dept: "94", nom: "Val-de-Marne", president: "Christelle Dubois", tel: "06 XX XX XX XX", email: "contact@sa94.fr" },
        { dept: "95", nom: "Val-d'Oise", president: "Julien Petit", tel: "06 XX XX XX XX", email: "contact@sa95.fr" },
        { dept: "971", nom: "Guadeloupe", president: "Marc Lefevre", tel: "06 XX XX XX XX", email: "contact@sa971.fr" },
        { dept: "972", nom: "Martinique", president: "Sophie Roux", tel: "06 XX XX XX XX", email: "contact@sa972.fr" },
        { dept: "973", nom: "Guyane", president: "Thomas Girard", tel: "06 XX XX XX XX", email: "contact@sa973.fr" },
        { dept: "974", nom: "La Réunion", president: "Élodie Moreau", tel: "06 XX XX XX XX", email: "contact@sa974.fr" },
        { dept: "976", nom: "Mayotte", president: "Laurent Dubois", tel: "06 XX XX XX XX", email: "contact@sa976.fr" }
    ];

    // Créer la carte SVG de la France
    createMap();

    // Ajouter les interactions
    addMapInteractions();

    // Fonction pour créer la carte SVG
    function createMap() {
        // Charger la carte SVG
        fetch('images/france-map.svg')
            .then(response => response.text())
            .then(svgData => {
                // Insérer la carte SVG dans le conteneur
                mapContainer.innerHTML = svgData;
                
                // Ajouter les interactions après le chargement de la carte
                const svgElement = mapContainer.querySelector('svg');
                if (svgElement) {
                    // Ajuster la taille du SVG
                    svgElement.setAttribute('width', '100%');
                    svgElement.setAttribute('height', 'auto');
                    svgElement.setAttribute('viewBox', '0 0 600 600');
                    
                    // Ajouter les interactions aux départements
                    const paths = svgElement.querySelectorAll('path');
                    paths.forEach(path => {
                        const deptId = path.getAttribute('id');
                        if (deptId) {
                            // Vérifier si le département a un syndicat
                            const syndicat = syndicats.find(s => s.dept === deptId);
                            
                            if (syndicat) {
                                // Département avec syndicat
                                path.setAttribute('fill', '#e74c3c'); // Rouge pour les départements avec syndicat
                                path.setAttribute('data-dept', deptId);
                                path.setAttribute('data-nom', syndicat.nom);
                                path.setAttribute('data-president', syndicat.president);
                                path.setAttribute('data-tel', syndicat.tel);
                                path.setAttribute('data-email', syndicat.email);
                                
                                // Ajouter les événements
                                path.addEventListener('mouseover', showTooltip);
                                path.addEventListener('mouseout', hideTooltip);
                                path.addEventListener('click', showDepartmentInfo);
                            } else {
                                // Département sans syndicat
                                path.setAttribute('fill', '#ecf0f1'); // Gris clair pour les départements sans syndicat
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Erreur lors du chargement de la carte:', error);
                mapContainer.innerHTML = '<p>Erreur lors du chargement de la carte. Veuillez réessayer.</p>';
            });
    }

    // Fonction pour ajouter les interactions à la carte
    function addMapInteractions() {
        // Créer l'élément de tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        tooltip.style.display = 'none';
        document.body.appendChild(tooltip);

        // Récupérer l'élément d'information du département
        const deptInfo = document.getElementById('department-details');

        // Fonction pour afficher le tooltip
        window.showTooltip = function(event) {
            const path = event.target;
            const deptId = path.getAttribute('data-dept');
            const deptNom = path.getAttribute('data-nom');
            
            if (deptId && deptNom) {
                tooltip.textContent = `${deptId} - ${deptNom}`;
                tooltip.style.display = 'block';
                tooltip.style.left = (event.pageX + 10) + 'px';
                tooltip.style.top = (event.pageY + 10) + 'px';
                
                // Changer la couleur au survol
                path.setAttribute('fill', '#c0392b'); // Rouge plus foncé au survol
            }
        }

        // Fonction pour masquer le tooltip
        window.hideTooltip = function(event) {
            tooltip.style.display = 'none';
            
            // Remettre la couleur d'origine
            const path = event.target;
            path.setAttribute('fill', '#e74c3c');
        }

        // Fonction pour afficher les informations du département
        window.showDepartmentInfo = function(event) {
            const path = event.target;
            const deptId = path.getAttribute('data-dept');
            const deptNom = path.getAttribute('data-nom');
            const president = path.getAttribute('data-president');
            const tel = path.getAttribute('data-tel');
            const email = path.getAttribute('data-email');
            
            if (deptId && deptNom) {
                // Mettre à jour le titre de la section d'information
                const infoTitle = document.querySelector('.map-info-title');
                if (infoTitle) {
                    infoTitle.textContent = `${deptId} - ${deptNom}`;
                }
                
                // Mettre à jour les détails
                if (deptInfo) {
                    deptInfo.innerHTML = `
                        <p><strong>Président :</strong> ${president}</p>
                        <p><strong>Téléphone :</strong> <a href="tel:${tel}">${tel}</a></p>
                        <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
                    `;
                }
                
                // Faire défiler jusqu'aux informations si nécessaire
                const infoPanel = document.getElementById('department-info');
                if (infoPanel) {
                    infoPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        }
    }
});
