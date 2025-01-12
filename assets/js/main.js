async function fetchIPAndLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (document.getElementById('ip-display')) {
            document.getElementById('ip-display').textContent = data.ip || '[_no_ip_address_]';
        }
        
        if (document.getElementById('location-display')) {
            document.getElementById('location-display').textContent = 
                `${data.city}, ${data.country_code}`;
        }
        
        fetchWeather(data.latitude, data.longitude);
    } catch (error) {
        if (document.getElementById('ip-display')) {
            document.getElementById('ip-display').textContent = '[_no_ip_address_]';
        }
        if (document.getElementById('location-display')) {
            document.getElementById('location-display').textContent = 'Location: unavailable';
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
            document.getElementById('weather-display').textContent = 
                `${temp}°C, ${condition}`;
        }
    } catch (error) {
        if (document.getElementById('weather-display')) {
            document.getElementById('weather-display').textContent = 'Weather: unavailable';
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
    
    if (document.getElementById('clock')) {
        document.getElementById('clock').textContent = timeString;
    }
    if (document.getElementById('time')) {
        document.getElementById('time').textContent = timeString;
    }
}

fetchIPAndLocation();
setInterval(updateClock, 1000);
updateClock();
