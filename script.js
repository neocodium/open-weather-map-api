
const appId = '4d068848ed6f92575322a5e2c24ae602';
const countryCode = 'US';
const geoUrlBase = 'http://api.openweathermap.org/geo/1.0/zip?zip=';
const openWeatherApi = 'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}';

const locations = {
  'henry-hagg': 97119,
  'milo-mciver': 97023,
  'oxbow': 97080
}

async function getLatLong(zipcode) {
  try {
    const response = await fetch(`${geoUrlBase}${zipcode},${countryCode}&appid=${appId}`);
    const data = await response.json()
    return `${data.lat}:${data.lon}`
  } catch (e) {
    console.log(e);
  }
}

async function getWeatherData(zipcode) {
  try {
    const latLongString = await getLatLong(zipcode);
    const latitude = latLongString.split(':')[0];
    const longtitude = latLongString.split(':')[1]

    const weatherResponse = await fetch(`https:/api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longtitude}&units=imperial&appid=${appId}`);
    return await weatherResponse.json();
  } catch (e) {
    console.log(e);
  } 
}

async function createCard(weatherData, locationId) {
  const imgHtml = `<img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" class="card-image">`;
  const cardHtml = `<div class="card-body"><h5 class="card-title">${locationId}</h5><h1>${weatherData.main.temp} F</h1><p class="card-text">${weatherData.weather[0].description.toUpperCase()}</p><p class="card-text">Feels like: ${weatherData.main.feels_like} F</p></div>`;
  const cardDetailHtml = `<ul class="list-group list-group-flush"><li class="list-group-item">Temp Min: ${weatherData.main.temp_min} F</li><li class="list-group-item">Temp Max: ${weatherData.main.temp_max} F</li><li class="list-group-item">Wind speed: ${weatherData.wind.speed} miles</li><li class="list-group-item">Sunrise time: ${await convertToTime(weatherData.sys.sunrise)}</li><li class="list-group-item">Sunset time: ${await convertToTime(weatherData.sys.sunset)}</li></ul>`
  const linkToDetailHtml = `<div class="card-body"><a href="#" class="card-link">More Details</a></div>`;
  document.getElementById(locationId).innerHTML = imgHtml + cardHtml + cardDetailHtml + linkToDetailHtml;
}

async function convertToTime(unix) {
  let date = new Date(unix * 1000);
  return `${date.getHours()}:${date.getMinutes()}`;
}

window.onload = async function() {
  // Iterating instead of repeating calls
  for (let key in locations) {
    createCard(await getWeatherData(locations[key]), key)
  }
}