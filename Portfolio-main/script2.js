/**
 * script2.js - Logic for the welcome/index page.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- Text Scramble Animation Class ---
    class TextScramble {
        constructor(el) { this.el = el; this.chars = '!<>-_\\/[]{}—=+*^?#________'; this.update = this.update.bind(this); }
        setText(newText) { const oldText = this.el.innerText; const length = Math.max(oldText.length, newText.length); const promise = new Promise((resolve) => this.resolve = resolve); this.queue = []; for (let i = 0; i < length; i++) { const from = oldText[i] || ''; const to = newText[i] || ''; const start = Math.floor(Math.random() * 40); const end = start + Math.floor(Math.random() * 40); this.queue.push({ from, to, start, end }); } cancelAnimationFrame(this.frameRequest); this.frame = 0; this.update(); return promise; }
        update() { let output = ''; let complete = 0; for (let i = 0, n = this.queue.length; i < n; i++) { let { from, to, start, end, char } = this.queue[i]; if (this.frame >= end) { complete++; output += to; } else if (this.frame >= start) { if (!char || Math.random() < 0.28) { char = this.randomChar(); this.queue[i].char = char; } output += `<span class="scramble-char">${char}</span>`; } else { output += from; } } this.el.innerHTML = output; if (complete === this.queue.length) { this.resolve(); } else { this.frameRequest = requestAnimationFrame(this.update); this.frame++; } }
        randomChar() { return this.chars[Math.floor(Math.random() * this.chars.length)]; }
    }

    /**
     * Runs the welcome animation sequence.
     */
    async function runWelcomeAnimation() {
        const titleElement = document.getElementById('scramble-title');
        const finalMessage = document.querySelector('.final-message');
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        
        if (!titleElement || !finalMessage) return;

        const fx = new TextScramble(titleElement);
        await sleep(500);
        await fx.setText("Hello, I'm Okeke Ijeamaka Grace.");
        await sleep(1200);
        await fx.setText("Welcome to my Portfolio.");
        
        // Directly show the view selection after the text animation
        finalMessage.classList.add('visible');
    }

    /**
     * Sets up persistent event listeners.
     */
    function setupEventListeners() {
        // --- Language Toggle ---
        const langToggleContainer = document.querySelector('.language-toggle-container');
        if (langToggleContainer) {
            const langToggleBtn = document.getElementById('language-toggle-btn');
            
            // Listen for a click specifically on the button to open/close
            langToggleBtn.addEventListener('click', (event) => {
                // This stops the click from bubbling up to the window immediately
                event.stopPropagation(); 
                langToggleContainer.classList.toggle('dropdown-active');
            });

            // Listen for a click anywhere on the page to close the dropdown
            window.addEventListener('click', (event) => {
                // We only close the dropdown if it's currently active
                // AND the click was NOT inside the toggle container itself.
                if (langToggleContainer.classList.contains('dropdown-active') && !langToggleContainer.contains(event.target)) {
                    langToggleContainer.classList.remove('dropdown-active');
                }
            });
        }
    }

    /**
     * Initializes the Google Translate widget.
     */
    function initGoogleTranslate() {
        try {
            new google.translate.TranslateElement({
                pageLanguage: 'en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
        } catch (error) {
            console.error("Google Translate initialization error:", error);
        }
    }

    // --- Initialize the Page ---
    runWelcomeAnimation();
    setupEventListeners();
    // This assumes you have a function to load the Google Translate script
    // If not, you'll need to add it or call initGoogleTranslate directly if the script is in your HTML.
    // loadGoogleTranslateScript(); 
});
