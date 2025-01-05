import moment from "moment";

type AggregatedData = {
  time: string;
  totalPrice: number;
  count: number;
  percentage: number;
};

type BarChartData = {
  aggregatedData: AggregatedData[];
  maxPrice: number;
  minPrice: number;
  firstDate: string;
  lastDate: string;
};

type PriceHistory = {
  id: number;
  searchHash: string;
  price: number;
  created_at: string;
  updated_at: string;
};

export const buildBarChartData = (
  priceHistory: PriceHistory[],
  interval: "hour" | "day",
  maxPercentage: number,
  minPercentage: number,
): BarChartData => {
  const aggregatedData: { [key: string]: AggregatedData } = {};
  const flightData = priceHistory.map((item) => ({
    price: item.price,
    date: item.created_at,
    depart: item.searchHash.split("-")[3],
    return: item.searchHash.split("-")[4],
  }));

  flightData.forEach((flight) => {
    const flightMoment = moment(flight.date);
    // Format the key based on the interval
    const timeKey = interval === 'hour'
      ? flightMoment.format('YYYY-MM-DD HH') // Group by hour
      : flightMoment.format('YYYY-MM-DD');  // Group by day

    if (!aggregatedData[timeKey]) {
      aggregatedData[timeKey] = {
        time: timeKey,
        totalPrice: 0,
        count: 0,
        percentage: 0, // We will calculate this later
      };
    }

    // Add the price to the total for the time interval
    aggregatedData[timeKey].totalPrice += flight.price;
    aggregatedData[timeKey].count += 1;
  });

  // Calculate the maximum and minimum prices
  const allPrices = flightData.map(flight => flight.price);
  const maxPrice = Math.max(...allPrices);
  const minPrice = Math.min(...allPrices);

  // Create an array and calculate average price per interval
  const aggregatedArray = Object.values(aggregatedData).map(data => ({
    time: data.time,
    totalPrice: data.totalPrice / data.count, // Average price for the time interval
    count: data.count,
    percentage: 0 // Placeholder for now
  }));

  // Calculate the percentage for each bar based on the price range (min -> max)
  const priceRange = maxPrice - minPrice;
  const percentageRange = maxPercentage - minPercentage;

  const aggregatedWithPercentage = aggregatedArray.map(data => {
    const price = data.totalPrice;

    // Calculate percentage based on price, scaled between minPercentage and maxPercentage
    const percentage = priceRange === 0
      ? maxPercentage // In case all prices are the same, set to maxPercentage
      : ((price - minPrice) / priceRange) * percentageRange + minPercentage;

    return {
      ...data,
      percentage
    };
  });

  // Sort by time (whether 'hour' or 'day')
  const sortedData = aggregatedWithPercentage.sort((a, b) => moment(a.time).valueOf() - moment(b.time).valueOf());

  const firstDate = aggregatedWithPercentage[0]?.time;
  const lastDate =
    aggregatedWithPercentage[aggregatedWithPercentage.length - 1]?.time;

  return {
    aggregatedData: sortedData,
    maxPrice,
    minPrice,
    firstDate,
    lastDate,
  };
};
