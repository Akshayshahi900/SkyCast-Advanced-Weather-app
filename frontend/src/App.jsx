import React from 'react'
import Weather from './components/Weather.jsx'
// import HourlyForecast from './components/Hourlyforecast.jsx'


const App = () => {

  return (
    <div className='p-6 bg-customGray'>
      <div style={{

        background: '',
      }} className='min-h-[100vh]'>



        <Weather />
        
      </div>
    </div>
  )
}

export default App
