function createGlitchEffect(element) {
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
    });
}

function addCRTFlicker() {
    const flicker = document.createElement('div');
    flicker.classList.add('crt-flicker');
    document.body.appendChild(flicker);
}

function addStaticNoise() {
    const noise = document.createElement('div');
    noise.classList.add('static-noise');
    document.body.appendChild(noise);
}

function initializeEffects() {
    const links = document.querySelectorAll('a');
    links.forEach(createGlitchEffect);
    
    addCRTFlicker();
    addStaticNoise();
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        document.documentElement.style.setProperty('--mouse-x', x);
        document.documentElement.style.setProperty('--mouse-y', y);
    });
}

document.addEventListener('DOMContentLoaded', initializeEffects);
