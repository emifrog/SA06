        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('nav');
            if (window.scrollY > 50) {
                nav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            } else {
                nav.style.boxShadow = 'none';
            }
        });

        // Animate stats on scroll
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate stat numbers
                    const statValues = entry.target.querySelectorAll('.stat-value');
                    statValues.forEach(stat => {
                        const target = parseInt(stat.textContent);
                        let current = 0;
                        const increment = target / 50;
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                current = target;
                                clearInterval(timer);
                                stat.textContent = target + '+';
                            } else {
                                stat.textContent = Math.floor(current) + '+';
                            }
                        }, 30);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe stats grid
        const statsGrid = document.querySelector('.stats-grid');
        if (statsGrid) {
            observer.observe(statsGrid);
        }

        // Parallax effect on scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const floatElements = document.querySelectorAll('.float-element');
            
            floatElements.forEach((element, index) => {
                const speed = index === 0 ? 0.5 : 0.3;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });

        // Add hover effect to cards
        const cards = document.querySelectorAll('.stat-card, .service-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Animate chart bars on scroll
        const chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bars = entry.target.querySelectorAll('.chart-bar');
                    bars.forEach((bar, index) => {
                        bar.style.animationDelay = `${index * 0.1}s`;
                    });
                }
            });
        }, { threshold: 0.5 });

        const visualChart = document.querySelector('.visual-chart');
        if (visualChart) {
            chartObserver.observe(visualChart);
        }