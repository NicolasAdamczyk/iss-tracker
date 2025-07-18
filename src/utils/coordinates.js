// src/utils/coordinates.js
export const EARTH_RADIUS_KM = 6371; // Rayon moyen de la Terre en kilomètres
export const EARTH_RADIUS_UNIT = 1 // Rayon de la Terre en unités de scène (1 unité = 1 rayon de Terre, donc 1 unité = 6371 km)

// Convertit les coordonnées géographiques (latitude, longitude, altitude) en coordonnées cartésiennes (x, y, z)
// lat: latitude en degrés, lon: longitude en degrés, radius: rayon de la sphère (en unités de la scène, par exemple, 1 unité = 1 rayon de Terre)
// Retourne un tableau [x, y, z] représentant les coordonnées cartésiennes
export function latLonAltToCartesian(lat, lon, radius) {
  const latRad = (lat * Math.PI) / 180 // Convertit la latitude de degrés en radians
  const lonRad = (-lon * Math.PI) / 180 // Convertit la longitude de degrés en radians (négatif pour correspondre à la convention mathématique)

  const x = radius * Math.cos(latRad) * Math.cos(lonRad) // Calcul de la coordonnée x
  const y = radius * Math.sin(latRad) // Calcul de la coordonnée y
  const z = radius * Math.cos(latRad) * Math.sin(lonRad) // Calcul de la coordonnée z

  return [x, y, z] // Retourne les coordonnées cartésiennes sous forme de tableau
}
