// Using config.weatherApiKey from config.js
async function fetchIPAndLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        document.getElementById('ip-display').textContent = `IP: ${data.ip}`;
        document.getElementById('location-display').textContent = 
            `Supposed location: ${data.city}, ${data.country_code}`;
        
        fetchWeather(data.latitude, data.longitude);
    } catch (error) {
        document.getElementById('ip-display').textContent = 'IP: unavailable';
        document.getElementById('location-display').textContent = 'Location: unavailable';
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
        
        document.getElementById('weather-display').textContent = 
            `Weather: ${temp}°C, ${condition}`;
    } catch (error) {
        document.getElementById('weather-display').textContent = 'Weather: unavailable';
        console.error('Error fetching weather:', error);
    }
}

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}

// Initialize everything
fetchIPAndLocation();
setInterval(updateClock, 1000);
updateClock();
