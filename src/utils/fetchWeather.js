// utils/fetchWeather.js
export async function fetchWeatherAtTime(lat, lon, timestamp, apiKey = '11786111520a2445cff1b163c383f320') {
	const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
	console.log(url);
	const response = await fetch(url)
	if (!response.ok) throw new Error('Erreur météo')

	const data = await response.json()

	// Cherche la prévision la plus proche du passage
	const targetTime = Math.floor(timestamp / 1000)
	let closest = data.list[0]

	for (const forecast of data.list) {
		if (Math.abs(forecast.dt - targetTime) < Math.abs(closest.dt - targetTime)) {
			closest = forecast
		}
	}

	return {
		condition: closest.weather[0].description,
		icon: `https://openweathermap.org/img/wn/${closest.weather[0].icon}@2x.png`,
		clouds: closest.clouds.all, // pourcentage
		visibility: closest.visibility, // en mètres
	}
}