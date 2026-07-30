async function getCoordinates(city) {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=ru`)
    const data = await response.json()
    return data.results[0]
}

async function getWeather(latitude, longitude) {
const response = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}
&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code
&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`)
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

async function main(city) {
    let place = await getCoordinates(city)
    let weather = await getWeather(place.latitude, place.longitude)
    console.log(weather)
    renderCurrent(weather) 
}

document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityInput").value;
    main(city);
})