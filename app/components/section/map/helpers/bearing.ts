interface Point {
  lat: number;
  lng: number;
}

export const getBearingBetweenPoints = (
  point1: Point,
  point2: Point
): number => {
  // Convert degrees to radians
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  // Convert radians to degrees
  const toDegrees = (radians: number) => radians * (180 / Math.PI);

  const lat1 = toRadians(point1.lat);
  const lon1 = point1.lng;
  const lat2 = toRadians(point2.lat);
  const lon2 = point2.lng;

  const dLon = toRadians(lon2 - lon1);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let bearing = toDegrees(Math.atan2(y, x));

  // Normalize bearing to 0-360 degrees
  bearing = (bearing + 360) % 360;

  return bearing;
};
