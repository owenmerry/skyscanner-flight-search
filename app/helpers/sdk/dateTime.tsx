export const getDateTime = (
  day: number,
  month: number,
  year: number,
  hour: number,
  minute: number,
): string => {
  return `${day}/${month}/${year} ${hour}:${String(minute).padStart(2, '0')}`;
};
