async function getCoordinates(city) {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`)
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

async function main() {
    let city = document.querySelector('#CitySelect').value
    let place = await getCoordinates(city)
    let weather = await getWeather(place.latitude, place.longtude)
    console.log(weather) 
}

main()