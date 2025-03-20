import './style.css';

// Event listener for the landing page search input
document.querySelector('#landing-search').addEventListener('keydown', async (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault();
        const searchValue = document.querySelector('#landing-search').value.trim();
        
        if (searchValue) {
            const success = await fetchWeatherData(searchValue);
            if (success) {
                // Update the main search input with the same value
                document.querySelector('#search').value = searchValue;
                
                // Switch from landing page to weather display
                document.getElementById('landing-page').style.display = 'none';
                document.getElementById('weather-display').style.display = 'grid';
            }
        } else {
            alert('Digite uma cidade');
        }
    }
});

// Event listener for the main display search input
document.querySelector('#search').addEventListener('keydown', async (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault();
        const searchValue = document.querySelector('#search').value.trim();
        
        if (searchValue) {
            await fetchWeatherData(searchValue);
        } else {
            alert('Digite uma cidade');
        }
    }
});

// Function to fetch weather data
async function fetchWeatherData(city) {
    const apiKey = import.meta.env.VITE_API_KEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        
        // Log para debug
        console.log("Status da resposta:", response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const json = await response.json();
        
        // Log para debug
        console.log("Dados recebidos:", json);
        
        // Verificação mais simples
        if (json.main && json.name) {
            showInfo({
                city: json.name,
                temperature: json.main.temp,
                tempMax: json.main.temp_max,
                tempMin: json.main.temp_min,
                humidity: json.main.humidity,
                wind: json.wind.speed,
                clouds: json.clouds.all,
            });
            updateBallColor(json.main.temp);
            return true;
        } else {
            alert('Dados da cidade inválidos ou incompletos.');
            return false;
        }
    } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        
        // Mensagem de erro mais específica
        if (error.message.includes('404')) {
            alert('Cidade não encontrada! Verifique o nome e tente novamente.');
        } else {
            alert(`Erro ao conectar com a API: ${error.message}`);
        }
        return false;
    }
}

function showInfo(json) {
    document.querySelector("#city_name").innerHTML = `${json.city}`;
    document.querySelector("#temp").innerHTML = `${Math.round(json.temperature)}<sup>0</sup>`;
    document.querySelector("#highest").innerHTML = `${Math.round(json.tempMax)}°`;
    document.querySelector("#low").innerHTML = `${Math.round(json.tempMin)}°`;
    document.querySelector("#air").innerHTML = `${json.humidity} %`;
    document.querySelector("#wind").innerHTML = `${Math.round(json.wind)} Km/h`;
    document.querySelector("#cloud").innerHTML = `${json.clouds} %`;
}

function updateBallColor(temperature) {
    const ball = document.querySelector(".ball");
    if (temperature > 32) {
        ball.style.backgroundColor = 'rgb(207, 2, 2)';
    } else if (temperature >= 27 && temperature <= 31) {
        ball.style.backgroundColor = 'rgb(255, 115, 0)';
    } else if (temperature >= 21 && temperature <= 26) {
        ball.style.backgroundColor = 'rgb(255, 238, 0)';
    } else if (temperature >= 14 && temperature <= 20) {
        ball.style.backgroundColor = 'rgb(0, 230, 11)';
    } else if (temperature >= 5 && temperature <= 13) {
        ball.style.backgroundColor = 'rgb(0, 107, 230)';
    } else if (temperature <= 4) {
        ball.style.backgroundColor = 'rgb(69, 13, 173)';
    }
}