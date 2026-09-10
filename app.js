async function getCoordinates(city) {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=ru`)
    
    if (!response.ok){
        throw new Error(`Bad response ${response.status}`)
    }

    const data = await response.json()
    
     if (!data.results) {
        throw new Error('Place not found')
    }
    
    return data.results[0]
}

async function getWeather(latitude, longitude) {
    const response = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}
&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code
&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`)



    if (!response.ok) {
        throw new Error('Bad response ${response.status}');
    }

    const data = await response.json()
    console.log(data)
    return data
}

function renderCurrent (weather) {
    const current = weather.current;

    document.querySelector('#currentWeather').innerHTML =`
    <h2>Текущая погода</h2>
    <p> 🌡${current.temperature_2m}°C</p>
    <p> 🤗Ощущается: ${current.apparent_temperature}°C</p>
    <p> 💧Влажность: ${current.relative_humidity_2m}%</p>
    <p> 🌫Ветер: ${current.wind_speed_10m} км/год</p>
    `;
}

function renderForecast(weather) {
    const daily = weather.daily
    const times = daily.time
    let output = `<h2>Прогноз</h2>`;

    for (let i=0; i<times.length; i++) {
        time = times[i]
        t_max = daily.temperature_2m_max[i]
        t_min = daily.temperature_2m_min[i]
        const code = daily.weather_code[i]

        let weatherImage = ""
        if (code === 0){
            weatherImage = "☀️"
        } else if (code >= 1 && code <= 2){
            weatherImage = "⛅"
        } else if (code === 3){
            weatherImage = "☁️"
        } else if (code >= 61 && code <= 67 || code >= 80 && code <= 82){
             weatherImage = "🌧️"         
        }else if (code === 77 || code >= 85 && code <= 86 || code >= 71 && code <= 75 ){
             weatherImage = "🌨️"
        }else if (code === 45 && code <= 48 || code >= 51 && code <= 57){
             weatherImage = "🌫️"
        }else if (code >= 95 && code <= 99){
             weatherImage = "⚡"
        }

        output += `<div>⌚ ${time} ${weatherImage} ${t_max} / ${t_min} </div>`
    }

    document.querySelector('#forecast').innerHTML = output;
}

function getHistory() {
    return JSON.parse(localStorage.getItem("history")) || [];
}

function addToHistory(city) {
    let history = getHistory();

    history = history.filter(item => item !== city);

    history.unshift(city);

    history = history.slice(0, 5);

    localStorage.setItem("history", JSON.stringify(history));

    renderHistory();

}

function renderHistory() {
    const history = getHistory();

    document.querySelector("#history").innerHTML = `
        <h2>Історія пошуку</h2>

        ${history.map(city => `
            <button class="history-city">${city}</button>
        `).join("")}
    `;

    document.querySelectorAll(".history-city").forEach(button => {
        button.addEventListener("click", () => {
            const city = button.textContent;

            document.querySelector("#cityInput").value = city;

            main(city);
        });
    });
}

async function main(city) {
    try {
        let place = await getCoordinates(city)
        let weather = await getWeather(place.latitude, place.longitude)
        console.log(weather)
        renderCurrent(weather) 
        renderForecast(weather)
        document.getElementById("currentWeather").classList.remove("invisible")
        document.getElementById("forecast").classList.remove("invisible")
        addToHistory(city)
    }
    catch(e) {
        console.log(e)
    }
}

document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityInput").value;
    main(city);
})

document.getElementById("cityInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const city = document.getElementById("cityInput").value;
        main(city); 
    }
})

renderHistory();