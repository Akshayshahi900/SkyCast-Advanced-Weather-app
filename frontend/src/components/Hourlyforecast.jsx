import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Cloud, CloudRain, Sun } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";

const WeatherIcon = ({ condition }) => {
  switch (condition) {
    case "sunny":
      return <Sun className="h-6 w-6 text-yellow-400" />;
    case "cloudy":
      return <Cloud className="h-6 w-6 text-gray-400" />;
    case "rainy":
      return <CloudRain className="h-6 w-6 text-blue-400" />;
    default:
      return <Cloud className="h-6 w-6 text-gray-400" />;
  }
};

const HourlyForecast = ({ location }) => {
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const fetchWeatherData = async (location) => {
    try {
      const apiKey = "a53101a110d948510b69e1a997d824a3";
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();

      const hourlyData = data.list.slice(0, 24).map((entry) => ({
        time: new Date(entry.dt * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          hour12: true,
        }),
        temperature: Math.round(entry.main.temp),
        condition: entry.weather[0].main.toLowerCase(),
      }));

      setHourlyForecast(hourlyData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      fetchWeatherData(location);
    }
  }, [location]);

  const maxScroll = Math.max(0, hourlyForecast.length * 80 - 320);

  const handleScroll = (direction) => {
    setScrollPosition((prev) =>
      direction === "left"
        ? Math.max(0, prev - 80)
        : Math.min(maxScroll, prev + 80)
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (hourlyForecast.length === 0) return <div>No data available</div>;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Hourly Forecast</CardTitle>
        <CardDescription>Weather forecast for the next 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-background/80 p-2 backdrop-blur-sm"
          disabled={scrollPosition === 0}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${scrollPosition}px)` }}
          >
            {hourlyForecast.map((forecast, index) => (
              <div
                key={index}
                className="flex w-20 flex-col items-center justify-center p-4"
              >
                <span className="text-sm font-medium">{forecast.time}</span>
                <WeatherIcon condition={forecast.condition} />
                <span className="text-lg font-bold">
                  {forecast.temperature}°C
                </span>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-background/80 p-2 backdrop-blur-sm"
          disabled={scrollPosition >= maxScroll}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </CardContent>
    </Card>
  );
};

export default HourlyForecast;
