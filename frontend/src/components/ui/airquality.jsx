import React, { useState, useEffect } from 'react';

const AirQualityLevel = ({ aqi }) => {
  let color, label;
  if (aqi <= 50) {
    color = 'bg-green-500';
    label = 'Good';
  } else if (aqi <= 100) {
    color = 'bg-yellow-500';
    label = 'Moderate';
  } else if (aqi <= 150) {
    color = 'bg-orange-500';
    label = 'Unhealthy for Sensitive Groups';
  } else if (aqi <= 200) {
    color = 'bg-red-500';
    label = 'Unhealthy';
  } else if (aqi <= 300) {
    color = 'bg-purple-500';
    label = 'Very Unhealthy';
  } else {
    color = 'bg-maroon-500';
    label = 'Hazardous';
  }

  return (
    <div className={`${color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
      {label}
    </div>
  );
};

function AirQuality({ city }) {
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAirQuality = async (cityName) => {
    if (!cityName) {
      setError('Please provide a city name.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL
}/api/air-quality/${cityName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch air quality data');
      }
      const data = await response.json();
      setAirQualityData(data);
     
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      setError('Failed to fetch air quality data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirQuality(city);
  }, [city]);
  const capitalizeCityName = (name) => {
    if (!name) return ''; // Return empty if no name
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
      .join(' ');
  };
  const capitalCityName = capitalizeCityName(city);

  return (
    <div className="container w-[40vw]  ">
      {/* <h2 className="text-xl font-bold">Air Quality Index for {capitalCityName}</h2> */}

      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 m"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 m"></div>
          <div className="h-8 bg-gray-200 rounded w-2/3"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      ) : airQualityData ? (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="  flex justify-between items-center  text-center">
            {/* <h3 className="text-xl font-semibold">{airQualityData.city}</h3> */}
            <AirQualityLevel aqi={airQualityData.aqi} />
            <button
              onClick={() => fetchAirQuality(capitalCityName)}
              className="mt-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Refresh Data
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">AQI</p>
              <p className="text-xl font-bold">{airQualityData.aqi}</p>
            </div>
          </div>
          <div className="mt-1">
            <h4 className="text-lg font-semibold mb-2">Health Implications</h4>
            <p className="text-gray-700">{airQualityData.healthImplications}</p>
          </div>
          <div className="mt-1">
            <h4 className="text-lg font-semibold mb-2">Precautionary Measures</h4>
            <p className="text-gray-700">{airQualityData.precautionaryMeasures}</p>
          </div>

        </div>
      ) : null}
    </div>
  );
}

export default AirQuality;
