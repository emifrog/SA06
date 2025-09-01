(() => {
    var e, s, o, r, t, n, a = {
            285: (e, s, o) => {
                "use strict";
                new(o(563).default)([{
                    file: "layout/header",
                    resolve: ".header"
                }, {
                    file: "layout/footer",
                    resolve: ".footer"
                }, {
                    file: "pages/main"
                }, {
                    file: "pages/listing",
                    resolve: ".listing-container"
                }, {
                    file: "pages/documents",
                    resolve: ".documents-container"
                }, {
                    file: "pages/trainings",
                    resolve: ".trainings-container"
                }, {
                    file: "pages/results",
                    resolve: ".results-container"
                }, {
                    file: "pages/dispatcher",
                    resolve: ".dispatcher"
                }, {
                    file: "pages/page",
                    resolve: ".page-anchors"
                }, {
                    file: "pages/history",
                    resolve: ".history-anchors"
                }, {
                    file: "pages/join",
                    resolve: "#estimator"
                }, {
                    file: "blocks/rights",
                    resolve: ".rights"
                }, {
                    file: "blocks/reasons",
                    resolve: ".reasons-image"
                }, {
                    file: "blocks/form",
                    resolve: ".form"
                }, {
                    file: "blocks/map",
                    resolve: ".map"
                }, {
                    file: "blocks/finder",
                    resolve: ".finder"
                }]).load()
            },
            563: (e, s, o) => {
                "use strict";
                o.d(s, {
                    default: () => r
                });
                class r {
                    constructor(e) {
                        this.routes = e
                    }
                    load() {
                        this.routes.forEach((e => {
                            e.hasOwnProperty("resolve") ? document.querySelector(e.resolve) && this.run(e.file) : this.run(e.file)
                        }))
                    }
                    async run(e) {
                        const {
                            default: s
                        } = await o(65)(`./${e}`);
                        s()
                    }
                }
            },
            65: (e, s, o) => {
                var r = {
                    "./app": [285],
                    "./app.js": [285],
                    "./blocks/finder": [537, 537],
                    "./blocks/finder.js": [537, 537],
                    "./blocks/form": [275, 275],
                    "./blocks/form.js": [275, 275],
                    "./blocks/map": [859, 859],
                    "./blocks/map.js": [859, 859],
                    "./blocks/reasons": [668, 668],
                    "./blocks/reasons.js": [668, 668],
                    "./blocks/rights": [858, 858],
                    "./blocks/rights.js": [858, 858],
                    "./components/anchors": [317, 317],
                    "./components/anchors.js": [317, 317],
                    "./components/autocomplete": [215, 215],
                    "./components/autocomplete.js": [215, 215],
                    "./components/collapsibles": [614, 614],
                    "./components/collapsibles.js": [614, 614],
                    "./components/filters": [244, 244],
                    "./components/filters.js": [244, 244],
                    "./components/forms": [696, 315],
                    "./components/forms.js": [696, 315],
                    "./components/maps": [408, 408],
                    "./components/maps.js": [408, 408],
                    "./components/menu": [816, 816],
                    "./components/menu.js": [816, 816],
                    "./components/modals": [301, 301],
                    "./components/modals.js": [301, 301],
                    "./components/overlays": [294, 294],
                    "./components/overlays.js": [294, 294],
                    "./components/sliders": [889, 889],
                    "./components/sliders.js": [889, 889],
                    "./components/submenus": [873, 873],
                    "./components/submenus.js": [873, 873],
                    "./components/tabs": [343, 343],
                    "./components/tabs.js": [343, 343],
                    "./layout/footer": [650, 650],
                    "./layout/footer.js": [650, 650],
                    "./layout/header": [404, 404],
                    "./layout/header.js": [404, 404],
                    "./pages/dispatcher": [863, 863],
                    "./pages/dispatcher.js": [863, 863],
                    "./pages/documents": [655, 655],
                    "./pages/documents.js": [655, 655],
                    "./pages/history": [705, 705],
                    "./pages/history.js": [705, 705],
                    "./pages/join": [485, 485],
                    "./pages/join.js": [485, 485],
                    "./pages/listing": [897, 897],
                    "./pages/listing.js": [897, 897],
                    "./pages/main": [644, 644],
                    "./pages/main.js": [644, 644],
                    "./pages/page": [934, 934],
                    "./pages/page.js": [934, 934],
                    "./pages/results": [267, 267],
                    "./pages/results.js": [267, 267],
                    "./pages/trainings": [94, 94],
                    "./pages/trainings.js": [94, 94],
                    "./utils/a11y": [954, 954],
                    "./utils/a11y.js": [954, 954],
                    "./utils/ajax": [315, 696],
                    "./utils/ajax.js": [315, 696],
                    "./utils/global": [449, 449],
                    "./utils/global.js": [449, 449],
                    "./utils/listing": [516, 516],
                    "./utils/listing.js": [516, 516],
                    "./utils/router": [563],
                    "./utils/router.js": [563],
                    "./utils/scroll": [387, 387],
                    "./utils/scroll.js": [387, 387]
                };

                function t(e) {
                    if (!o.o(r, e)) return Promise.resolve().then((() => {
                        var s = new Error("Cannot find module '" + e + "'");
                        throw s.code = "MODULE_NOT_FOUND", s
                    }));
                    var s = r[e],
                        t = s[0];
                    return Promise.all(s.slice(1).map(o.e)).then((() => o(t)))
                }
                t.keys = () => Object.keys(r), t.id = 65, e.exports = t
            },
            110: () => {}
        },
        i = {};

    function l(e) {
        var s = i[e];
        if (void 0 !== s) return s.exports;
        var o = i[e] = {
            exports: {}
        };
        return a[e](o, o.exports, l), o.exports
    }
    l.m = a, e = "function" == typeof Symbol ? Symbol("webpack queues") : "__webpack_queues__", s = "function" == typeof Symbol ? Symbol("webpack exports") : "__webpack_exports__", o = "function" == typeof Symbol ? Symbol("webpack error") : "__webpack_error__", r = e => {
        e && e.d < 1 && (e.d = 1, e.forEach((e => e.r--)), e.forEach((e => e.r-- ? e.r++ : e())))
    }, l.a = (t, n, a) => {
        var i;
        a && ((i = []).d = -1);
        var l, c, p, u = new Set,
            m = t.exports,
            f = new Promise(((e, s) => {
                p = s, c = e
            }));
        f[s] = m, f[e] = e => (i && e(i), u.forEach(e), f.catch((e => {}))), t.exports = f, n((t => {
            var n;
            l = (t => t.map((t => {
                if (null !== t && "object" == typeof t) {
                    if (t[e]) return t;
                    if (t.then) {
                        var n = [];
                        n.d = 0, t.then((e => {
                            a[s] = e, r(n)
                        }), (e => {
                            a[o] = e, r(n)
                        }));
                        var a = {};
                        return a[e] = e => e(n), a
                    }
                }
                var i = {};
                return i[e] = e => {}, i[s] = t, i
            })))(t);
            var a = () => l.map((e => {
                    if (e[o]) throw e[o];
                    return e[s]
                })),
                c = new Promise((s => {
                    (n = () => s(a)).r = 0;
                    var o = e => e !== i && !u.has(e) && (u.add(e), e && !e.d && (n.r++, e.push(n)));
                    l.map((s => s[e](o)))
                }));
            return n.r ? c : a()
        }), (e => (e ? p(f[o] = e) : c(m), r(i)))), i && i.d < 0 && (i.d = 0)
    }, l.n = e => {
        var s = e && e.__esModule ? () => e.default : () => e;
        return l.d(s, {
            a: s
        }), s
    }, l.d = (e, s) => {
        for (var o in s) l.o(s, o) && !l.o(e, o) && Object.defineProperty(e, o, {
            enumerable: !0,
            get: s[o]
        })
    }, l.f = {}, l.e = e => Promise.all(Object.keys(l.f).reduce(((s, o) => (l.f[o](e, s), s)), [])), l.u = e => "js/" + e + "." + l.h() + ".js", l.miniCssF = e => {}, l.h = () => "234313edac7407147124", l.g = function () {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")()
        } catch (e) {
            if ("object" == typeof window) return window
        }
    }(), l.o = (e, s) => Object.prototype.hasOwnProperty.call(e, s), t = {}, n = "solfege:", l.l = (e, s, o, r) => {
        if (t[e]) t[e].push(s);
        else {
            var a, i;
            if (void 0 !== o)
                for (var c = document.getElementsByTagName("script"), p = 0; p < c.length; p++) {
                    var u = c[p];
                    if (u.getAttribute("src") == e || u.getAttribute("data-webpack") == n + o) {
                        a = u;
                        break
                    }
                }
            a || (i = !0, (a = document.createElement("script")).charset = "utf-8", a.timeout = 120, l.nc && a.setAttribute("nonce", l.nc), a.setAttribute("data-webpack", n + o), a.src = e), t[e] = [s];
            var m = (s, o) => {
                    a.onerror = a.onload = null, clearTimeout(f);
                    var r = t[e];
                    if (delete t[e], a.parentNode && a.parentNode.removeChild(a), r && r.forEach((e => e(o))), s) return s(o)
                },
                f = setTimeout(m.bind(null, void 0, {
                    type: "timeout",
                    target: a
                }), 12e4);
            a.onerror = m.bind(null, a.onerror), a.onload = m.bind(null, a.onload), i && document.head.appendChild(a)
        }
    }, (() => {
        var e;
        l.g.importScripts && (e = l.g.location + "");
        var s = l.g.document;
        if (!e && s && (s.currentScript && "SCRIPT" === s.currentScript.tagName.toUpperCase() && (e = s.currentScript.src), !e)) {
            var o = s.getElementsByTagName("script");
            if (o.length)
                for (var r = o.length - 1; r > -1 && (!e || !/^http(s?):/.test(e));) e = o[r--].src
        }
        if (!e) throw new Error("Automatic publicPath is not supported in this browser");
        e = e.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/"), l.p = e + "../"
    })(), (() => {
        var e = {
            524: 0
        };
        l.f.j = (s, o) => {
            var r = l.o(e, s) ? e[s] : void 0;
            if (0 !== r)
                if (r) o.push(r[2]);
                else {
                    var t = new Promise(((o, t) => r = e[s] = [o, t]));
                    o.push(r[2] = t);
                    var n = l.p + l.u(s),
                        a = new Error;
                    l.l(n, (o => {
                        if (l.o(e, s) && (0 !== (r = e[s]) && (e[s] = void 0), r)) {
                            var t = o && ("load" === o.type ? "missing" : o.type),
                                n = o && o.target && o.target.src;
                            // Try to handle the error gracefully
                            console.warn("Chunk load failed: " + s + ". Continuing without the chunk.");
                            // Resolve the promise instead of rejecting it to prevent the error
                            r[0]();
                        }
                    }), "chunk-" + s, s)
                }
        };
        var s = (s, o) => {
                var r, t, [n, a, i] = o,
                    c = 0;
                if (n.some((s => 0 !== e[s]))) {
                    for (r in a) l.o(a, r) && (l.m[r] = a[r]);
                    if (i) i(l)
                }
                for (s && s(o); c < n.length; c++) t = n[c], l.o(e, t) && e[t] && e[t][0](), e[t] = 0
            },
            o = self.webpackChunksolfege = self.webpackChunksolfege || [];
        o.forEach(s.bind(null, 0)), o.push = s.bind(null, o.push.bind(o))
    })(), l(110);
    l(285)
})();

