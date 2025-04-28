// Carte des syndicats autonomes
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'élément de carte existe
    const mapContainer = document.getElementById('france-map-container');
    if (!mapContainer) {
        console.error('Conteneur de carte non trouvé');
        return;
    }
    console.log('Initialisation de la carte...');
    
    // Vider le conteneur de carte
    mapContainer.innerHTML = '';
    
    // Créer l'image de la carte
    const mapImage = document.createElement('img');
    mapImage.src = 'images/Départements_de_France.png';
    mapImage.alt = 'Carte des départements de France';
    mapImage.className = 'map-image';
    mapImage.setAttribute('usemap', '#france-map');
    
    // Créer l'image map
    const imageMap = document.createElement('map');
    imageMap.name = 'france-map';
    imageMap.id = 'france-map';
    
    // Ajouter l'image et l'image map au conteneur
    mapContainer.appendChild(mapImage);
    mapContainer.appendChild(imageMap);
    
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

    // Créer les coordonnées des départements et les zones cliquables
    createMapAreas();

    // Ajouter les interactions à la carte
    addMapInteractions();

    // Fonction pour créer les zones cliquables de la carte
    function createMapAreas() {
        console.log('Création des zones cliquables...');
        // Coordonnées des départements (format: x1,y1,x2,y2)
        const departmentCoords = {
            '01': '450,260,480,290', // Ain
            '02': '340,140,370,170', // Aisne
            '03': '380,300,410,330', // Allier
            '04': '450,400,480,430', // Alpes-de-Haute-Provence
            '05': '470,380,500,410', // Hautes-Alpes
            '06': '490,410,520,440', // Alpes-Maritimes
            '07': '420,370,450,400', // Ardèche
            '08': '370,130,400,160', // Ardennes
            '09': '320,430,350,460', // Ariège
            '10': '380,190,410,220', // Aube
            '11': '350,440,380,470', // Aude
            '12': '370,380,400,410', // Aveyron
            '13': '430,440,460,470', // Bouches-du-Rhône
            '14': '250,170,280,200', // Calvados
            '15': '380,350,410,380', // Cantal
            '16': '300,330,330,360', // Charente
            '17': '270,340,300,370', // Charente-Maritime
            '18': '350,250,380,280', // Cher
            '19': '350,340,380,370', // Corrèze
            '2A': '420,520,450,550', // Corse-du-Sud
            '2B': '440,500,470,530', // Haute-Corse
            '21': '410,220,440,250', // Côte-d'Or
            '22': '180,190,210,220', // Côtes-d'Armor
            '23': '360,320,390,350', // Creuse
            '24': '310,360,340,390', // Dordogne
            '25': '460,220,490,250', // Doubs
            '26': '440,370,470,400', // Drôme
            '27': '290,160,320,190', // Eure
            '28': '310,200,340,230', // Eure-et-Loir
            '29': '140,190,170,220', // Finistère
            '30': '410,420,440,450', // Gard
            '31': '330,420,360,450', // Haute-Garonne
            '32': '310,400,340,430', // Gers
            '33': '280,370,310,400', // Gironde
            '34': '390,430,420,460', // Hérault
            '35': '210,200,240,230', // Ille-et-Vilaine
            '36': '340,280,370,310', // Indre
            '37': '300,250,330,280', // Indre-et-Loire
            '38': '460,320,490,350', // Isère
            '39': '450,240,480,270', // Jura
            '40': '270,400,300,430', // Landes
            '41': '320,230,350,260', // Loir-et-Cher
            '42': '420,320,450,350', // Loire
            '43': '410,340,440,370', // Haute-Loire
            '44': '220,240,250,270', // Loire-Atlantique
            '45': '340,220,370,250', // Loiret
            '46': '350,370,380,400', // Lot
            '47': '300,390,330,420', // Lot-et-Garonne
            '48': '400,380,430,410', // Lozère
            '49': '260,240,290,270', // Maine-et-Loire
            '50': '230,160,260,190', // Manche
            '51': '380,160,410,190', // Marne
            '52': '410,190,440,220', // Haute-Marne
            '53': '250,210,280,240', // Mayenne
            '54': '430,160,460,190', // Meurthe-et-Moselle
            '55': '410,150,440,180', // Meuse
            '56': '180,220,210,250', // Morbihan
            '57': '450,140,480,170', // Moselle
            '58': '390,240,420,270', // Nièvre
            '59': '340,110,370,140', // Nord
            '60': '330,150,360,180', // Oise
            '61': '270,180,300,210', // Orne
            '62': '310,120,340,150', // Pas-de-Calais
            '63': '390,320,420,350', // Puy-de-Dôme
            '64': '270,420,300,450', // Pyrénées-Atlantiques
            '65': '300,430,330,460', // Hautes-Pyrénées
            '66': '370,460,400,490', // Pyrénées-Orientales
            '67': '470,160,500,190', // Bas-Rhin
            '68': '480,190,510,220', // Haut-Rhin
            '69': '430,300,460,330', // Rhône
            '70': '440,200,470,230', // Haute-Saône
            '71': '420,260,450,290', // Saône-et-Loire
            '72': '270,210,300,240', // Sarthe
            '73': '480,330,510,360', // Savoie
            '74': '480,290,510,320', // Haute-Savoie
            '75': '330,180,340,190', // Paris
            '76': '280,140,310,170', // Seine-Maritime
            '77': '350,190,380,220', // Seine-et-Marne
            '78': '320,190,350,220', // Yvelines
            '79': '270,290,300,320', // Deux-Sèvres
            '80': '310,140,340,170', // Somme
            '81': '350,400,380,430', // Tarn
            '82': '330,390,360,420', // Tarn-et-Garonne
            '83': '470,440,500,470', // Var
            '84': '440,410,470,440', // Vaucluse
            '85': '240,270,270,300', // Vendée
            '86': '290,290,320,320', // Vienne
            '87': '330,320,360,350', // Haute-Vienne
            '88': '450,180,480,210', // Vosges
            '89': '380,210,410,240', // Yonne
            '90': '470,210,490,230', // Territoire de Belfort
            '91': '330,200,350,220', // Essonne
            '92': '325,185,335,195', // Hauts-de-Seine
            '93': '335,180,345,190', // Seine-Saint-Denis
            '94': '335,190,345,200', // Val-de-Marne
            '95': '320,170,340,190', // Val-d'Oise
            '971': '100,500,130,530', // Guadeloupe (position approximative)
            '972': '130,500,160,530', // Martinique (position approximative)
            '973': '160,500,190,530', // Guyane (position approximative)
            '974': '190,500,220,530', // La Réunion (position approximative)
            '976': '220,500,250,530'  // Mayotte (position approximative)
        };
        
        // Créer les zones cliquables pour chaque département
        for (const [deptId, coords] of Object.entries(departmentCoords)) {
            // Vérifier si le département a un syndicat
            const syndicat = syndicats.find(s => s.dept === deptId);
            
            // Créer la zone cliquable
            const area = document.createElement('area');
            area.shape = 'rect';
            area.coords = coords;
            area.alt = `Département ${deptId}`;
            area.href = '#';
            
            // Ajouter les attributs de données si le département a un syndicat
            if (syndicat) {
                area.classList.add('has-syndicat');
                area.setAttribute('data-dept', deptId);
                area.setAttribute('data-nom', syndicat.nom);
                area.setAttribute('data-president', syndicat.president);
                area.setAttribute('data-tel', syndicat.tel);
                area.setAttribute('data-email', syndicat.email);
                
                // Ajouter les événements
                area.addEventListener('mouseover', showTooltip);
                area.addEventListener('mouseout', hideTooltip);
                area.addEventListener('click', function(e) {
                    e.preventDefault();
                    showDepartmentInfo(e);
                });
            }
            
            // Ajouter la zone cliquable à l'image map
            imageMap.appendChild(area);
        }
        
        // Créer une overlay pour visualiser les départements avec syndicats
        createOverlay(departmentCoords);
        
        console.log('Zones cliquables créées avec succès');
    }
    
    // Fonction pour créer une overlay pour visualiser les départements avec syndicats
    function createOverlay(coords) {
        console.log('Création de l\'overlay...');
        const overlay = document.createElement('div');
        overlay.className = 'map-overlay';
        mapContainer.appendChild(overlay);
        
        // Attendre que l'image soit chargée pour ajuster les coordonnées
        const mapImage = mapContainer.querySelector('.map-image');
        if (mapImage) {
            console.log('Image de la carte trouvée, attente du chargement...');
            
            // Fonction à exécuter lorsque l'image est chargée
            const setupOverlay = function() {
                console.log('Image chargée, dimensions:', mapImage.clientWidth, 'x', mapImage.clientHeight);
                const imageWidth = mapImage.clientWidth;
                const imageHeight = mapImage.clientHeight;
                const originalWidth = 600; // Largeur de référence pour les coordonnées
                const originalHeight = 600; // Hauteur de référence pour les coordonnées
                
                // Créer des div colorés pour chaque département avec un syndicat
                for (const [deptId, coordStr] of Object.entries(coords)) {
                    const syndicat = syndicats.find(s => s.dept === deptId);
                    if (syndicat) {
                        const [x1, y1, x2, y2] = coordStr.split(',').map(Number);
                        
                        // Ajuster les coordonnées en fonction de la taille réelle de l'image
                        const scaledX1 = (x1 / originalWidth) * imageWidth;
                        const scaledY1 = (y1 / originalHeight) * imageHeight;
                        const scaledX2 = (x2 / originalWidth) * imageWidth;
                        const scaledY2 = (y2 / originalHeight) * imageHeight;
                        
                        const highlightDiv = document.createElement('div');
                        highlightDiv.className = 'dept-highlight';
                        highlightDiv.style.left = `${scaledX1}px`;
                        highlightDiv.style.top = `${scaledY1}px`;
                        highlightDiv.style.width = `${scaledX2 - scaledX1}px`;
                        highlightDiv.style.height = `${scaledY2 - scaledY1}px`;
                        highlightDiv.setAttribute('data-dept', deptId);
                        highlightDiv.setAttribute('data-nom', syndicat.nom);
                        highlightDiv.setAttribute('data-president', syndicat.president);
                        highlightDiv.setAttribute('data-tel', syndicat.tel);
                        highlightDiv.setAttribute('data-email', syndicat.email);
                        
                        // Ajouter les événements
                        highlightDiv.addEventListener('mouseover', showTooltip);
                        highlightDiv.addEventListener('mouseout', hideTooltip);
                        highlightDiv.addEventListener('click', showDepartmentInfo);
                        
                        overlay.appendChild(highlightDiv);
                    }
                }
                
                console.log('Overlay créé avec succès');
            };
            
            // Vérifier si l'image est déjà chargée
            if (mapImage.complete) {
                console.log('Image déjà chargée');
                setupOverlay();
            } else {
                mapImage.onload = setupOverlay;
            }
        } else {
            console.error('Image de la carte non trouvée');
        }
    }

    // Fonction pour ajouter les interactions à la carte
    function addMapInteractions() {
        console.log('Ajout des interactions à la carte...');
        // Créer un élément pour les tooltips
        const tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        tooltip.style.display = 'none';
        mapContainer.appendChild(tooltip);
        
        // Référence à l'élément d'affichage des détails du département
        const deptInfo = document.getElementById('department-details');
        if (!deptInfo) {
            console.error('Élément department-details non trouvé');
        }
        
        // Fonction pour afficher le tooltip
        window.showTooltip = function(event) {
            const element = event.target;
            const deptId = element.getAttribute('data-dept');
            const deptNom = element.getAttribute('data-nom');
            
            if (deptId && deptNom) {
                tooltip.textContent = `${deptId} - ${deptNom}`;
                tooltip.style.display = 'block';
                
                // Positionner le tooltip près du curseur
                const rect = mapContainer.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                
                tooltip.style.left = `${x + 15}px`;
                tooltip.style.top = `${y + 15}px`;
            }
        };
        
        // Fonction pour masquer le tooltip
        window.hideTooltip = function() {
            tooltip.style.display = 'none';
        };
        
        console.log('Interactions ajoutées avec succès');
    }

    // Fonction pour afficher les informations du département
    window.showDepartmentInfo = function(event) {
        const element = event.target;
        const deptId = element.getAttribute('data-dept');
        const deptNom = element.getAttribute('data-nom');
        const president = element.getAttribute('data-president');
        const tel = element.getAttribute('data-tel');
        const email = element.getAttribute('data-email');
        
        if (deptId && deptNom) {
            // Mettre à jour le titre de la section d'information
            const infoTitle = document.querySelector('.map-info-title');
            if (infoTitle) {
                infoTitle.textContent = `${deptId} - ${deptNom}`;
            }
            
            // Mettre à jour les détails
            const deptInfo = document.getElementById('department-details');
            if (deptInfo) {
                // Ajouter une animation pour l'apparition des informations
                deptInfo.style.opacity = '0';
                deptInfo.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    deptInfo.innerHTML = `
                        <div class="info-item">
                            <div class="info-icon">👤</div>
                            <div class="info-content">
                                <p class="info-label">Président</p>
                                <p class="info-value">${president}</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="info-icon">📞</div>
                            <div class="info-content">
                                <p class="info-label">Téléphone</p>
                                <p class="info-value"><a href="tel:${tel}">${tel}</a></p>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="info-icon">✉️</div>
                            <div class="info-content">
                                <p class="info-label">Email</p>
                                <p class="info-value"><a href="mailto:${email}">${email}</a></p>
                            </div>
                        </div>
                    `;
                    
                    // Animer l'apparition des informations
                    deptInfo.style.opacity = '1';
                    deptInfo.style.transform = 'translateY(0)';
                }, 200);
            }
            
            // Faire défiler jusqu'aux informations si nécessaire
            const infoPanel = document.getElementById('department-info');
            if (infoPanel) {
                infoPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            
            // Mettre en évidence le département sélectionné
            const allHighlights = document.querySelectorAll('.dept-highlight');
            allHighlights.forEach(highlight => {
                highlight.classList.remove('selected');
            });
            element.classList.add('selected');
        }
    };
});
