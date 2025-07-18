export function toggleFullscreen() {
	const elem = document.documentElement; // ou un élément spécifique si tu veux pas tout l'écran

	if (!document.fullscreenElement) {
		elem.requestFullscreen().catch((err) => {
			console.error(`Erreur lors de l'activation du plein écran : ${err.message}`);
		});
	} else {
		document.exitFullscreen();
	}
}