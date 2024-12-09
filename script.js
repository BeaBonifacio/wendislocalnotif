const apiKey = '28f03a7d662e4eaf58f85448481bd955'; // OpenWeather API Key
let savedCities = []; // List of saved locations

// Add a city to the list
function addCity() {
  const city = document.getElementById('city').value.trim();
  if (!city) {
    alert('Please enter a city name!');
    return;
  }

  // Prevent duplicates
  if (savedCities.includes(city)) {
    alert(`${city} is already in your saved locations!`);
    return;
  }

  savedCities.push(city);
  updateSavedLocations();
  document.getElementById('city').value = ''; // Clear input field
}

// Update the saved locations display
function updateSavedLocations() {
  const locationList = document.getElementById('location-list');
  locationList.innerHTML = ''; // Clear current list

  savedCities.forEach(city => {
    const li = document.createElement('li');
    li.textContent = city;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.onclick = () => removeCity(city);

    li.appendChild(removeButton);
    locationList.appendChild(li);
  });
}

// Remove a city from the list
function removeCity(city) {
  savedCities = savedCities.filter(savedCity => savedCity !== city);
  updateSavedLocations();
}

// Enable browser notifications
function enableNotifications() {
  if ('Notification' in window) {
    Notification.requestPermission()
      .then(permission => {
        if (permission === 'granted') {
          alert('Notifications enabled!');
          startWeatherMonitoring();
        } else {
          alert('Notifications denied.');
        }
      })
      .catch(err => console.error('Error enabling notifications:', err));
  } else {
    alert('Browser notifications are not supported on this device.');
  }
}

// Start monitoring weather for saved cities
function startWeatherMonitoring() {
  setInterval(() => {
    savedCities.forEach(city => {
      fetchWeather(city);
    });
  }, 600000); // Check every 10 minutes
}

// Fetch weather data and send notification
async function fetchWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.cod === 200) {
      sendNotification(city, data.weather[0].description, data.main.temp);
    }
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error);
  }
}

// Send a browser notification
function sendNotification(city, description, temperature) {
  if (Notification.permission === 'granted') {
    const notification = new Notification(`Weather Update: ${city}`, {
      body: `Current Weather: ${description}, Temp: ${temperature}°C`,
      icon: 'https://openweathermap.org/img/wn/10d.png' // Example weather icon
    });

    // Close the notification after 5 seconds
    setTimeout(() => notification.close(), 5000);
  }
}
