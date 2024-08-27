import moment from "moment";

export const getDateTime = (
  day: number,
  month: number,
  year: number,
  hour: number,
  minute: number,
  format: string = 'YYYY-MM-DD HH:mm'
): string => {
  return moment(`${year}-${month}-${day} ${hour}:${minute}`, 'YYYY-M-D HH:mm').format(format);
};

export const getDateTimeFormat = (
  date: string,
  format: string = 'ddd, D MMM HH:mm'
): string => {
  return moment(`${date}`, 'YYYY-MM-DD HH:mm').format(format);
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

export const getTimeDuration = (departure: string, arrival?: string): string | undefined => {
  if(!arrival) return undefined;
  const departureTime = moment(departure, "YYYY-MM-DD HH:mm");
  const arrivalTime = moment(arrival, "YYYY-MM-DD HH:mm");
  const duration = moment.duration(arrivalTime.diff(departureTime));
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();

  let result = '';
  if (hours > 0 && minutes > 0) {
      result = `${hours}h ${minutes}m`;
  } else if (hours > 0) {
      result = `${hours}h`;
  } else if (minutes > 0) {
      result = `${minutes}m`;
  } else {
      result = '0m';
  }

  return result;
}

export const getMinutesToDuration = (minutesConvert: number): string => {
  const duration = moment.duration(minutesConvert, 'minutes');
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();

  let result = '';
  if (hours > 0 && minutes > 0) {
      result = `${hours}h ${minutes}m`;
  } else if (hours > 0) {
      result = `${hours}h`;
  } else if (minutes > 0) {
      result = `${minutes}m`;
  } else {
      result = '0m';
  }

  return result;
}

export const getTimeDurationMoment = (departure: string, arrival?: string): moment.Duration | undefined => {
  if(!arrival) return undefined;
  const departureTime = moment(departure, "YYYY-MM-DD HH:mm");
  const arrivalTime = moment(arrival, "YYYY-MM-DD HH:mm");
  const duration = moment.duration(arrivalTime.diff(departureTime));

  return duration;
}
