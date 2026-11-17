document.addEventListener("DOMContentLoaded", function() {

    // Global variable for the Locomotive Scroll instance
    let scroll;

    // =======================================
    // 1. INITIALIZE LOCOMOTIVE SCROLL (FOR DESKTOP)
    // =======================================
    function initLocomotiveScroll() {
        if (window.innerWidth > 1024) { 
            scroll = new LocomotiveScroll({
                el: document.querySelector('[data-scroll-container]'),
                smooth: true,
                lerp: 0.08
            });

            gsap.registerPlugin(ScrollTrigger);
            scroll.on("scroll", ScrollTrigger.update);

            ScrollTrigger.scrollerProxy("[data-scroll-container]", {
                scrollTop(value) {
                    return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
                },
                getBoundingClientRect() {
                    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
                },
                pinType: document.querySelector("[data-scroll-container]").style.transform ? "transform" : "fixed"
            });

            ScrollTrigger.addEventListener("refresh", () => scroll.update());
            ScrollTrigger.refresh();
        }
    }

    // =======================================
    // 2. INITIALIZE BACKGROUND CANVAS SEQUENCE
    // =======================================
    function initCanvasSequence() {
        const canvas = document.querySelector("canvas"); 
        if (!canvas) return;

        const context = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render();
        });

        function files(index) {
            const frameNumber = (index + 1).toString().padStart(3, '0');
            return `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${frameNumber}.jpg`;
        }

        const frameCount = 147; // Adjusted to match the example image sequence
        const images = [];
        const imageSeq = { frame: 0 };

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = files(i);
            images.push(img);
        }

        gsap.to(imageSeq, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            scrollTrigger: {
                scrub: 0.2,
                trigger: "#main",
                start: "top top",
                end: "bottom bottom",
                scroller: scroll ? "[data-scroll-container]" : window // Use correct scroller
            },
            onUpdate: render,
        });
        
        if (images.length > 0) {
            images[0].onload = render;
        }

        function render() {
            if (images[imageSeq.frame]) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                scaleImage(images[imageSeq.frame], context);
            }
        }

        function scaleImage(img, ctx) {
            const canvas = ctx.canvas;
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);
            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;
            ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        }
    }

    // =======================================
    // 3. INITIALIZE NAVIGATION & SCROLLING
    // =======================================
    function initNavigation() {
        // --- Smooth Scrolling for Nav & CTA Links ---
        const scrollLinks = document.querySelectorAll('a[data-scroll-to]');
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    if (scroll) { // Check if Locomotive Scroll is active
                        scroll.scrollTo(targetElement);
                    } else { // Fallback for mobile
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // --- Back To Top Button ---
        const backToTopBtn = document.querySelector('.back-to-top-btn');
        if (backToTopBtn) {
            const handleScroll = (instance) => {
                const yPos = instance.scroll ? instance.scroll.y : window.scrollY;
                backToTopBtn.classList.toggle('show', yPos > 300);
            };

            if (scroll) {
                scroll.on('scroll', handleScroll);
            } else {
                window.addEventListener('scroll', handleScroll);
            }
        }
    }

    // =======================================
    // 4. INITIALIZE UI COMPONENTS
    // =======================================
    function initUIComponents() {
        // --- Mobile Nav Toggle ---
        const navToggle = document.getElementById('mobile-nav-toggle');
        const mainNav = document.getElementById('main-nav');
        if (navToggle && mainNav) {
            const navLinks = mainNav.querySelectorAll('.nav-link');
            navToggle.addEventListener('click', () => {
                mainNav.classList.toggle('nav-active');
                const icon = navToggle.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (mainNav.classList.contains('nav-active')) {
                        mainNav.classList.remove('nav-active');
                        const icon = navToggle.querySelector('i');
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                });
            });
        }

        // --- Typing Effect ---
        const typingText = document.getElementById("typing-text");
        if (typingText) {
            const roles = ["ONLINE", "Open to learning", "Software Engineering Student.", "Interested in Backend Engineering.", "Web & Mobile Development."];
            let roleIndex = 0, charIndex = 0, isDeleting = false;

            function type() {
                const currentRole = roles[roleIndex];
                let speed = isDeleting ? 75 : 150;
                typingText.textContent = currentRole.substring(0, charIndex);
                
                if (isDeleting) {
                    charIndex--;
                    if (charIndex === 0) {
                        isDeleting = false;
                        roleIndex = (roleIndex + 1) % roles.length;
                        speed = 500;
                    }
                } else {
                    charIndex++;
                    if (charIndex > currentRole.length) {
                        isDeleting = true;
                        speed = 1200;
                    }
                }
                setTimeout(type, speed);
            }
            type();
        }

        // --- Accordion Panels ---
        document.querySelectorAll('.bio-panel .panel-header').forEach(header => {
            header.addEventListener('click', () => {
                const panel = header.parentElement;
                const wasActive = panel.classList.contains('active');
                document.querySelectorAll('.bio-panel').forEach(p => p.classList.remove('active'));
                if (!wasActive) panel.classList.add('active');
            });
        });

        // --- Case Study Carousel & Stepper ---
        const caseStudySection = document.getElementById('case-study');
        if (caseStudySection) {
            const slides = caseStudySection.querySelectorAll('.carousel-slide');
            const dots = caseStudySection.querySelectorAll('.dot');
            const nextBtn = caseStudySection.querySelector('.next');
            const prevBtn = caseStudySection.querySelector('.prev');
            let currentIndex = 0;

            function showSlide(index) {
                currentIndex = (index + slides.length) % slides.length;
                slides.forEach((slide, i) => slide.classList.toggle('active', i === currentIndex));
                dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
            }

            if (slides.length > 0) {
                nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
                prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
                dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
                showSlide(0);
            }

            const stepperItems = caseStudySection.querySelectorAll('.step-item');
            stepperItems.forEach(item => {
                item.addEventListener('click', () => {
                    const targetId = item.dataset.tab;
                    stepperItems.forEach(si => si.classList.remove('active'));
                    item.classList.add('active');
                    caseStudySection.querySelectorAll('.case-study-panel').forEach(panel => {
                        panel.classList.toggle('active', panel.id === targetId);
                    });
                });
            });
        }
    }

    // =======================================
    // 5. INITIALIZE TOGGLES & MODALS
    // =======================================
    function initTogglesAndModals() {
        // --- Theme Toggle ---
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            const setTheme = (theme) => {
                document.body.classList.toggle('light-mode', theme === 'light');
                icon.classList.toggle('fa-moon', theme === 'light');
                icon.classList.toggle('fa-sun', theme !== 'light');
                localStorage.setItem('devTheme', theme);
            };
            const savedTheme = localStorage.getItem('devTheme') || 'dark';
            setTheme(savedTheme);
            themeBtn.addEventListener('click', () => {
                const newTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
                setTheme(newTheme);
            });
        }

        // --- Language Toggle ---
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

        // --- Music Player ---
        const musicModal = document.getElementById('music-modal');
        if(musicModal) {
            const musicToggleBtn = document.getElementById('music-toggle-btn');
            const muteBtn = document.getElementById('mute-btn');
            const musicTrackA = document.getElementById('music-track-a');
            const musicTrackB = document.getElementById('music-track-b');
            let currentTrack = null;

            const playTrack = (track, choice) => {
                [musicTrackA, musicTrackB].forEach(t => t.pause());
                if (track) {
                    track.currentTime = 0;
                    track.play().catch(e => console.error("Audio play failed:", e));
                    currentTrack = track;
                    muteBtn.classList.remove('hidden');
                    localStorage.setItem('userMusicChoiceDev', choice);
                } else {
                    currentTrack = null;
                    muteBtn.classList.add('hidden');
                    localStorage.setItem('userMusicChoiceDev', 'none');
                }
                updateMuteIcon();
            };

            const updateMuteIcon = () => {
                if (!currentTrack) return;
                const icon = muteBtn.querySelector('i');
                icon.classList.toggle('fa-volume-high', !currentTrack.muted);
                icon.classList.toggle('fa-volume-xmark', currentTrack.muted);
            };
            
            const savedChoice = localStorage.getItem('userMusicChoiceDev');
            if (!savedChoice) {
                setTimeout(() => musicModal.classList.add('visible'), 500);
            } else if (savedChoice === 'a') {
                playTrack(musicTrackA, 'a');
            } else if (savedChoice === 'b') {
                playTrack(musicTrackB, 'b');
            }

            musicToggleBtn.addEventListener('click', () => musicModal.classList.add('visible'));
            muteBtn.addEventListener('click', () => {
                if (currentTrack) {
                    currentTrack.muted = !currentTrack.muted;
                    updateMuteIcon();
                }
            });
            musicModal.addEventListener('click', (e) => {
                let choice = null, trackToPlay = null;
                if (e.target.id === 'music-a-btn') { trackToPlay = musicTrackA; choice = 'a'; }
                else if (e.target.id === 'music-b-btn') { trackToPlay = musicTrackB; choice = 'b'; }
                else if (e.target.id === 'music-none-btn') { choice = 'none'; }
                
                if (choice !== null || e.target.classList.contains('modal-overlay')) {
                    if (choice !== null) playTrack(trackToPlay, choice);
                    musicModal.classList.remove('visible');
                }
            });
        }

        // --- Illustration Lightbox ---
        const lightboxModal = document.getElementById('lightbox-modal');
        if (lightboxModal) {
            const lightboxImg = lightboxModal.querySelector('.lightbox-img');
            const lightboxCloseBtn = lightboxModal.querySelector('.lightbox-close');
            const openLightbox = (src, alt) => {
                lightboxImg.src = src;
                lightboxImg.alt = alt || '';
                lightboxModal.classList.add('open');
            };
            const closeLightbox = () => lightboxModal.classList.remove('open');

            document.addEventListener('click', (e) => {
                if (e.target.matches('.illustration-thumb')) openLightbox(e.target.src, e.target.alt);
            });
            lightboxCloseBtn.addEventListener('click', closeLightbox);
            lightboxModal.addEventListener('click', (e) => {
                if (e.target === lightboxModal) closeLightbox();
            });
        }
    }

    function initProjectToggle() {
        const mainProjects = document.getElementById('projects');
        const allProjects = document.getElementById('all-projects');
        const toggleBtn = document.getElementById('toggle-projects-btn-dev');

        if (!mainProjects || !allProjects || !toggleBtn) return;

        const toggle = () => {
            const isOpen = allProjects.classList.toggle('is-open');
            toggleBtn.textContent = isOpen ? 'Hide projects' : 'View more projects';
            if (scroll) {
                scroll.update();
                scroll.scrollTo(isOpen ? allProjects : mainProjects);
            } else {
                const target = isOpen ? allProjects : mainProjects;
                target.scrollIntoView({ behavior: 'smooth' });
            }
        };

        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggle();
        });
    }


    // --- RUN ALL INITIALIZATION FUNCTIONS ---
    initLocomotiveScroll();
    initCanvasSequence();
    initNavigation();
    initUIComponents();
    initTogglesAndModals();
    initProjectToggle();

});
