export async function fetchISS_TLE() {
	try {
		const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544/tles?format=text')
		if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
		const data = await res.text()
		const lines = data.trim().split('\n')
		if (lines.length < 3) throw new Error('TLE invalide')
		// Renvoie uniquement les deux lignes de TLE (ligne 1 et ligne 2)
		return [lines[1], lines[2]]
	} catch (error) {
		console.error('Erreur fetch TLE:', error)
		// Ici tu peux soit rejeter l’erreur soit retourner une valeur par défaut
		throw error
	}
}
