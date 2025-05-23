        // Ajout d'un style personnalisé pour l'icône tarteaucitron
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                var tarteaucitronIcon = document.getElementById('tarteaucitronIcon');
                if (tarteaucitronIcon) {
                    tarteaucitronIcon.style.zIndex = '9999';
                    tarteaucitronIcon.style.bottom = '20px';
                    tarteaucitronIcon.style.right = '20px';
                    tarteaucitronIcon.style.position = 'fixed';
                    tarteaucitronIcon.style.display = 'block';
                    
                    var button = tarteaucitronIcon.querySelector('button');
                    if (button) {
                        button.style.background = 'transparent';
                        button.style.border = 'none';
                        button.style.padding = '0';
                        button.style.cursor = 'pointer';
                    }
                    
                    var img = tarteaucitronIcon.querySelector('img');
                    if (!img) {
                        img = document.createElement('img');
                        img.src = 'images/tarteaucitron.png';
                        img.style.width = '50px';
                        img.style.height = 'auto';
                        img.alt = 'Paramètres des cookies';
                        if (button) {
                            button.innerHTML = '';
                            button.appendChild(img);
                        }
                    }
                } else {
                    // Créer l'icône manuellement si elle n'existe pas
                    var icon = document.createElement('div');
                    icon.id = 'tarteaucitronIcon';
                    icon.style.zIndex = '9999';
                    icon.style.bottom = '20px';
                    icon.style.right = '20px';
                    icon.style.position = 'fixed';
                    icon.style.display = 'block';
                    
                    var button = document.createElement('button');
                    button.style.background = 'transparent';
                    button.style.border = 'none';
                    button.style.padding = '0';
                    button.style.cursor = 'pointer';
                    button.onclick = function() {
                        tarteaucitron.userInterface.openPanel();
                    };
                    
                    var img = document.createElement('img');
                    img.src = 'images/tarteaucitron.png';
                    img.src = '../images/tarteaucitron.png';
                    img.src = '../../images/tarteaucitron.png';
                    img.style.width = '50px';
                    img.style.height = 'auto';
                    img.alt = 'Paramètres des cookies';
                    
                    button.appendChild(img);
                    icon.appendChild(button);
                    document.body.appendChild(icon);
                }
            }, 1000); // Délai pour s'assurer que tarteaucitron a fini de charger
        });
        
        tarteaucitron.init({
            "privacyUrl": "",
            "bodyPosition": "bottom",
            "hashtag": "#tarteaucitron",
            "cookieName": "tarteaucitron",
            "orientation": "bottom",
            "groupServices": false,
            "showDetailsOnClick": true,
            "serviceDefaultState": "wait",
            "showAlertSmall": true,
            "cookieslist": false,
            "closePopup": false,
            "showIcon": true,
            "iconPosition": "BottomRight",
            "adblocker": false,
            "DenyAllCta": true,
            "AcceptAllCta": true,
            "highPrivacy": true,
            "alwaysNeedConsent": false,
            "handleBrowserDNTRequest": false,
            "removeCredit": false,
            "moreInfoLink": true,
            "useExternalCss": false,
            "useExternalJs": false,
            "readmoreLink": "",
            "mandatory": true,
            "mandatoryCta": true,
            "googleConsentMode": true,
            "partnersList": false,
            "iconSrc": "images/tarteaucitron.png"
        });
        
        // Ajout des services
        (tarteaucitron.job = tarteaucitron.job || []).push('youtube');
        (tarteaucitron.job = tarteaucitron.job || []).push('googlemaps');
        (tarteaucitron.job = tarteaucitron.job || []).push('linkedin');
        (tarteaucitron.job = tarteaucitron.job || []).push('facebook');
        (tarteaucitron.job = tarteaucitron.job || []).push('twitter');
        (tarteaucitron.job = tarteaucitron.job || []).push('instagram');
        
        // Aucun script personnalisé nécessaire, tarteaucitron utilise l'image fournie