type Coordinates = {
    latitude: number;
    longitude: number;
  };
  
  export const getDistanceOfFromTo = (
    from: Coordinates,
    to: Coordinates
  ): number => {
    const toRadians = (degree: number) => (degree * Math.PI) / 180;
  
    const earthRadiusKm = 6371; // Earth's radius in kilometers
  
    const dLat = toRadians(to.latitude - from.latitude);
    const dLon = toRadians(to.longitude - from.longitude);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(from.latitude)) *
        Math.cos(toRadians(to.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return earthRadiusKm * c;
  }