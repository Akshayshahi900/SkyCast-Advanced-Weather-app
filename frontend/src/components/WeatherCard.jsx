import React from 'react'
import AirQuality from './ui/airquality'


const WeatherCard = ({ weatherData, city }) => {
  // Add null check for weatherData
  if (!weatherData) {
    return null
  }

  const {
    main = {},
    wind = {},
    weather = [], // Default to empty array
    sys = {},
    clouds = {},
    visibility = {},

    name
  } = weatherData

  const { temp = 0, feels_like = 0, humidity = 0, pressure = 0 } = main
  const { speed = 0 } = wind
  const cloudCoverage = clouds?.all || 5
  const tempMinCelsius = weatherData.main.temp_min;
  const icon = weatherData.weather.icon;

  // Safely access weather data
  const weatherInfo = weather[0] || {}
  const { description = weatherData.weather.description } = weatherInfo;

  // Function to capitalize the first letter of each word in a string
  const capitalizeCityName = (name) => {
    if (!name) return ''; // Return an empty string if `name` is undefined or null
    return name
      .toLowerCase()
      .split(' ') // Split the string into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back together
  };

  // Example Usage
  const capitalizedDescription = capitalizeCityName(description);
  const tempCelsius = Math.round(temp)
  const feelsLikeCelsius = Math.round(feels_like)

  const formatTime = timestamp => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  const weatherIconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`

  // <div
  //   style={{
  //     background:
  //       '',
  //     padding: '20px',
  //     borderRadius: '15px',
  //     fontstyle: 'bold',
  //     color: '',
  //     Width: '700px',
  //     Height: '330px',
  //     display: 'flex',
  //     flexDirection: '',
  //     justifyContent: 'space-between',
  //     fontFamily: 'Arial, sans-serif',
  //     boxShadow: ''
  //   }}
  // >
  return (
    <div className='flex flex-col w-[40vw]'>
      <div className="w-[40vw] flex flex-col gap-3 items-center justify-center">
        <div className="flex gap-4 w-full h-36 bg-customWhite rounded-3xl items-center">
          {/* Weather Icon */}
          <div className="flex flex-col items-center justify-center">
            <img src={weatherIconUrl} alt={description} className="w-[70px]  m-0" />
          </div>

          {/* Temperature */}
          <div className="h-28 text-2xl flex flex-col items-center justify-center">
            <div className="text-4xl font-bold flex  ">{tempCelsius}<h1 className="text-sm flex justify-center items-center">°C</h1></div>

          </div>

          {/* Weather Details */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-center">
              <h1>{capitalizedDescription}</h1>
            </div>
            <div className="flex gap-3 items-center justify-start">
              <h1>Feels Like:</h1>
              <div className='flex gap-3 items-center justify-start'>{feelsLikeCelsius}°C</div>
            </div>
          </div>
          <div className=' ml-28 '>
            <div className='mt-1 flex h-14 p-0 jusitfy-center items-center gap-1'>
              <img src='./sunrise.svg' alt='Sunset' className='font-bold  w-[20px]  ' />
              <div>{formatTime(sys.sunrise)}</div>
            </div>
            <div className='mt-1 flex h-14 p-0 justify-center items-center gap-1'>
              <img src='./sunset.svg' alt='Sunset' className='font-bold  w-[20px] ' />
              <div>{formatTime(sys.sunset)}</div>
            </div>

          </div>
        </div>
      </div>

      <div>
        <div className='weather_info w-[40vw] flex-col my-2'>
          <div className='first_row  flex w-full  h-36 items-center justify-between '>
            <div className='  bg-customWhite h-24 w-40  border rounded-3xl p-4 items-center justify-center flex flex-col '>
              <div className='flex gap-2'>
                <img src='./waterdrop.svg' alt='Humidity' className=' w-[20px]' />
                <div className='text-sm'>Humidity</div></div>
              <div className='text-lg font-bold'>{humidity}%</div>
            </div>
            <div className='  bg-customWhite h-24 w-40  border rounded-3xl p-4 items-center justify-center flex flex-col '>
              <div className='flex gap-2'>
                <img src='./pressure.svg' alt='pressure' className=' w-[20px]' />
                <div className='text-sm'>Pressure</div></div>
              <div className='text-lg font-bold'>{pressure}hPa</div>
            </div>
            <div className='  bg-customWhite h-24 w-40  border rounded-3xl p-4 items-center justify-center flex flex-col '>
              <div className='flex gap-2'>
                <img src='./visibility.svg' alt='visibility' className=' w-[20px]' />
                <div className='text-sm'>Visibility</div></div>
              <div className='text-lg font-bold'>{visibility / 1000}Km</div>
            </div>


          </div>
          <div className='second_row  flex w-full  h-36 items-center justify-between'>
            <div className='  bg-customWhite h-24 w-40  border rounded-3xl p-4 items-center justify-center flex flex-col '>
              <div className='flex gap-2'>
                <img src='./windspeed.svg' alt='wind speed' className=' w-[20px]' />
                <div className='text-sm'>Wind Speed</div></div>
              <div className='text-lg font-bold'>{speed}Km/Hr</div>
            </div>
            <div className='  bg-customWhite h-24 w-40  border rounded-3xl p-4 items-center justify-center flex flex-col '>
              <div className='flex gap-2'>
                <img src='./mintemp.svg' alt='min temperature' className=' w-[20px]' />
                <div className='text-sm'>Min Temp.</div></div>
              <div className='text-lg font-bold'>{tempMinCelsius}°C</div>
            </div>
            <div className='  bg-customWhite h-24 w-40  border rounded-3xl p-4 items-center justify-center flex flex-col '>
              <div className='flex gap-2'>
                <img src='./clouds.svg' alt='Cloudiness' className=' w-[20px]' />
                <div className='text-sm'>Cloudiness</div></div>
              <div className='text-lg font-bold'>{cloudCoverage}%</div>
            </div>




          </div>
        </div>
      </div>

      <AirQuality city={city} />


    </div>)
}

export default WeatherCard
