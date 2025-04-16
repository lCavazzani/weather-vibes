"use client";

import { useState } from "react";
import Image from "next/image";
interface ImageGeneratorProps {
  prompt: string;
}

export default function ImageGenerator({ prompt }: ImageGeneratorProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Unknown error");
      }

      const { image_url } = await res.json();
      setImageUrl(image_url);
    } catch (err: unknown) {
      console.error("Image generation failed:", err);
      setError("Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center">
      {!imageUrl && !loading && (
        <button
          onClick={generateImage}
          className="bg-purple-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-purple-500 transition"
        >
          Generate City feeling Image
        </button>
      )}

      {loading && (
        <div className="mt-4">
          <svg
            className="animate-spin h-8 w-8 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      )}

      {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

      {imageUrl && (
        <div className="mt-6 border-4 border-purple-400 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.5)] block w-full h-auto">
          <div className="relative w-full h-64">
            <Image
              src={imageUrl}
              alt="Generated feeling"
              className="block w-full h-auto"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
