"use client";

import { useEffect, useState } from "react";
import WeatherCard from "../components/WeatherCard";

const cities = [
  { name: "Calgary", lat: 51.0447, lon: -114.0719 },
  { name: "Winnipeg", lat: 49.8951, lon: -97.1384 },
  { name: "São Paulo", lat: -23.5505, lon: -46.6333 },
];

const apiKey = "05e2b6d98d58551c9baf29a63fa5ad97"; // ← Replace this with your real key

type WeatherData = {
  name: string;
  main?: { temp?: number };
  weather?: { description?: string; icon?: string }[];
};

export default function Home() {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = () => {
    setLoading(true);
    setError(null);

    Promise.all(
      cities.map((city) =>
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${apiKey}`
        )
          .then((res) => {
            if (!res.ok) throw new Error(`Error for ${city.name}`);
            return res.json();
          })
          .then((data) => ({ ...data, name: city.name }))
      )
    )
      .then(setWeather)
      .catch((err) => {
        console.error("Weather fetch failed:", err);
        setError("Failed to fetch weather. Please try again later.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <p className="text-white text-lg">Loading weather data...</p>;
    }

    if (error) {
      return (
        <div className="text-center text-white">
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchWeather}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Retry
          </button>
        </div>
      );
    }

    return weather.map((data) => {
      const firstWeather = data.weather?.[0];
      return (
        <WeatherCard
          key={data.name}
          city={data.name}
          temp={data.main?.temp ? Math.round(data.main.temp) : undefined}
          description={firstWeather?.description}
          icon={firstWeather?.icon}
        />
      );
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 flex flex-wrap justify-center items-center gap-6 p-8">
      {renderContent()}
    </main>
  );
}
