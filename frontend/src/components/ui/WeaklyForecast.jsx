import React, { useState, useEffect } from "react";
import axios from "axios";
import { Cloud, CloudLightning, CloudRain, Sun } from "lucide-react";

// Helper function to get weather icon
function getWeatherIcon(description) {
  if (description.includes("rain")) {
    return <CloudRain className="w-8 h-8 text-blue-500" />;
  } else if (description.includes("storm") || description.includes("thunder")) {
    return <CloudLightning className="w-8 h-8 text-gray-500" />;
  } else if (description.includes("cloud")) {
    return <Cloud className="w-8 h-8 text-gray-500" />;
  }
  return <Sun className="w-8 h-8 text-yellow-500" />;
}

// Helper function to format date
function formatDate(dateString) {
  if (!dateString) return "Invalid Date";
  
  const [day, month, year] = dateString.split('/');
  const date = new Date(year, month - 1, day);
  
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short", 
    day: "numeric"
  }).format(date);
}


const WeeklyForecast = ({ city }) => {
  const capitalizeCityName = (name) => {
    if (!name) return ''; // Return empty if no name
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
      .join(' ');
  };
  const capitalCityName = capitalizeCityName(city);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyForecast = async () => {
      if (!city) {
        setError("City is required.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/weekly?city=${encodeURIComponent(city)}`
        );
        setForecast(response.data.forecast || []);
        setError("");
      } catch (err) {
        setError("Error fetching weekly forecast.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyForecast();
  }, [city]);

  if (loading) {
    return (
      <div className="space-y-4 ">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-gray-300 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-[100px] bg-gray-300 animate-pulse" />
                <div className="h-4 w-[140px] bg-gray-300 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="w-[40vw] h-[125vh] overflow-auto bg-white rounded-xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-900">Weekly Forecast {capitalCityName}</h2>

        </div>
      </div>

      <div className="w-full overflow-auto">
        <div className="space-y-4">
          {forecast.length > 0 ? (
            forecast.map((day, index) => {
             
              return (
                <div key={index} className="p-4 bg-gray-50 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getWeatherIcon(day.weather.description)}
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-500">
                          {formatDate(day.date)}
                        </div>
                        <div className="text-base font-semibold">
                          {day.weather.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex gap-2 text-lg">
                        <span className="font-bold">{Math.round(day.temp.max)}°</span>
                        <span className="text-gray-500">{Math.round(day.temp.min)}°</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Humidity: {day.humidity}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500">
              No forecast data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyForecast;
