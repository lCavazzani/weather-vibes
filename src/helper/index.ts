// Helper function to convert temperatures
export const convertTemperature = (temp: number, unit: "C" | "F"): number => {
  return unit === "F" ? (temp * 9) / 5 + 32 : temp;
};
