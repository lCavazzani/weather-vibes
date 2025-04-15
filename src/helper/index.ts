// Helper function to convert temperatures
export const convertTemperature = (temp: number, unit: "C" | "F"): number => {
  return unit === "F" ? (temp * 9) / 5 + 32 : temp;
};
export const apiKey = process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY;
