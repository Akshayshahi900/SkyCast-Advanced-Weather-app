require('dotenv').config()
const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())

// Root route
app.get('/', (req, res) => {
  res.send(
    'Welcome to the Weather API! Use endpoints like /api/weather, /api/time, /api/geocode, and /api/timezone.'
  )
})

// Weather API Endpoint
app.get('/api/weather', async (req, res) => {
  const { city } = req.query

  if (!city) {
    return res.status(400).json({ error: 'City is required' })
  }

  try {
    const apiKey = process.env.WEATHER_API_KEY
    const response = await axios.get(
      'http://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          q: city,
          appid: apiKey,
          units: 'metric'
        }
      }
    )

    const { main, wind, weather, sys, clouds, visibility, name, timezone } =
      response.data

    const weatherData = {
      main,
      wind,
      weather: weather[0],
      sys,
      clouds,
      visibility,
      name,
      timezone
    }

    res.json(weatherData)
  } catch (error) {
    console.error('Error fetching weather data:', error.message)
    res
      .status(500)
      .json({ error: 'Failed to fetch weather data', details: error.message })
  }
})

// Time API Endpoint
app.get('/api/time', async (req, res) => {
  const { city } = req.query

  if (!city) {
    return res.status(400).json({ error: 'City is required' })
  }

  try {
    const apiKey = process.env.TIMEZONE_API_KEY
    const geoResponse = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${apiKey}`
    )
    const { lat, lng } = geoResponse.data.results[0].geometry

    const timeResponse = await axios.get(
      `http://worldtimeapi.org/api/timezone/Etc/GMT`
    )

    const { datetime } = timeResponse.data

    res.json({ datetime })
  } catch (error) {
    console.error('Error fetching local time:', error.message)
    res
      .status(500)
      .json({ error: 'Failed to fetch local time', details: error.message })
  }
})

// Geocoding API Endpoint
app.get('/api/geocode', async (req, res) => {
  const { city } = req.query

  if (!city) {
    return res.status(400).json({ error: 'City is required' })
  }

  try {
    const geoResponse = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json`,
      {
        params: {
          q: city,
          key: process.env.GEOCODING_API_KEY
        }
      }
    )

    const geometry = geoResponse.data.results[0]?.geometry
    if (!geometry) {
      throw new Error('No geocode data found')
    }

    res.json(geometry)
  } catch (error) {
    console.error('Error fetching geocode data:', error.message)
    res
      .status(500)
      .json({ error: 'Failed to fetch geocode data', details: error.message })
  }
})

// Timezone API Endpoint
app.get('/api/timezone', async (req, res) => {
  const { lat, lng } = req.query

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ error: 'Latitude and Longitude are required' })
  }

  try {
    const response = await axios.get(
      `http://worldtimeapi.org/api/timezone/Etc/GMT${lat}`
    )
    res.json(response.data)
  } catch (error) {
    console.error('Error fetching timezone data:', error.message)
    res
      .status(500)
      .json({ error: 'Failed to fetch timezone data', details: error.message })
  }
})

// Forecast API Endpoint
app.get('/api/forecast', async (req, res) => {
  const { city } = req.query

  if (!city) {
    return res.status(400).json({ error: 'City is required' })
  }

  try {
    const apiKey = process.env.WEATHER_API_KEY
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          q: city,
          units: 'metric',
          appid: apiKey
        }
      }
    )
    res.json(response.data)
  } catch (error) {
    console.error('Error fetching weather forecast:', error.message)
    res.status(500).json({
      error: 'Error fetching weather forecast',
      details: error.message
    })
  }
})

// Weekly Weather Forecast Endpoint
app.get('/api/weekly', async (req, res) => {
  const { city } = req.query
  if (!city) {
    return res.status(400).json({ error: 'City is required.' })
  }

  try {
    const apiKey = process.env.WEATHER_API_KEY
    if (!apiKey) {
      throw new Error('Weather API key is not configured')
    }

    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/forecast',
      {
        params: {
          q: city,
          units: 'metric',
          appid: apiKey
        }
      }
    )

    const processedForecast = processWeatherData(response.data.list)
    res.json({ forecast: processedForecast })
  } catch (error) {
    console.error('Weather API Error:', error.response?.data || error.message)
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch weekly forecast data',
      details: error.response?.data?.message || error.message
    })
  }
})

// Helper function to process weather data
function processWeatherData(forecastList) {
  const dailyForecasts = {}

  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString()

    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        date,
        temp: {
          min: item.main.temp_min,
          max: item.main.temp_max
        },
        weather: item.weather[0],
        humidity: item.main.humidity
      }
    } else {
      dailyForecasts[date].temp.min = Math.min(
        dailyForecasts[date].temp.min,
        item.main.temp_min
      )
      dailyForecasts[date].temp.max = Math.max(
        dailyForecasts[date].temp.max,
        item.main.temp_max
      )
    }
  })

  return Object.values(dailyForecasts)
}

