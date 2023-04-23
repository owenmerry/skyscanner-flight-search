export const getDateTime = (
  day: number,
  month: number,
  year: number,
  hour: number,
  minute: number,
): string => {
  return `${day}/${month}/${year} ${getTime(hour, minute)}`;
};

export const getTime = (
  hour: number,
  minute: number,
): string => {
  return `${hour}:${String(minute).padStart(2, '0')}`;
};

export const toHoursAndMinutes = (totalMinutes: number): { hours: number, minutes: number } => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}
