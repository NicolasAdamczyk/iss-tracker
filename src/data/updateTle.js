// scripts/updateTle.js
import fs from 'fs'
import https from 'https'

const url = 'https://api.wheretheiss.at/v1/satellites/25544/tles?format=text'
const outputPath = './src/data/iss.tle'

https.get(url, (res) => {
	let data = ''
	res.on('data', (chunk) => (data += chunk))
	res.on('end', () => {
		// On vérifie qu'on a bien une TLE avec 3 lignes
		const lines = data.trim().split('\n')
		if (lines.length >= 3) {
			fs.writeFileSync(outputPath, data)
			console.log(`[TLE] Mis à jour avec succès à ${new Date().toISOString()}`)
		} else {
			console.error('[TLE] Erreur: TLE reçu invalide.')
		}
	})
}).on('error', (err) => {
	console.error('[TLE] Erreur de téléchargement:', err)
})
