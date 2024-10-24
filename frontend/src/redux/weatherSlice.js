import { createSlice } from '@reduxjs/toolkit';

export const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    location: '',         // Tracks the input value (user-typed city)
    searchedLocation: '', // Tracks the last searched city
    weatherData: null,    // Stores weather data fetched from API
  },
  reducers: {
    updateLocation: (state, action) => {
      state.location = action.payload;  // Update the input value
    },
    updateSearchedLocation: (state) => {
      state.searchedLocation = state.location;  // Set the searched city to current input
    },
    setWeatherData: (state, action) => {
      state.weatherData = action.payload;  // Update the weather data in the state
    },
    clearWeatherData: (state) => {
      state.weatherData = null;  // Clear weather data when no data is fetched
    },
    setWeatherData: (state, action) => {
      state.weatherData = action.payload; // Update the weather data in the state
      state.timezone = action.payload.timezone; // Assuming your weather data contains the timezone info
    },
    
  }
});

// Export the actions
export const { updateLocation, updateSearchedLocation, setWeatherData, clearWeatherData } = weatherSlice.actions;

export default weatherSlice.reducer;
