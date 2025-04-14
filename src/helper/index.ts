// Helper function to convert temperatures
export const convertTemperature = (temp: number, unit: "C" | "F"): number => {
  return unit === "F" ? (temp * 9) / 5 + 32 : temp;
};
export const apiKey = "05e2b6d98d58551c9baf29a63fa5ad97"; // ← Replace this with your real key
