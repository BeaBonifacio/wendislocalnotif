const apiKey = '28f03a7d662e4eaf58f85448481bd955'; // OpenWeather API Key

// Fetch weather data from OpenWeather API
async function fetchWeather() {
  const city = document.getElementById('city').value.trim();
  if (!city) {
    alert('Please enter a city name!');
    return;
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.cod === 200) {
      displayWeather(data);
      sendNotification(city, data.weather[0].description, data.main.temp);
    } else {
      alert('City not found!');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('Failed to fetch weather data. Please try again.');
  }
}

// Display weather data on the page
function displayWeather(data) {
  const location = document.getElementById('location');
  const description = document.getElementById('weather-description');
  const temperature = document.getElementById('temperature');
  const humidity = document.getElementById('humidity');

  location.textContent = `Location: ${data.name}, ${data.sys.country}`;
  description.textContent = `Weather: ${data.weather[0].description}`;
  temperature.textContent = `Temperature: ${data.main.temp}°C`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
}

// Enable browser notifications
function enableNotifications() {
  if ('Notification' in window) {
    Notification.requestPermission()
      .then(permission => {
        if (permission === 'granted') {
          alert('Notifications enabled!');
        } else {
          alert('Notifications denied.');
        }
      })
      .catch(err => console.error('Error enabling notifications:', err));
  } else {
    alert('Browser notifications are not supported on this device.');
  }
}

// Send a browser notification
function sendNotification(city, description, temperature) {
  if (Notification.permission === 'granted') {
    const notification = new Notification('Weather Update', {
      body: `Weather in ${city}: ${description}, ${temperature}°C`,
      icon: 'https://openweathermap.org/img/wn/10d.png' // Example weather icon
    });

    // Close the notification after 5 seconds
    setTimeout(() => notification.close(), 5000);
  }
}
