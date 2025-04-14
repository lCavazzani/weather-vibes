// components/WeatherCard.tsx
import React from "react";

type WeatherCardProps = {
  city: string;
  temp?: number;
  description?: string;
  icon?: string;
};

export default function WeatherCard({
  city,
  temp,
  description,
  icon,
}: WeatherCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg text-white flex flex-col items-center w-64">
      <h2 className="text-xl font-semibold mb-2">{city}</h2>
      {icon ? (
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={description ?? "weather"}
        />
      ) : (
        <div className="w-20 h-20 bg-white/20 rounded-full mb-2" />
      )}
      <p className="text-4xl font-bold">
        {typeof temp === "number" ? `${temp}°C` : "N/A"}
      </p>
      <p className="capitalize">{description ?? "No description"}</p>
    </div>
  );
}
