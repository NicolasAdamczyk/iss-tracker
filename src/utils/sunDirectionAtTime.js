import * as satellite from 'satellite.js'
import * as THREE from "three";

export function getSunDirectionAtTime(date) {
	const gmst = satellite.gstime(date)
	const sunEci = satellite.sunEci(date)
	const sunEcf = satellite.eciToEcf(sunEci, gmst)

	return new THREE.Vector3(sunEcf.x, sunEcf.y, sunEcf.z).normalize()
}

export function isDaylight(lat, lon) {
	// Obtenir l'heure UTC en heures décimales (0-24)
	const now = new Date();
	const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;

	// Calcul simple de "longitude solaire" approximative : longitude + décalage horaire
	// Quand le soleil est à son zénith à 12h UTC à longitude 0
	// On calcule l'heure solaire locale approximative
	let solarTime = (utcHours + lon / 15) % 24; // 15° = 1 heure

	// Considérons le jour entre 6h et 18h solaire (simplification)
	return solarTime >= 6 && solarTime <= 18;
}
