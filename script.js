const apiKey = '28f03a7d662e4eaf58f85448481bd955'; // Your OpenWeather API Key
let pinnedCities = [];

// Request notification permission when the page loads
if (Notification.permission !== 'granted') {
  Notification.requestPermission();
}

async function getWeather() {
  const city = document.getElementById('city').value;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      const weather = data.weather[0].main.toLowerCase();
      const statusElement = document.getElementById('weather-status');
      const ledElement = document.getElementById('led');
      statusElement.textContent = `Weather in ${city}: ${data.weather[0].description}`;

      // Update LED light based on weather
      ledElement.className = 'led'; // Reset LED class
      if (weather.includes('clear')) {
        ledElement.classList.add('sunny');
      } else if (weather.includes('rain')) {
        ledElement.classList.add('rainy');
      } else if (weather.includes('storm')) {
        ledElement.classList.add('stormy');
      } else {
        ledElement.classList.add('gray');
        statusElement.textContent += ' (No alert)';
      }

      // Enable pin button after successful weather fetch
      document.getElementById('pinButton').disabled = false;
    } else {
      alert('City not found. Please try again.');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('An error occurred. Please try again later.');
  }
}

function pinCity() {
  const city = document.getElementById('city').value;
  const weatherStatus = document.getElementById('weather-status').textContent;

  // Determine the LED color based on weather status
  let ledClass = '';
  if (weatherStatus.includes('clear')) {
    ledClass = 'sunny';
  } else if (weatherStatus.includes('rain')) {
    ledClass = 'rainy';
  } else if (weatherStatus.includes('storm')) {
    ledClass = 'stormy';
  } else {
    ledClass = 'gray';
  }

  // Create a new pinned city object with LED class
  const cityData = { city, weatherStatus, ledClass };

  // Add the pinned city to the array
  pinnedCities.push(cityData);

  // Display pinned cities
  updatePinnedCities();

  // Send a notification about the newly pinned city
  sendNotification(city, weatherStatus);

  // Clear the input field and reset the pin button
  document.getElementById('city').value = '';
  document.getElementById('pinButton').disabled = true;
}

function updatePinnedCities() {
  const pinnedCitiesList = document.getElementById('pinnedCitiesList');
  pinnedCitiesList.innerHTML = ''; // Clear current list

  pinnedCities.forEach((city, index) => {
    const li = document.createElement('li');
    
    // Create LED for pinned city
    const led = document.createElement('div');
    led.className = `led ${city.ledClass}`;

    // Create city name and weather status
    const cityName = document.createElement('div');
    cityName.className = 'city-name';
    cityName.textContent = city.city.toUpperCase();

    const weatherStatus = document.createElement('div');
    weatherStatus.className = 'weather-status';
    weatherStatus.textContent = city.weatherStatus;

    // Create remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'remove-btn';
    removeBtn.onclick = () => removeCity(index);

    // Add LED, city name, weather status, and remove button to the list item
    li.appendChild(led);
    li.appendChild(cityName);
    li.appendChild(weatherStatus);
    li.appendChild(removeBtn);
    
    pinnedCitiesList.appendChild(li);

    // Send notification when pinned city weather changes
    sendNotification(city.city, city.weatherStatus);
  });
}

// Remove a pinned city
function removeCity(index) {
  pinnedCities.splice(index, 1);
  updatePinnedCities();
}

// Function to send notifications to the user
function sendNotification(city, weatherStatus) {
  if (Notification.permission === 'granted') {
    const notification = new Notification(`Weather Update for ${city}`, {
      body: weatherStatus,
      icon: 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/logo_60x60.png',
    });

    // Close notification after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
  }
}
