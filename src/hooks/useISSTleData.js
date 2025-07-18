import { useMemo, useState, useEffect } from 'react'
import * as satellite from 'satellite.js'
import { ISS_TLE_LINES } from '../data/issTle'

export function useISSTleData() {
	const [percent, setPercent] = useState(0)
	const [orbitNumberToday, setOrbitNumberToday] = useState(0)

	const satrec = useMemo(() => {
		const [l1, l2] = ISS_TLE_LINES
		return satellite.twoline2satrec(l1, l2)
	}, [])

	const inclination = satrec.inclo * (180 / Math.PI)
	const meanMotion = satrec.no * (1440 / (2 * Math.PI)) // rad/min to rev/day
	const orbitPeriodSec = (24 * 3600) / meanMotion

	useEffect(() => {
		const update = () => {
			const now = new Date()

			// Progression dans l'orbite
			const t = satellite.jday(
				now.getUTCFullYear(),
				now.getUTCMonth() + 1,
				now.getUTCDate(),
				now.getUTCHours(),
				now.getUTCMinutes(),
				now.getUTCSeconds()
			)
			const eci = satellite.propagate(satrec, now)
			if (eci && eci.position) {
				const tsince = (t - satrec.jdsatepoch) * 1440 // minutes since TLE epoch
				const frac = (tsince % (orbitPeriodSec / 60)) / (orbitPeriodSec / 60)
				setPercent(frac * 100)
			}

			// Numéro de l'orbite du jour
			const nowUTC = now.getTime()
			const midnightUTC = new Date(Date.UTC(
				now.getUTCFullYear(),
				now.getUTCMonth(),
				now.getUTCDate()
			)).getTime()
			const secondsSinceMidnight = (nowUTC - midnightUTC) / 1000
			const orbitNum = Math.floor(secondsSinceMidnight / orbitPeriodSec) + 1
			setOrbitNumberToday(orbitNum)
		}

		update()
		const iv = setInterval(update, 1000)
		return () => clearInterval(iv)
	}, [satrec, orbitPeriodSec])

	return {
		inclination,
		orbitPeriodSec,
		percent,
		orbitNumberToday,
	}
}
