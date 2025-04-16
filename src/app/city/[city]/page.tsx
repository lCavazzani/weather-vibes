// app/city/[city]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { apiKey } from "@/helper";
import ImageGenerator from "@/components/ImageGenerator";

type DetailedWeatherData = {
  name: string;
  main?: { temp?: number; humidity?: number; pressure?: number };
  weather?: { description?: string; icon?: string }[];
  wind?: { speed?: number };
};

type feelingResponse = {
  feeling: string;
  oneWordFeeling: string;
  summaryFeeling: string;
  feelingColor: string;
  song: { title: string; artist: string; youtubeLink: string };
  prompt: string;
};

export default async function CityDetail({
  params,
  searchParams,
}: {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ lat?: string; lon?: string }>;
}) {
  const { city } = await params;
  const { lat, lon } = await searchParams;

  if (!lat || !lon) {
    return notFound();
  }

  // 2. fetch the weather
  const weatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  );
  if (!weatherRes.ok) {
    console.error("Weather fetch failed:", weatherRes.status);
    return notFound();
  }
  const weatherData: DetailedWeatherData = await weatherRes.json();

  // 3. call your own /api/generate endpoint
  const genRes = await fetch(`/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: city,
      weather: weatherData.weather?.[0]?.description ?? "",
      temperature: weatherData.main?.temp,
      lat: Number(lat),
      date: new Date().toISOString(),
    }),
    cache: "no-store", // always fresh
  });

  let feelingData: feelingResponse | null = null;
  if (genRes.ok) {
    feelingData = await genRes.json();
  } else {
    console.error("Generate API failed:", genRes.status, await genRes.text());
    // you could choose notFound() or render an inline error here
  }

  // 4. render everything
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2b0a3d] via-[#4a148c] to-[#ffea00] p-8 text-white space-y-8">
      <header>
        <h1 className="text-4xl font-bold">Detailed Weather for {city}</h1>
        <Link href="/">
          <span className="text-purple-200 underline mt-2 inline-block">
            &larr; Back
          </span>
        </Link>
      </header>

      {/* Weather Section */}
      <section className="bg-black/40 backdrop-blur-lg rounded-lg p-6 space-y-4">
        <div className="flex items-center space-x-4">
          {weatherData.weather?.[0]?.icon && (
            <div className=" relative w-20 h-20">
              <Image
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={
                  weatherData.weather[0].description || "Weather Description"
                }
                layout="fill"
                objectFit="contain"
              />
            </div>
          )}
          <div>
            <p className="text-3xl font-bold">{weatherData.main?.temp}&deg;C</p>
            <p className="capitalize">
              {weatherData.weather?.[0]?.description}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>Humidity: {weatherData.main?.humidity}%</div>
          <div>Pressure: {weatherData.main?.pressure} hPa</div>
          <div>Wind Speed: {weatherData.wind?.speed} m/s</div>
        </div>
      </section>

      {/* feeling Section */}
      {feelingData ? (
        <section
          className="rounded-lg p-6"
          style={{ backgroundColor: feelingData.feelingColor }}
        >
          <h2 className="text-2xl font-semibold mb-2">
            feeling: {feelingData.oneWordFeeling}
          </h2>
          <p className="mb-4">{feelingData.summaryFeeling}</p>
          <p className="italic mb-2">
            🎵 {feelingData.song.title} — {feelingData.song.artist}
          </p>
          <a
            href={feelingData.song.youtubeLink}
            target="_blank"
            className="underline"
          >
            Listen on YouTube
          </a>
          <ImageGenerator prompt={feelingData.prompt} />
        </section>
      ) : (
        <p className="text-yellow-300">Couldn’t generate feeling right now.</p>
      )}
    </div>
  );
}
