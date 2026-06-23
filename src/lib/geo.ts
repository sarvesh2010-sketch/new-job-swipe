/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula.
 * Returns the distance in kilometers.
 */
export function getDistanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Checks if a set of coordinates lies within a given radius (in km) from a center point.
 */
export function isWithinRadius(
  centerLat: number,
  centerLng: number,
  targetLat: number,
  targetLng: number,
  radiusInKm: number
): boolean {
  const distance = getDistanceInKm(centerLat, centerLng, targetLat, targetLng);
  return distance <= radiusInKm;
}
