function createGlitchEffect(element) {
    if (!element.getAttribute('data-text')) {
        element.setAttribute('data-text', element.textContent);
    }
    
    const text = element.textContent;
    const maxOffset = 5;
    
    let glitchInterval;
    
    element.addEventListener('mouseenter', () => {
        glitchInterval = setInterval(() => {
            const glitchText = text.split('').map(char => {
                if (Math.random() < 0.1) {
                    const offset = Math.floor(Math.random() * maxOffset);
                    const style = `transform: translate(${offset}px, ${offset}px);`;
                    return `<span style="${style}">${char}</span>`;
                }
                return char;
            }).join('');
            
            element.innerHTML = glitchText;
        }, 50);
    });
    
    element.addEventListener('mouseleave', () => {
        clearInterval(glitchInterval);
        element.textContent = text;
        element.setAttribute('data-text', text);
    });
}

function createConstantGlitch(element) {
    setInterval(() => {
        if (Math.random() < 0.1) {  // 10% chance of glitch
            const text = element.textContent;
            const glitchText = text.split('').map(char => {
                if (Math.random() < 0.3) {  // 30% chance per character
                    const offset = Math.floor(Math.random() * 3) - 1;
                    const style = `transform: translate(${offset}px, ${offset}px);`;
                    return `<span style="${style}">${char}</span>`;
                }
                return char;
            }).join('');
            
            element.innerHTML = glitchText;
            
            // Reset after a short delay
            setTimeout(() => {
                element.textContent = text;
            }, 150);
        }
    }, 200);
}

function addFlickerToLinks() {
    const style = document.createElement('style');
    style.textContent = `
        a {
            animation: linkFlicker 0.1s infinite alternate-reverse;
        }
        
        @keyframes linkFlicker {
            0% { opacity: 0.95; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

function addCRTFlicker() {
    if (!document.querySelector('.crt-flicker')) {
        const flicker = document.createElement('div');
        flicker.classList.add('crt-flicker');
        document.body.appendChild(flicker);
    }
}

function addStaticNoise() {
    if (!document.querySelector('.static-noise')) {
        const noise = document.createElement('div');
        noise.classList.add('static-noise');
        document.body.appendChild(noise);
    }
}

function addScanlines() {
    if (!document.querySelector('.scanlines')) {
        const scanlines = document.createElement('div');
        scanlines.classList.add('scanlines');
        document.body.appendChild(scanlines);
    }
}

function initializeEffects() {
    // Initialize link effects
    const links = document.querySelectorAll('a');
    links.forEach(createGlitchEffect);
    
    // Initialize constant glitch effects for clock and IP
    const elementsToGlitch = [
        document.getElementById('time'),
        document.getElementById('ip-display')
    ];
    
    elementsToGlitch.forEach(element => {
        if (element) {
            createConstantGlitch(element);
        }
    });
    
    // Add flicker to links
    addFlickerToLinks();
    
    // Add CRT effects
    //addCRTFlicker();
    addStaticNoise();
    addScanlines();
    
    //document.addEventListener('mousemove', (e) => {
    //    const x = e.clientX / window.innerWidth;
    //    const y = e.clientY / window.innerHeight;
    //    
    //    document.documentElement.style.setProperty('--mouse-x', x);
    //    document.documentElement.style.setProperty('--mouse-y', y);
    //});
}

// Initialize effects when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeEffects);

// Re-initialize effects when content changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        if (mutation.target.id === 'time' || mutation.target.id === 'ip-display') {
            // Don't reinitialize for clock or IP updates
            return;
        }
        initializeEffects();
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
