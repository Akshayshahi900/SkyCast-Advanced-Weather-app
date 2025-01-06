import React, { useState, useEffect } from 'react';
import WeatherCard from './WeatherCard';
import Clock from './Clock';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateLocation,
  updateSearchedLocation,
  setWeatherData,
  clearWeatherData,
} from '../redux/weatherSlice';
import HourlyForecast from './ui/HourlyForecast';
import WeaklyForecast from './ui/WeaklyForecast';
import WeatherNews from './ui/WeatherNews';

const Weather = () => {
  const location = useSelector((state) => state.weather.location);
  const searchedLocation = useSelector((state) => state.weather.searchedLocation);
  const weatherData = useSelector((state) => state.weather.weatherData);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('hourly'); // Default to "Hourly"
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  useEffect(() => {
    const savedNotificationSetting = localStorage.getItem('notificationsEnabled');
    if (savedNotificationSetting !== null) {
      setIsNotificationsEnabled(JSON.parse(savedNotificationSetting));
    }
  }, []);

  const handleLocationChange = (event) => {
    dispatch(updateLocation(event.target.value));
  };

  const handleSearch = async () => {
    if (!location) return;

    try {
      const response = await fetch(`http://localhost:3000/api/weather?city=${location}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(setWeatherData(data));
      dispatch(updateSearchedLocation());
    } catch (error) {
      console.error('Error fetching data:', error);
      dispatch(clearWeatherData());
      alert('Failed to fetch weather data.');
    }
  };

  return (
    <div className="grid gap-8 p-6">
      {/* Search Bar */}
      <div className="flex items-center justify-center">
        <img
          onClick={handleSearch}
          className="w-10 relative left-12 cursor-pointer"
          src="./search.png"
          alt="Search"
        />
        <input
          type="text"
          value={location}
          onChange={handleLocationChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSearch();
            }
          }}
          placeholder="Search for your preferred city..."
          className="text-md w-[450px] h-10 px-14 py-2 border rounded-3xl focus:outline-none focus:ring focus:ring-gray-300"
        />
        <img
          src="./location.png"
          className="w-10 relative right-[41px] cursor-pointer bg-gray-300 border rounded-r-full"
          alt="Location"
          onClick={handleSearch}
        />
      </div>

      {/* Main Content */}
      {!searchedLocation || !weatherData ? (
        <div className="text-center p-8 rounded-xl shadow-2xl max-w-9xl mx-auto mt-10">
          <h1
            style={{
              backgroundImage: "url('./logo.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
            className="text-8xl font-bold mb-4 tracking-wider"
          >
            Welcome to SkyCast
          </h1>
          <p className="text-3xl font-medium mb-6 tracking-wide">
            Your one-stop platform for real-time weather updates.
          </p>
          <p className="text-xl italic opacity-75">
            Powered by cutting-edge weather APIs to bring you accurate and up-to-date information, wherever you are.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side: Weather and Clock */}
          <div className="space-y-6">
            <Clock cityName={searchedLocation} />
            <WeatherCard weatherData={weatherData} city={searchedLocation} />
          </div>

          {/* Right Side: Hourly or Weekly Forecast */}
          <div>
            {/* Toggle Bar Above Right-Side Content */}
            <div className="justify-center gap-4 mb-4 bg-customWhite p-4 mt-9 w-[40vw] min-h-30 flex rounded-3xl ">
              <button
                onClick={() => setActiveTab('hourly')}
                className={`px-4 py-2 rounded-xl text-lg font-semibold ${
                  activeTab === 'hourly' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                Hourly
              </button>
              <button
                onClick={() => setActiveTab('weekly')}
                className={`px-4 py-2 rounded-xl text-lg font-semibold ${
                  activeTab === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                Weekly
              </button>
            </div>
            {/* Content Based on Active Tab */}
            {activeTab === 'hourly' ? (
              <HourlyForecast city={searchedLocation} />
            ) : (
              <WeaklyForecast city={searchedLocation} />
            )}
          </div>
        </div>
      )}

      {/* Weekly Forecast and Weather News */}
      {searchedLocation && weatherData && <WeatherNews />}
    </div>
  );
};

export default Weather;
