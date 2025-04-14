// components/WeatherCard.tsx
import React from "react";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-lg shadow-md p-4 hover:scale-105 transition duration-300"
    >
      <h2 className="text-xl font-semibold mb-2">{city}</h2>
      {icon ? (
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={description ?? "weather"}
        />
      ) : (
        <div className="w-20 h-20 bg-white/20 rounded-full mb-2" />
      )}
      <h2 className="text-2xl font-semibold mt-4">
        {temp && temp.toFixed(0)}°
      </h2>
      <p className="capitalize">{description ?? "No description"}</p>
    </motion.div>
  );
}
