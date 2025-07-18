require('dotenv').config()
const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
app.use(cors())


const PORT = 4000
app.get('/api/iss/tle', async (req, res) => {
	console.log('Demande reçue pour /api/iss/tle')
	console.log('Tentative de connexion à Space-Track.org...')

	try {
		const response = await axios.get(
			'https://www.space-track.org/basicspacedata/query/class/tle/NORAD_CAT_ID/25544/orderby/EPOCH desc/limit/5/format/tle',
			{
				auth: {
					username: process.env.SPACE_TRACK_ID,
					password: process.env.SPACE_TRACK_PW,
				},
				responseType: 'text',
			}
		)


		console.log('--- RÉPONSE COMPLÈTE ---')
		console.dir(response, { depth: null })
		console.log('--- FIN ---')

		res.type('text/plain').send(response.data || '[Données vides]')
	} catch (err) {
		console.error('Erreur Space-Track :')
		if (err.response) {
			console.error('Status:', err.response.status)
			console.error('Data:', err.response.data)
		} else {
			console.error(err.message)
		}
		res.status(500).send('Erreur lors de la récupération du TLE')
	}
})

app.listen(PORT, () => {
	console.log(`Proxy ISS running on port ${PORT}`)
})
