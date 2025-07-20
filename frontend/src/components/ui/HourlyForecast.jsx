import React, { useState, useEffect } from "react";
import axios from "axios";
import { Cloud, CloudLightning, CloudRain, Sun } from "lucide-react";

// Helper function to get weather icon
function getWeatherIcon(description) {
  if (description.includes("rain")) {
    return <CloudRain className="w-8 h-8 text-blue-500" />;
  } else if (description.includes("cloud") && description.includes("thunder")) {
    return <CloudLightning className="w-8 h-8 text-gray-500" />;
  } else if (description.includes("cloud")) {
    return <Cloud className="w-8 h-8 text-gray-500" />;
  }
  return <Sun className="w-8 h-8 text-yellow-500" />;
}

const HourlyForecast = ({ city }) => {
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const capitalizeCityName = (name) => {
    if (!name) return ''; // Return empty if no name
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
      .join(' ');
  };
  const capitalCityName = capitalizeCityName(city);
  useEffect(() => {
    const fetchForecast = async () => {
      if (!city) {
        setError("City is required.");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL
}api/forecast?city=${city}`
        );
        setForecast(response.data.list.slice(0, 12)); // Get the next 12 hours of data
        setError("");
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Error fetching weather data.";
        setError(errorMessage);
      }
    };

    fetchForecast();
  }, [city]);

  return (
    <div className="w-[40vw] h-[125vh] overflow-auto flex flex-col bg-white rounded-xl p-6 2xl:h-[140vh]">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-900">Hourly Forecast {capitalCityName}</h2>
          {/* <p className="text-sm text-gray-500"></p> */}
        </div>
        {error && (
          <div className="p-2 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
      </div>

      <div className="w-full overflow-auto">
        <div className="space-y-4">
          {forecast.map((hour, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getWeatherIcon(hour.weather[0].description)}
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">
                      {new Date(hour.dt * 1000).toLocaleString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                    <div className="text-base font-semibold">
                      {hour.weather[0].main}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-3xl font-bold">
                    {hour.main.temp.toFixed(0)}°C
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div>Wind: {(hour.wind?.speed || 0).toFixed(0)}km/h</div>
                    <div>Humidity: {hour.main.humidity}%</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