// Code d'initialisation du slider
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner les éléments du slider
    const sliderTrack = document.querySelector('.slider-track');
    const prevButton = document.querySelector('.slider-arrow--prev');
    const nextButton = document.querySelector('.slider-arrow--next');
    const sliderItems = document.querySelectorAll('.slider-item');
    const sliderProgress = document.querySelector('.slider-progress');
    
    if (sliderTrack && prevButton && nextButton && sliderItems.length > 0) {
        let currentIndex = 0;
        
        // Fonction pour afficher un élément spécifique
        function showSlide(index) {
            // S'assurer que l'index est dans les limites
            if (index < 0) index = sliderItems.length - 1;
            if (index >= sliderItems.length) index = 0;
            
            // Mettre à jour l'index courant
            currentIndex = index;
            
            // Faire défiler jusqu'à l'élément
            const slideWidth = sliderItems[0].offsetWidth;
            sliderTrack.style.transition = 'transform 0.3s ease-in-out';
            sliderTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            
            // Mettre à jour la barre de progression
            if (sliderProgress) {
                sliderProgress.style.width = `${(currentIndex + 1) / sliderItems.length * 100}%`;
            }
        }
        
        // Gestionnaires d'événements pour les boutons
        prevButton.addEventListener('click', () => {
            showSlide(currentIndex - 1);
        });
        
        nextButton.addEventListener('click', () => {
            showSlide(currentIndex + 1);
        });
        
        // Initialiser le slider
        showSlide(0);
        
        // Défilement automatique (optionnel)
        let autoSlideInterval;
        
        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                showSlide(currentIndex + 1);
            }, 5000); // Changer de slide toutes les 5 secondes
        }
        
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // Démarrer le défilement automatique
        startAutoSlide();
        
        // Arrêter le défilement automatique lors du survol
        sliderTrack.addEventListener('mouseenter', stopAutoSlide);
        sliderTrack.addEventListener('mouseleave', startAutoSlide);
        
        // Arrêter le défilement automatique lors du clic sur les boutons
        prevButton.addEventListener('mouseenter', stopAutoSlide);
        nextButton.addEventListener('mouseenter', stopAutoSlide);
        prevButton.addEventListener('mouseleave', startAutoSlide);
        nextButton.addEventListener('mouseleave', startAutoSlide);
        
        // Ajout de la gestion tactile pour les appareils mobiles
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        }, {passive: true});
        
        sliderTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoSlide();
        }, {passive: true});
        
        function handleSwipe() {
            const swipeThreshold = 50; // Seuil minimum pour considérer qu'il y a un swipe
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe vers la gauche -> slide suivant
                showSlide(currentIndex + 1);
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe vers la droite -> slide précédent
                showSlide(currentIndex - 1);
            }
        }
        // Ajuster la taille du slider lors du redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            showSlide(currentIndex);
        });
    }
});

