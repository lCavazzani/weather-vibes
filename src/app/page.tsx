"use client";

import { useEffect, useState } from "react";
import WeatherCard from "../components/WeatherCard";
import WeatherCardSkeleton from "@/components/WeatherCardSkeleton";

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
  const [unit, setUnit] = useState<"C" | "F">("C");

  // Helper to convert Celsius to Fahrenheit if needed.
  const convertTemperature = (temp: number, unit: "C" | "F"): number => {
    return unit === "F" ? Math.round((temp * 9) / 5 + 32) : temp;
  };

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
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <WeatherCardSkeleton />
          <WeatherCardSkeleton />
          <WeatherCardSkeleton />
        </div>
      );
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

    return (
      <>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setUnit((prev) => (prev === "C" ? "F" : "C"))}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Switch to {unit === "C" ? "Fahrenheit" : "Celsius"}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weather.map((data) => {
            const firstWeather = data.weather?.[0];
            const originalTemp = data.main?.temp;
            const displayTemp =
              originalTemp !== undefined
                ? convertTemperature(originalTemp, unit)
                : undefined;
            return (
              <WeatherCard
                key={data.name}
                city={data.name}
                temp={displayTemp}
                description={firstWeather?.description}
                icon={firstWeather?.icon}
              />
            );
          })}
        </div>
      </>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 flex flex-col justify-center items-center gap-6 p-8">
      {renderContent()}
    </main>
  );
}
