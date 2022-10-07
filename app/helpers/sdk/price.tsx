export const getPrice = (amount: string, unit: string): string => {
  const map: { [key: string]: number } = {
    PRICE_UNIT_WHOLE: 1,
    PRICE_UNIT_CENTI: 100,
    PRICE_UNIT_MILLI: 1000,
    PRICE_UNIT_MICRO: 1000000,
  };
  if (unit === 'PRICE_UNIT_UNSPECIFIED') return 'No price';

  const price = (Number(amount) / map[unit]).toFixed(2);

  return `£${price}`;
};
