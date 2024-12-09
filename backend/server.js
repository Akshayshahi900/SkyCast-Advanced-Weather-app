// server.js
require('dotenv').config(); // Load environment variables
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Default to port 3000

app.use(cors()); // Enable CORS for all routes

app.get('/', (req, res) => {
  res.send('Welcome to the Weather API! Use /api/weather?city=CityName to get weather data.');
});

app.get('/api/weather', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const response = await axios.get('http://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric',
      },
    });

    const {
      main,
      wind,
      weather,
      sys,
      clouds,
      visibility,
      name,
      timezone,
    } = response.data;

    const weatherData = {
      main: {
        temp: main.temp,
        feels_like: main.feels_like,
        temp_min: main.temp_min,
        temp_max: main.temp_max,
        pressure: main.pressure,
        humidity: main.humidity,
        sea_level: main.sea_level,
        grnd_level: main.grnd_level,
      },
      wind: {
        speed: wind.speed,
        deg: wind.deg,
        gust: wind.gust,
      },
      weather: weather[0], // Get the first weather object
      sys: {
        sunrise: sys.sunrise,
        sunset: sys.sunset,
        country: sys.country,
      },
      clouds, // include clouds data
      visibility, // include visibility data
      name,
      timezone,
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data', details: error.message });
  }
});


//Api Endpoint for time

app.get('/api/time', async (req, res) => {
  try {
    // Fetch the time data for IST (Asia/Kolkata)
    const response = await axios.get('http://worldtimeapi.org/api/timezone/Asia/Kolkata');

    // Extract the current datetime from the response
    const { datetime } = response.data;

    // Convert to UTC
    const date = new Date(datetime);
    const utcDate = date.toUTCString(); // Converts to UTC string format

    // Send the UTC date back as JSON
    res.json({ utcDatetime: utcDate });
  } catch (error) {
    console.error('Error fetching time data:', error.message);
    res.status(500).json({ error: 'Failed to fetch time data', details: error.message });
  }
});
// Example of geocoding endpoint in your backend
app.get('/api/geocode', async (req, res) => {
  const city = req.query.city; // Get city from query parameters
  try {
    const geoResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=YOUR_GEOCODING_API_KEY`);
    res.json(geoResponse.data.results[0].geometry); // Adjust as necessary based on your response structure
  } catch (error) {
    console.error('Error fetching geocode data:', error);
    res.status(500).json({ error: 'Failed to fetch geocode data' });
  }
});



// Example of timezone endpoint in your backend
app.get('/api/timezone', async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const response = await axios.get(`http://worldtimeapi.org/api/timezone/Etc/GMT${lat}`);
    res.json(response.data); // Ensure you're sending JSON data
  } catch (error) {
    console.error('Error fetching timezone data:', error.message);
    res.status(500).json({ error: 'Failed to fetch timezone data', details: error.message });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