//news
app.get('/api/news', async (req, res) => {
  console.log("API endpoint hit");
  const newsApiKey = process.env.NEWS_KEY;

  // Get the limit from the query parameters, default to 12 if not provided
  const limit = parseInt(req.query.limit) || 12;

  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=weather&apiKey=${newsApiKey}`
    );

    // Log the entire response to confirm that `articles` exists
    // console.log('Full API response:', response.data);

    // If articles is an array, limit it to the specified number
    if (Array.isArray(response.data.articles)) {
      const limitedArticles = response.data.articles.slice(0, limit); // Use dynamic limit
      // console.log(`Returning ${limit} articles:`, limitedArticles);
      res.json(limitedArticles); // Return the limited articles
    } else {
      console.error('Error: articles not found or not an array');
      res.status(500).json({ error: 'Failed to process news data' });
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

async function getCoordinates(city) {

  const geocodingApiKey = process.env.GEOCODING_API_KEY; // Replace with your geocoding API key (e.g., OpenCage or Google)
  const geocodingUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${geocodingApiKey}`;

  try {
    const response = await fetch(geocodingUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch coordinates');
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return { lat, lon: lng };
    } else {
      throw new Error('City not found');
    }
  } catch (error) {
    throw new Error('Error fetching coordinates: ' + error.message);
  }
}

// Function to fetch air quality data based on city
async function fetchAirQualityData(city) {
  const apiKey = process.env.WEATHER_API_KEY;
  
  try {
    const { lat, lon } = await getCoordinates(city);
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution`,
      {
        params: {
          lat,
          lon,
          appid: apiKey
        }
      }
    );

    const components = response.data.list[0].components;
    
    // Calculate AQI based on PM2.5 and PM10 values using standard breakpoints
    const pm25 = components.pm2_5;
    const pm10 = components.pm10;
    
    // Calculate individual AQI values for PM2.5 and PM10
    const pm25Aqi = calculatePM25Aqi(pm25);
    const pm10Aqi = calculatePM10Aqi(pm10);
    
    // Overall AQI is the higher of the two values
    const aqi = Math.max(pm25Aqi, pm10Aqi);

    return {
      aqi,
      components
    };
  } catch (error) {
    throw new Error('Error fetching air quality data: ' + error.message);
  }
}

// Helper function to calculate PM2.5 AQI
function calculatePM25Aqi(pm25) {
  if (pm25 <= 12.0) return linearScale(pm25, 0, 12.0, 0, 50);
  if (pm25 <= 35.4) return linearScale(pm25, 12.1, 35.4, 51, 100);
  if (pm25 <= 55.4) return linearScale(pm25, 35.5, 55.4, 101, 150);
  if (pm25 <= 150.4) return linearScale(pm25, 55.5, 150.4, 151, 200);
  if (pm25 <= 250.4) return linearScale(pm25, 150.5, 250.4, 201, 300);
  return linearScale(pm25, 250.5, 500.4, 301, 500);
}

// Helper function to calculate PM10 AQI
function calculatePM10Aqi(pm10) {
  if (pm10 <= 54) return linearScale(pm10, 0, 54, 0, 50);
  if (pm10 <= 154) return linearScale(pm10, 55, 154, 51, 100);
  if (pm10 <= 254) return linearScale(pm10, 155, 254, 101, 150);
  if (pm10 <= 354) return linearScale(pm10, 255, 354, 151, 200);
  if (pm10 <= 424) return linearScale(pm10, 355, 424, 201, 300);
  return linearScale(pm10, 425, 604, 301, 500);
}

// Helper function to perform linear interpolation between AQI breakpoints
function linearScale(value, cLow, cHigh, iLow, iHigh) {
  return Math.round(
    ((iHigh - iLow) / (cHigh - cLow)) * (value - cLow) + iLow
  );
}



// Function to get health implications based on AQI
function getHealthImplications(aqi) {
  if (aqi <= 50) return "Air quality is satisfactory, and air pollution poses little or no risk.";
  if (aqi <= 100) return "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.";
  if (aqi <= 150) return "Members of sensitive groups may experience health effects. The general public is less likely to be affected.";
  if (aqi <= 200) return "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.";
  if (aqi <= 300) return "Health alert: The risk of health effects is increased for everyone.";
  return "Health warning of emergency conditions: everyone is more likely to be affected.";
}

// Function to get precautionary measures based on AQI
function getPrecautionaryMeasures(aqi) {
  if (aqi <= 50) return "None needed.";
  if (aqi <= 100) return "Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.";
  if (aqi <= 150) return "Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.";
  if (aqi <= 200) return "Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion; everyone else, especially children, should limit prolonged outdoor exertion.";
  if (aqi <= 300) return "Active children and adults, and people with respiratory disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should limit outdoor exertion.";
  return "Everyone should avoid all physical activity outdoors.";
}

// Route to get air quality data for a city
app.get('/api/air-quality/:city', async (req, res) => {
  const city = req.params.city;
  try {
    const airQualityData = await fetchAirQualityData(city);
    const aqi = airQualityData.aqi;

    res.json({
      city,
      aqi,
      components: airQualityData.components,
      healthImplications: getHealthImplications(aqi),
      precautionaryMeasures: getPrecautionaryMeasures(aqi)
    });
  } catch (error) {
    console.error("Error fetching air quality data:", error);
    res.status(500).json({ error: error.message });
  }
});




// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
