import React from 'react';
const WeatherCard = ({ weatherData }) => {
  // Destructure properties from weatherData
  const {
    main = {}, // Default to an empty object if main is undefined
    wind = {}, // Default to an empty object if wind is undefined
    weather = [{}], // Default to an array with an empty object if weather is undefined
    sys = {}, // Default to an empty object if sys is undefined
    clouds = {}, // Default to an empty object if clouds is undefined
    visibility,
    name,
  } = weatherData;


  // Destructure values safely
  const { temp, feels_like, humidity, pressure, sea_level, grnd_level } = main;
  const { speed, deg, gust } = wind;
  // const { description, icon } = weather[0]; // Get the first weather object
  const cloudCoverage = clouds.all || 0; // Default to 0 if undefined

  // Convert temperature from Kelvin to Celsius
  const tempCelsius = Math.round(temp);
  const feelsLikeCelsius = Math.round(feels_like);

  // Convert sunrise and sunset times from UNIX timestamp to local time
  const formatTime = (timestamp) => new Date(timestamp * 1000).toLocaleTimeString();



  return <>
    <div
      style={{
        background: 'linear-gradient(to right, rgb(58, 58, 58), rgb(48, 48, 48))',
        padding: '20px',
        borderRadius: '15px',
        fontstyle: 'bold',
        color: '#fff',
        Width: '700px',
        Height: '330px',
        display: 'flex',
        flexDirection: '',
        justifyContent: 'space-between',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '15px 18px 19px rgba(15,15,15, 0.89)'
      }}
    >
      <div className="flex flex-col">
        <div className="bg-gradient-to-r from-slate-100 to-slate-600 bg-clip-text text-transparent text-8xl font-bold">
          {tempCelsius}°C
        </div>
        <div className="bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent text-2xl font-bold opacity-70">
          Feels like: {feelsLikeCelsius}°C
        </div>
        <div className=" mt-14">
          <img src="./sunrise.png" alt="Sunrise" className="font-bold" />
          <div>Sunrise:{formatTime(sys.sunrise)}</div>
        </div>
        <div className=" mt-4">
          <img src="./sunset.png" alt="Sunset" className="font-bold" />
          <div>Sunset: {formatTime(sys.sunset)}</div>
        </div>
      </div>


      <div className="flex flex-col  my-5">
        <img
          src="./weathericon.png"
          alt="Weather Icon"
          className="w-[270px]"
        />
        <div className="ml-2 text-3xl text-center">
          <h1 className='font-bold'>Sunny</h1>
        </div>
      </div>

      <div className="flex flex-col  ">
        <div className='flex gap-9 my-4'>
          <div className="font-bold">
            <img src="./humidity.png" alt="Humidity" className="" />
            <div>{humidity}%</div>
            <div>Humidity</div>
          </div>
          <div className="font-bold">
            <img src="./pressure.png" alt="Pressure" className="" />
            <div>{pressure} hPa</div>
            <div>Pressure</div>
          </div>
        </div>
        <div className='flex gap-9 my-4'>
          <div className="font-bold">
            <img src="./windspeed.png" alt="Wind Speed" className="" />
            <div>{speed} km/h</div>
            <div>Wind Speed</div>
          </div>
          <div className="font-bold">
            <img style={{ width: '50px', height: '60px' }}

              src="./clouds.png" alt="Wind Speed" className="" />
            <div>{cloudCoverage} %</div>
            <div>Cloudiness</div>
          </div>
        </div>
      </div>

    </div>
  </>;
}
export default WeatherCard;