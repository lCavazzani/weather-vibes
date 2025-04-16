// components/WeatherCard.tsx
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

type WeatherCardProps = {
  city: string;
  onRemove?: () => void;
  temp?: number;
  description?: string;
  icon?: string;
  lat: number;
  lon: number;
};

export default function WeatherCard({
  city,
  temp,
  description,
  icon,
  onRemove,
  lat,
  lon,
}: WeatherCardProps) {
  return (
    <Link
      key={city}
      href={{
        pathname: `/city/${encodeURIComponent(city)}`,
        query: {
          lat: lat,
          lon: lon,
        }, // Use your actual lat/lon values; below is a placeholder
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-black/40 backdrop-blur-lg rounded-lg p-6 border-2 border-purple-400 shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
      >
        <h2 className="text-2xl text-white text-center mt-4">{city}</h2>
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 text-white hover:text-red-500 transition"
            aria-label={`Remove ${city}`}
          >
            &#10005;
          </button>
        )}
        {icon ? (
          <div className="relative w-20 h-20 mx-auto mb-2">
            <Image
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={description ?? "weather"}
              layout="fill"
              objectFit="contain"
            />
          </div>
        ) : (
          <div className="w-20 h-20 bg-white/20 rounded-full mb-2" />
        )}
        <p className="text-4xl font-bold text-white text-center">
          {temp && temp.toFixed(0)}°
        </p>{" "}
        <p className="text-sm text-purple-200 text-center capitalize">
          {description ?? "No description"}
        </p>
      </motion.div>
    </Link>
  );
}
