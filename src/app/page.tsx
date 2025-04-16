"use client";

import { useEffect, useState } from "react";
import WeatherCard from "../components/WeatherCard";
import WeatherCardSkeleton from "@/components/WeatherCardSkeleton";
import CitySearch from "../components/CitySearch";
import { apiKey } from "@/helper";

const initialCities = [
  { name: "Calgary", lat: 51.0447, lon: -114.0719 },
  { name: "Winnipeg", lat: 49.8951, lon: -97.1384 },
  { name: "São Paulo", lat: -23.5505, lon: -46.6333 },
];

type WeatherData = {
  name: string;
  coord: {
    lon: number;
    lat: number;
  };
  main?: { temp?: number };
  weather?: { description?: string; icon?: string }[];
};

export default function Home() {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<"C" | "F">("C");

  // Convert temperature to Fahrenheit if needed.
  const convertTemperature = (temp: number, unit: "C" | "F"): number =>
    unit === "F" ? Math.round((temp * 9) / 5 + 32) : temp;

  // Fetch weather for a list of given cities.
  const fetchInitialWeather = () => {
    setLoading(true);
    setError(null);

    Promise.all(
      initialCities.map((city) =>
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
    fetchInitialWeather();
  }, []);

  // Handle a new city search selection.
  const handleCitySelect = async (city: {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
  }) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${apiKey}`
      );
      if (!res.ok) throw new Error(`Error fetching weather for ${city.name}`);
      const data = await res.json();
      // Attach the city name from the geocoding API if needed.
      const updatedData = { ...data, name: city.name };
      // Append the new city's weather data to the list.
      setWeather((prev) => [...prev, updatedData]);
    } catch (err) {
      console.error("Error fetching new city weather:", err);
      alert("Could not fetch the weather for this city. Please try again.");
    }
  };

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
            onClick={fetchInitialWeather}
            className="text-sm font-bold text-purple-300 border border-purple-300 px-4 py-2 rounded hover:bg-purple-300 hover:text-black transition duration-300"
          >
            Retry
          </button>
        </div>
      );
    }
    const removeCard = (cityName: string) => {
      setWeather((prev) => prev.filter((data) => data.name !== cityName));
    };
    return (
      <>
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
                lat={data.coord.lat}
                lon={data.coord.lon}
                temp={displayTemp}
                description={firstWeather?.description}
                icon={firstWeather?.icon}
                onRemove={() => removeCard(data.name)}
              />
            );
          })}
        </div>
        <div className="flex w-full max-w-4xl justify-center">
          <button
            onClick={() => setUnit((prev) => (prev === "C" ? "F" : "C"))}
            className="text-sm font-bold text-purple-300 border border-purple-300 px-4 py-2 rounded hover:bg-purple-300 hover:text-black transition duration-300"
          >
            Switch to {unit === "C" ? "Fahrenheit" : "Celsius"}
          </button>
        </div>
      </>
    );
  };

  return (
    <div className=" bg-gradient-to-br from-[#2b0a3d] via-[#4a148c] to-[#ff8800]">
      <header className="sticky top-0 z-50 w-full py-4 bg-gradient-to-r from-[#4a148c] to-[#ff8800] shadow-md mb-6 justify-items-center">
        <h1 className="px-4 text-center md:text-left text-4xl font-bold text-white">
          Weather Vibes
        </h1>
      </header>
      <main className="min-h-screen flex flex-col justify-center items-center gap-6">
        {!error && <CitySearch onCitySelect={handleCitySelect} />}
        {renderContent()}
      </main>
    </div>
  );
}
