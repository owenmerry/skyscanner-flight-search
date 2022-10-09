export const getDateTime = (
  day: number,
  month: number,
  year: number,
  hour: number,
  minute: number,
): string => {
  return `${day}/${month}/${year} ${getTime(hour,minute)}`;
};

export const getTime = (
  hour: number,
  minute: number,
): string => {
  return `${hour}:${String(minute).padStart(2, '0')}`;
};
