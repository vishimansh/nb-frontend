/**
 * Geo utilities for distance calculation, synthetic satellite coordinates, and city selection resolution.
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Calculates Haversine distance between two coordinates in kilometers.
 */
export function getDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return Infinity;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Calculates a destination coordinate given a start point, distance in km, and bearing in degrees.
 */
export function getDestinationPoint(lat, lon, distanceKm, bearingDeg) {
  const dByR = distanceKm / EARTH_RADIUS_KM;
  const bearingRad = (bearingDeg * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;

  const destLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(dByR) +
      Math.cos(latRad) * Math.sin(dByR) * Math.cos(bearingRad)
  );

  const destLonRad =
    lonRad +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(dByR) * Math.cos(latRad),
      Math.cos(dByR) - Math.sin(latRad) * Math.sin(destLatRad)
    );

  return {
    lat: Number(((destLatRad * 180) / Math.PI).toFixed(4)),
    lng: Number(((destLonRad * 180) / Math.PI).toFixed(4)),
  };
}

/**
 * Pure function to resolve selected cities:
 * - Home city is ALWAYS included and cannot be excluded.
 * - Auto cities (within radius) are included unless in excludedCityIds.
 * - Manual cities are included unless in excludedCityIds.
 */
export function resolveSelectedCities(homeCityId, autoCityIds = [], manualCityIds = [], excludedCityIds = []) {
  const excludedSet = new Set(excludedCityIds.filter((id) => id !== homeCityId));
  const result = new Set();

  if (homeCityId) {
    result.add(homeCityId);
  }

  for (const id of autoCityIds) {
    if (!excludedSet.has(id)) {
      result.add(id);
    }
  }

  for (const id of manualCityIds) {
    if (!excludedSet.has(id)) {
      result.add(id);
    }
  }

  return Array.from(result);
}
