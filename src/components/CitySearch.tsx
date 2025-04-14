// components/CitySearch.tsx
"use client";

import { apiKey } from "@/helper";
import { useEffect, useRef, useState } from "react";

// Define the interface for a city suggestion returned by the geocoding API
interface CitySuggestion {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

interface CitySearchProps {
  onCitySelect: (city: CitySuggestion) => void;
}

const CitySearch: React.FC<CitySearchProps> = ({ onCitySelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions from the OpenWeather geocoding API
  const fetchCitySuggestions = async (q: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${apiKey}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Error fetching city suggestions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 2) {
      fetchCitySuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (city: CitySuggestion) => {
    setQuery(city.name);
    setSuggestions([]);
    onCitySelect(city);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);
  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto mb-6">
      <input
        type="text"
        placeholder="Search for a city..."
        value={query}
        onChange={handleInputChange}
        className="w-full px-4 py-2 rounded shadow border border-purple-400 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 bg-gray-300 border border-purple-400 mt-1 rounded z-10">
          {suggestions.map((city, index) => (
            <li
              key={index}
              onClick={() => handleSelect(city)}
              className="px-4 py-2 cursor-pointer hover:bg-purple-600 hover:text-white"
            >
              {city.name}
              {city.state ? `, ${city.state}` : ""}, {city.country}
            </li>
          ))}
        </ul>
      )}
      {isLoading && (
        <div className="mt-2 text-sm text-gray-400">Loading...</div>
      )}
    </div>
  );
};

export default CitySearch;
