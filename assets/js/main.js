async function fetchIPAndLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (document.getElementById('ip-display')) {
            const element = document.getElementById('ip-display');
            element.classList.add('glitch-hover');
            element.setAttribute('data-text', data.ip || '[_no_ip_address_]');
            element.textContent = data.ip || '[_no_ip_address_]';
        }
        
        if (document.getElementById('location-display')) {
            const element = document.getElementById('location-display');
            const locationText = `${data.city}, ${data.country_code}`;
            element.classList.add('glitch-hover');
            element.setAttribute('data-text', locationText);
            element.textContent = locationText;
        }
        
        fetchWeather(data.latitude, data.longitude);
    } catch (error) {
        if (document.getElementById('ip-display')) {
            const element = document.getElementById('ip-display');
            element.classList.add('glitch-hover');
            element.setAttribute('data-text', '[_no_ip_address_]');
            element.textContent = '[_no_ip_address_]';
        }
        if (document.getElementById('location-display')) {
            const element = document.getElementById('location-display');
            element.classList.add('glitch-hover');
            element.setAttribute('data-text', 'Location: unavailable');
            element.textContent = 'Location: unavailable';
        }
        console.error('Error fetching IP/location:', error);
    }
}

async function fetchWeather(lat, lon) {
    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.weatherApiKey}&units=metric`;
        const response = await fetch(weatherUrl);
        const data = await response.json();
        
        const temp = Math.round(data.main.temp);
        const condition = data.weather[0].main;
        
        if (document.getElementById('weather-display')) {
            const element = document.getElementById('weather-display');
            const weatherText = `${temp}°C, ${condition}`;
            element.classList.add('glitch-hover');
            element.setAttribute('data-text', weatherText);
            element.textContent = weatherText;
        }
    } catch (error) {
        if (document.getElementById('weather-display')) {
            const element = document.getElementById('weather-display');
            element.classList.add('glitch-hover');
            element.setAttribute('data-text', 'Weather: unavailable');
            element.textContent = 'Weather: unavailable';
        }
        console.error('Error fetching weather:', error);
    }
}

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    if (document.getElementById('time')) {
        const element = document.getElementById('time');
        element.classList.add('glitch-hover');
        element.setAttribute('data-text', timeString);
        element.textContent = timeString;
    }
}

function setupEffects() {
    const body = document.body;
    
    const effectsContainer = document.createElement('div');
    effectsContainer.className = 'crt-effects';
    
    const scanlines = document.createElement('div');
    scanlines.className = 'scanlines';
    
    const glow = document.createElement('div');
    glow.className = 'glow';
    
    effectsContainer.appendChild(scanlines);
    effectsContainer.appendChild(glow);
    body.appendChild(effectsContainer);
    
    const toggle = document.createElement('button');
    toggle.className = 'effects-toggle';
    toggle.textContent = 'CRT';
    body.appendChild(toggle);
    
    let effectsEnabled = localStorage.getItem('crtEffects') !== 'disabled';
    effectsContainer.style.display = effectsEnabled ? 'block' : 'none';
    
    toggle.addEventListener('click', () => {
        effectsEnabled = !effectsEnabled;
        effectsContainer.style.display = effectsEnabled ? 'block' : 'none';
        localStorage.setItem('crtEffects', effectsEnabled ? 'enabled' : 'disabled');
    });
    
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.classList.add('glitch-hover');
        link.setAttribute('data-text', link.textContent);
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    setupEffects();
    fetchIPAndLocation();
    setInterval(updateClock, 1000);
    updateClock();
});
