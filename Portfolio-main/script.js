// This function is REQUIRED by Google and must be in the global scope.
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        layout: google.translate.TranslateElement.InlineLayout.Vertical
    }, 'google_translate_element');
}

document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // 1. Mobile Menu Toggle
    // =======================================================
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar .nav-link');

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        });
    }

    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbar.classList.contains('active')) {
                    navbar.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // =======================================================
    // 2. Theme Toggle (Light/Dark Mode)
    // =======================================================
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        const applyTheme = (theme) => {
            const icon = themeToggleBtn.querySelector('i');
            document.body.classList.remove('light-mode', 'dark-mode');
            document.body.classList.add(theme);
            if (icon) {
                icon.classList.toggle('fa-sun', theme === 'dark-mode');
                icon.classList.toggle('fa-moon', theme === 'light-mode');
            }
        };

        const toggleTheme = () => {
            const newTheme = document.body.classList.contains('dark-mode') ? 'light-mode' : 'dark-mode';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        };

        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark-mode' : 'light-mode');
        
        applyTheme(initialTheme);
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    // =======================================================
    // 4. Header Visibility on Scroll
    // =======================================================
    const header = document.querySelector('.header');
    if (header) {
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            header.classList.toggle('header-scrolled', currentScrollY > 50);
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
            lastScrollY = currentScrollY;
        });
    }
    
    // =======================================================
    // 5. Typing Effect for Hero Section
    // =======================================================
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        const phrases = ["a Software Engineering Student.", "interested in Backend Engineering.", "building for web and mobile.", "open to learning."];        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];
            const typeSpeed = 100, deletingSpeed = 50, delay = 1500;
            
            if (isDeleting) {
                typingTextElement.textContent = currentPhrase.substring(0, charIndex--);
            } else {
                typingTextElement.textContent = currentPhrase.substring(0, charIndex++);
            }

            let speed = isDeleting ? deletingSpeed : typeSpeed;

            if (!isDeleting && charIndex === currentPhrase.length + 1) {
                speed = delay;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                speed = 500;
            }
            setTimeout(typeEffect, speed);
        }
        typeEffect();
    }

    // =======================================================
    // 6. Scroll Animation (Intersection Observer)
    // =======================================================
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animateOnScrollElements.forEach(element => observer.observe(element));

    // =======================================================
    // 7. Interactive Bio Panels (About Section)
    // =======================================================
    const bioPanels = document.querySelectorAll('.bio-panel');
    bioPanels.forEach(panel => {
        const panelHeader = panel.querySelector('.panel-header');
        if (panelHeader) {
            panelHeader.addEventListener('click', () => {
                const isActive = panel.classList.contains('active');
                bioPanels.forEach(p => p.classList.remove('active'));
                if (!isActive) {
                    panel.classList.add('active');
                }
            });
        }
    });

    
    // =======================================================
    // 9. Back To Top Button Logic
    // =======================================================
    const backToTopBtn = document.querySelector('.back-to-top-btn');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =======================================================
    // 10. Lightbox for Illustrations
    // =======================================================
    const lightboxModal = document.getElementById('lightbox-modal');
    if (lightboxModal) {
        const lightboxImg = lightboxModal.querySelector('.lightbox-img');
        const lightboxCloseBtn = lightboxModal.querySelector('.lightbox-close');

        const openLightbox = (src) => {
            lightboxImg.src = src;
            lightboxModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightboxModal.classList.remove('open');
            document.body.style.overflow = '';
        };

        document.addEventListener('click', (e) => {
            if (e.target.matches('.illustration-thumb')) {
                openLightbox(e.target.src);
            }
        });
        lightboxCloseBtn.addEventListener('click', closeLightbox);
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // =======================================================
    // 11. Music Player Logic
    // =======================================================
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    const musicModal = document.getElementById('music-modal');
    const muteBtn = document.getElementById('mute-btn');
    const musicTrackA = document.getElementById('music-track-a');
    const musicTrackB = document.getElementById('music-track-b');
    let currentTrack = null;

    const playTrack = (track, choice) => {
        musicTrackA.pause();
        musicTrackB.pause();
        
        if (track) {
            track.currentTime = 0;
            track.play().catch(e => console.error("Audio play failed:", e));
            currentTrack = track;
            muteBtn.classList.remove('hidden');
            localStorage.setItem('userMusicChoice', choice);
        } else {
            currentTrack = null;
            muteBtn.classList.add('hidden');
            localStorage.setItem('userMusicChoice', 'none');
        }
        updateMuteIcon();
    };

    const updateMuteIcon = () => {
        if (!currentTrack) return;
        const icon = muteBtn.querySelector('i');
        icon.classList.toggle('fa-volume-high', !currentTrack.muted);
        icon.classList.toggle('fa-volume-xmark', currentTrack.muted);
    };
    
    const savedChoice = localStorage.getItem('userMusicChoice');
    if (!savedChoice) {
        if (musicModal) setTimeout(() => musicModal.classList.add('visible'), 500);
    } else {
        if (savedChoice === 'a') playTrack(musicTrackA, 'a');
        else if (savedChoice === 'b') playTrack(musicTrackB, 'b');
    }

    if (musicToggleBtn) {
        musicToggleBtn.addEventListener('click', () => musicModal.classList.add('visible'));
    }

    if (musicModal) {
        musicModal.addEventListener('click', (e) => {
            let trackToPlay = null;
            let choice = null;
            if (e.target.id === 'music-a-btn') { trackToPlay = musicTrackA; choice = 'a'; }
            else if (e.target.id === 'music-b-btn') { trackToPlay = musicTrackB; choice = 'b'; }
            else if (e.target.id === 'music-none-btn') { trackToPlay = null; choice = 'none'; }

            if (choice !== null) {
                playTrack(trackToPlay, choice);
                musicModal.classList.remove('visible');
            }
            if (e.target.classList.contains('modal-overlay')) {
                 musicModal.classList.remove('visible');
            }
        });
    }

    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            if (!currentTrack) return;
            currentTrack.muted = !currentTrack.muted;
            updateMuteIcon();
        });
    }
    
    // =======================================================
    // 12. Language Toggle Dropdown Logic
    // =======================================================
    const langToggleContainer = document.querySelector('.language-toggle-container');
    if (langToggleContainer) {
        const langToggleBtn = document.getElementById('language-toggle-btn');
        langToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langToggleContainer.classList.toggle('dropdown-active');
        });
        window.addEventListener('click', (e) => {
            if (!langToggleContainer.contains(e.target)) {
                langToggleContainer.classList.remove('dropdown-active');
            }
        });
    }

    // =======================================================
    // 13. AI Video Gallery Carousel
    // =======================================================
    const aiGallery = document.getElementById('ai-videos');
    if (aiGallery) {
        const track = aiGallery.querySelector('.ai-snap-track');
        const cards = aiGallery.querySelectorAll('.ai-card');
        const nextButton = aiGallery.querySelector('.ai-nav-btn.next');
        const prevButton = aiGallery.querySelector('.ai-nav-btn.prev');
        const paginationContainer = aiGallery.querySelector('.ai-pagination');

        if (track && cards.length > 0) {
            cards.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('ai-dot');
                dot.setAttribute('aria-label', `Go to video ${index + 1}`);
                dot.addEventListener('click', () => {
                    const scrollAmount = cards[index].offsetLeft - track.offsetLeft;
                    track.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                });
                paginationContainer.appendChild(dot);
            });

            const dots = paginationContainer.querySelectorAll('.ai-dot');
            if (dots.length > 0) dots[0].classList.add('active');

            const scrollCards = (direction) => {
                const cardWidth = cards[0].offsetWidth;
                const gap = parseInt(window.getComputedStyle(track).gap) || 28;
                track.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' });
            };

            nextButton.addEventListener('click', () => scrollCards(1));
            prevButton.addEventListener('click', () => scrollCards(-1));

            const observerOptions = { root: track, threshold: 0.5 };
            const dotObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const cardIndex = Array.from(cards).indexOf(entry.target);
                        dots.forEach(dot => dot.classList.remove('active'));
                        if (dots[cardIndex]) {
                            dots[cardIndex].classList.add('active');
                        }
                    }
                });
            }, observerOptions);

            cards.forEach(card => dotObserver.observe(card));
        }
    }

    const mainProjectsSection = document.getElementById('projects');
    const allProjectsSection = document.getElementById('all-projects');
    const toggleProjectsBtn = document.getElementById('toggle-projects-btn');

    if (mainProjectsSection && allProjectsSection && toggleProjectsBtn) {
        const toggleProjects = () => {
            const isOpen = allProjectsSection.classList.toggle('is-open');
            toggleProjectsBtn.textContent = isOpen ? 'Hide projects' : 'View more projects';
            const target = isOpen ? allProjectsSection : mainProjectsSection;
            target.scrollIntoView({ behavior: 'smooth' });
        };

        toggleProjectsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleProjects();
        });
    }
});