// Initialisation du formulaire de contact
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
} else {
    initContactForm();
}

function initContactForm() {
    const form = document.querySelector('form[action*="formsubmit.co"]');
    if (form) {
        // La validation se fera via l'attribut onsubmit du formulaire
        console.log('Formulaire de contact initialisé');
    }
}

// Fonction de validation du formulaire
document.validateContactForm = function() {
    try {
        const form = document.querySelector('form[action*="formsubmit.co"]');
        if (!form) return true; // Si le formulaire n'existe pas, on laisse passer

        const fields = {
            lastName: { element: document.getElementById('contact_lastName'), name: 'Nom' },
            firstName: { element: document.getElementById('contact_firstName'), name: 'Prénom' },
            email: { element: document.getElementById('contact_email'), name: 'Email' },
            subject: { element: document.getElementById('contact_subject'), name: 'Sujet' },
            message: { element: document.getElementById('contact_message'), name: 'Message' }
        };

        // Vérification des champs obligatoires
        for (const [key, field] of Object.entries(fields)) {
            const value = field.element?.value?.trim() || '';
            if (!value) {
                alert(`Le champ "${field.name}" est obligatoire.`);
                field.element?.focus();
                return false;
            }
        }

        // Validation de l'email
        const email = fields.email.element.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Veuillez entrer une adresse email valide.');
            fields.email.element.focus();
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erreur lors de la validation du formulaire:', error);
        return true; // En cas d'erreur, on laisse passer pour ne pas bloquer l'utilisateur
    }
};
