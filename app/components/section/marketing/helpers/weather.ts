import type { WeatherHistoryOpenMeteoResponse } from "~/types/weather";

export type MonthlyTemperature = {
  month: string;
  averageTemperature: number;
  percentage: number;
};

export const getMonthlyAverageTemperature = (
  data: WeatherHistoryOpenMeteoResponse
): MonthlyTemperature[] => {
  const monthlyData: { [key: string]: number[] } = {};

  // Parse hourly data and group by month
  data.hourly.time.forEach((time, index) => {
    const date = new Date(time);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`; // Format: YYYY-MM

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = [];
    }

    // Truncate the temperature to only get the part before the decimal
    const temperature = Math.trunc(data.hourly.temperature_2m[index]);
    monthlyData[monthKey].push(temperature);
  });

  // Calculate the average temperature for each month
  const monthlyAverages = Object.keys(monthlyData).map((month) => {
    const monthlyTemperatures = monthlyData[month];
    const monthlyAverage =
      monthlyTemperatures.reduce((sum, temp) => sum + temp, 0) /
      monthlyTemperatures.length;

    return {
      month,
      averageTemperature: Math.trunc(monthlyAverage), // Truncate average to int
    };
  });

  // Find the minimum and maximum average temperatures for percentage calculation
  const minAverageTemperature = Math.min(
    ...monthlyAverages.map((entry) => entry.averageTemperature)
  );
  const maxAverageTemperature = Math.max(
    ...monthlyAverages.map((entry) => entry.averageTemperature)
  );

  // Calculate percentage based on linear scale between min and max temperatures
  const result: MonthlyTemperature[] = monthlyAverages.map((entry) => ({
    month: entry.month,
    averageTemperature: entry.averageTemperature,
    percentage:
      ((entry.averageTemperature - minAverageTemperature) /
        (maxAverageTemperature - minAverageTemperature)) *
      100,
  }));

  return result;
};
