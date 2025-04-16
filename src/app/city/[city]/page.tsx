// app/city/[city]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { apiKey } from "@/helper";

type DetailedWeatherData = {
  name: string;
  main?: { temp?: number; humidity?: number; pressure?: number };
  weather?: { description?: string; icon?: string }[];
  wind?: { speed?: number };
};

interface CityDetailProps {
  params: { city: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CityDetail({
  params,
  searchParams,
}: CityDetailProps) {
  // Await before destructuring
  const { city } = await Promise.resolve(params);
  const { lat, lon } = await Promise.resolve(searchParams);

  if (!lat || !lon) {
    return notFound();
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const res = await fetch(url);

  if (!res.ok) {
    return notFound();
  }

  const data: DetailedWeatherData = await res.json();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2b0a3d] via-[#4a148c] to-[#ffea00] p-8 text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Detailed Weather for {city}</h1>
        <Link href="/">
          <span className="text-purple-200 underline mt-2 inline-block">
            &larr; Back to Home
          </span>
        </Link>
      </header>
      <section className="bg-black/40 backdrop-blur-lg rounded-lg p-6">
        <div className="flex items-center">
          {data.weather?.[0]?.icon && (
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt={data.weather[0].description}
              className="w-20 h-20"
            />
          )}
          <div className="ml-4">
            <p className="text-3xl font-bold">{data.main?.temp}&deg;C</p>
            <p className="capitalize">{data.weather?.[0]?.description}</p>
          </div>
        </div>
        <div className="mt-4">
          <p>Humidity: {data.main?.humidity}%</p>
          <p>Pressure: {data.main?.pressure} hPa</p>
          <p>Wind Speed: {data.wind?.speed} m/s</p>
        </div>
      </section>
    </div>
  );
}
