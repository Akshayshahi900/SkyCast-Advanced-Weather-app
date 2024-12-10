import React from 'react';
import WeatherCard from './WeatherCard';
import Clock from './Clock';
import { useSelector, useDispatch } from 'react-redux';
import { updateLocation, updateSearchedLocation, setWeatherData, clearWeatherData } from '../redux/weatherSlice';
import HourlyForecast from './Hourlyforecast';

const Weather = () => {
  const location = useSelector((state) => state.weather.location);  // Access current input
  const searchedLocation = useSelector((state) => state.weather.searchedLocation);  // Access last searched city
  const weatherData = useSelector((state) => state.weather.weatherData);  // Access weather data

  const dispatch = useDispatch();

  // Handle input change
  const handleLocationChange = (event) => {
    dispatch(updateLocation(event.target.value));  // Update the input value in Redux
  };




  const handleSearch = async () => {
    if (!location) return;  // Do nothing if input is empty

    try {
      const response = await fetch(`http://localhost:3000/api/weather?city=${location}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(setWeatherData(data));  // Save weather data in Redux
      dispatch(updateSearchedLocation());  // Save the searched city in Redux
    } catch (error) {
      console.error("Error fetching data:", error);
      dispatch(clearWeatherData());  // Clear data in case of error
      alert("Failed to fetch weather data.");
    }
  };

  return (
    <div>
      <div className='flex items-center justify-center p-2'>
        <img
          onClick={handleSearch}
          className='w-10 position relative left-12 cursor-pointer'
          src="./search.png"
          alt="Search"
        />
        <input
          type="text"
          style={{ background: 'linear-gradient(to right, rgb(58, 58, 58), rgb(48, 48, 48))' }}
          value={location} // Bind input value to Redux state
          onChange={handleLocationChange} // Call handler to update Redux state
          placeholder='Search for your preferred city...'
          className='text-md text-gray-400 w-[450px] py-6 h-10 px-14 border-2 rounded-[20px] focus:border-2-gray-600'
        />

        <button
          style={{ backgroundColor: 'rgba(76, 187, 23, 1)' }}
          className="border rounded-3xl flex items-center gap-1 m-2 text-white font-semibold py-2 px-4 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition-all"
          onClick={handleSearch} // Use the search function
        >
          <img src="./location.png" className='w-8' alt="Location" />
          <h1 className='text-md'> Search Location</h1>
        </button>
      </div>

      <div className='flex gap-4 justify-around'>
        {searchedLocation && weatherData ? <Clock cityName={searchedLocation} /> : null}
        {searchedLocation && weatherData ? (
          <WeatherCard weatherData={weatherData} />
        ) : (
          <div
            // style={{ background: 'linear-gradient(to right, rgb(58, 58, 58), rgb(48, 48, 48))' }}
            className='text-white text-center  p-8 rounded-xl shadow-2xl max-w-9xl mx-auto mt-10'>
            <h1 style={{
              backgroundImage: "url('./logo.jpg')", // Add your image URL here
              backgroundSize: 'cover', // Ensures the image covers the text
              backgroundPosition: 'center', // Centers the background image
              backgroundClip: 'text', // Clips the background to the text
              WebkitBackgroundClip: 'text', // For webkit browsers
              color: 'transparent', // Makes the text transparent to show the background
            }} className='text-8xl font-bold mb-4 tracking-wider'>Welcome to SkyCast</h1>
            <p className='text-3xl font-medium mb-6 tracking-wide'>
              Your one-stop platform for real-time weather updates.
            </p>

            <p className='text-xl italic opacity-75'>
              Powered by cutting-edge weather APIs to bring you accurate and up-to-date information, wherever you are.
            </p>

          </div>

        )}
      </div>
      <HourlyForecast location={searchedLocation} />

    </div>



  );
};

export default Weather;
