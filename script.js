const apiKey = "332c2b1e722e9d8e2f6bb7190c307966";
const weatherInfo = document.getElementById("weatherInfo");
const forecastDiv = document.getElementById("forecast");

// Automatically detect user location
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByLocation(lat, lon);
      },
      () => {
        weatherInfo.innerHTML = "Please allow location access or search manually.";
      }
    );
  }
};

// Fetch weather by city name
async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Enter a city name!");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.cod === 200) {
    showWeather(data);
    getForecast(data.coord.lat, data.coord.lon);
  } else {
    weatherInfo.innerHTML = `<p>${data.message}</p>`;
  }
}

// Fetch weather by location
async function getWeatherByLocation(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.cod === 200) {
    showWeather(data);
    getForecast(lat, lon);
  } else {
    weatherInfo.innerHTML = `<p>${data.message}</p>`;
  }
}

// Display main weather
function showWeather(data) {
  const icon = data.weather[0].icon;
  const desc = data.weather[0].main.toLowerCase();
  setDynamicBackground(desc);

  weatherInfo.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon">
    <h3>${data.main.temp}°C</h3>
    <p>${data.weather[0].description}</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind: ${data.wind.speed} m/s</p>
  `;
}

// Get 7-day forecast
async function getForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  displayForecast(data.daily);
}

// Display 7-day forecast
function displayForecast(days) {
  forecastDiv.innerHTML = "";
  days.slice(0, 7).forEach(day => {
    const date = new Date(day.dt * 1000);
    const icon = day.weather[0].icon;
    const desc = day.weather[0].main;

    forecastDiv.innerHTML += `
      <div class="day">
        <h4>${date.toLocaleDateString('en-US', { weekday: 'short' })}</h4>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="icon">
        <p>${desc}</p>
        <p>${Math.round(day.temp.day)}°C</p>
      </div>
    `;
  });
}

// Change background based on weather type
function setDynamicBackground(weather) {
  document.body.className = ""; // reset previous
  if (weather.includes("rain")) {
    document.body.classList.add("rainy");
  } else if (weather.includes("cloud")) {
    document.body.classList.add("cloudy");
  } else if (weather.includes("clear")) {
    document.body.classList.add("clear");
  } else if (weather.includes("snow")) {
    document.body.classList.add("snowy");
  } else if (weather.includes("sun")) {
    document.body.classList.add("sunny");
  } else {
    document.body.style.background = "linear-gradient(135deg, #6dd5fa, #2980b9)";
  }
}
