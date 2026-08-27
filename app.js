async function getCoordinates(city) {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=ru`)
    
    if (!response.ok){
        throw new Error(`Bad response ${response.status}`)
    }

    const data = await response.json()
    
     if (!data.results) {
        throw new Error('Micto не знайдено')
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
    return data
}

function renderCurrent (weather) {
    const current = weather.current;

    document.querySelector('#currentWeather').innerHTML =`
    <h2>Поточна погода</h2>
    <p> 🌡${current.temperature_2m}°C</p>
    <p> 🤗Видчуваєтся: ${current.apparent_temperature}°C</p>
    <p> 💧Вологисть: ${current.relative_humidity_2m}%</p>
    <p> 🌫Вітер: ${current.wind_speed_10m} км/год</p>
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

        output += `<div>⌚ ${time} 🌡 max: ${t_max} / min: ${t_min} </div>`
    }

    document.querySelector('#forecast').innerHTML = output;
}

async function main(city) {
    try {
        let place = await getCoordinates(city)
        let weather = await getWeather(place.latitude, place.longitude)
        console.log(weather)
        renderCurrent(weather) 
        renderForecast(weather)
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