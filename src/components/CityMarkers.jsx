import { useRef, useMemo, useState, useEffect } from 'react'
import { Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { latLonAltToCartesian } from '../utils/coordinates'
import { createRoundedRectGeometry } from './RoundedRect'
import {
	level1Cities,
	level2Cities,
	level3Cities
} from '../utils/citiesData'
import IssPassPredictor from './IssPassPredictor'
import { useSceneControls } from "../SceneControlsContext.jsx";

const MARKER_CONFIG = {
	baseWidth: 0.12,      // un peu plus large pour le texte
	baseHeight: 0.05,     // même hauteur
	radius: 0.028,        // rayon plus grand pour arrondir davantage
	padding: 0.02,
	baseFontSize: 0.02,
	// Adapté au thème noir/blanc
	color: '#ffffff',              // fond blanc par défaut
	hoverColor: '#ff6b6b',         // rouge pastel (hover style du bouton de fermeture)
	textColor: '#000000',          // texte noir pour contraste sur fond blanc
	// distances pour apparitions
	showLevels: {
		level1: 6.0,
		level2: 4.0,
		level3: 2.5,
	},
	fadeDistance: {
		near: 4,
		full: 4,
		far: 4
	},
	minZoomDistance: 8.0,
	maxZoomDistance: 2.0,
	minScale: 0.1,
	maxScale: 2.0,
}

export default function CityMarkers({ earthRadius }) {
	const groupRef = useRef()
	const { camera } = useThree()
	const [hovered, setHovered] = useState(null)
	const [scales, setScales] = useState({})
	const [opacities, setOpacities] = useState({})
	const rafRef = useRef()
	const [passPrediction, setPassPrediction] = useState(null);
	const { openCenterPanelWithCity, centerPanelCity } = useSceneControls()

	const roundedRectGeom = useMemo(
		() =>
			createRoundedRectGeometry(
				MARKER_CONFIG.baseWidth,
				MARKER_CONFIG.baseHeight,
				MARKER_CONFIG.radius
			),
		[]
	)

	useEffect(() => {
		const updateMarkers = () => {
			const newScales = {}
			const newOpacities = {}
			const cameraDistance = camera.position.length()
			const earthCenter = new THREE.Vector3(0, 0, 0)
			const { near, full, far } = MARKER_CONFIG.fadeDistance

			// Zoom factor entre 0 et 1 pour échelle
			const zoomFactor = THREE.MathUtils.clamp(
				(cameraDistance - MARKER_CONFIG.maxZoomDistance) /
				(MARKER_CONFIG.minZoomDistance - MARKER_CONFIG.maxZoomDistance),
				0,
				1
			)
			const currentScale = THREE.MathUtils.lerp(
				MARKER_CONFIG.minScale,
				MARKER_CONFIG.maxScale,
				zoomFactor
			)


			const visibleCities = [...level1Cities]; // toujours visibles

			if (cameraDistance <= MARKER_CONFIG.showLevels.level2) {
				visibleCities.push(...level2Cities);
			}
			if (cameraDistance <= MARKER_CONFIG.showLevels.level3) {
				visibleCities.push(...level3Cities);
			}

			// Calcul scale & opacity pour chaque ville visible
			visibleCities.forEach((city) => {
				const worldPosition = new THREE.Vector3(
					...latLonAltToCartesian(city.lat, city.lon, earthRadius)
				)
				const distanceToMarker = camera.position.distanceTo(worldPosition)

				// Fade opacity selon fadeDistance
				let opacity = 0
				if (distanceToMarker <= far) {
					opacity = 1
				} else if (distanceToMarker <= full) {
					opacity = 1 - (distanceToMarker - far) / (full - far)
				} else if (distanceToMarker <= near) {
					opacity = (near - distanceToMarker) / (near - full)
				}

				// Atténuation backside
				const cameraDir = camera.position.clone().normalize()
				const markerDir = worldPosition.clone().normalize()
				const dot = cameraDir.dot(markerDir)
				if (dot < 0) opacity *= 1 + dot

				newScales[city.name] = currentScale
				newOpacities[city.name] = THREE.MathUtils.clamp(opacity, 0, 1)
			})

			setScales(newScales)
			setOpacities(newOpacities)
			rafRef.current = requestAnimationFrame(updateMarkers)
		}

		rafRef.current = requestAnimationFrame(updateMarkers)
		return () => cancelAnimationFrame(rafRef.current)
	}, [earthRadius, camera])

	return (
		<group ref={groupRef} layers={1}>
			{[...level1Cities, ...level2Cities, ...level3Cities].map((city) => {
				const scale = scales[city.name] ?? MARKER_CONFIG.minScale
				const opacity = opacities[city.name] ?? 0
				if (opacity <= 0) return null

				const textWidth =
					city.name.length * MARKER_CONFIG.baseFontSize * 0.5
				const width = textWidth + MARKER_CONFIG.padding * 2
				const isHovered = hovered === city.name
				const bgColor = isHovered
					? MARKER_CONFIG.hoverColor
					: MARKER_CONFIG.color

				return (
					<Billboard
						key={city.name}
						position={latLonAltToCartesian(
							city.lat,
							city.lon,
							earthRadius
						)}
						layers={1}
					>
						<group scale={[scale, scale, scale]} layers={1}>
							<mesh
								geometry={roundedRectGeom}
								scale={[width / MARKER_CONFIG.baseWidth, 1, 1]}
								onPointerOver={() => {
									setHovered(city.name)
									document.body.style.cursor = 'pointer'
								}}
								onPointerOut={() => {
									setHovered(null)
									document.body.style.cursor = 'default'
								}}
								onClick={() => {
									console.log(`🔍 Calcul du prochain passage au-dessus de ${city.name}...`)
									setHovered(null)
									openCenterPanelWithCity(city) // On va déclarer ce state juste après
								}}
							>
								<meshBasicMaterial
									color={bgColor}
									transparent
									opacity={0.9 * opacity}
									side={THREE.DoubleSide}
									depthTest={true}
									depthWrite={true}
								/>
							</mesh>
							<Text
								position={[0, 0, 0.001]}
								fontSize={MARKER_CONFIG.baseFontSize}
								color={isHovered ? '#fff' : MARKER_CONFIG.textColor}
								anchorX="center"
								anchorY="middle"
								opacity={opacity}
								depthTest={true}
							>
								{city.name}
							</Text>
						</group>
					</Billboard>
				)
			})}
			{centerPanelCity && (
				<IssPassPredictor city={centerPanelCity} onPrediction={setPassPrediction} />
			)}
			<PassPredictionDispatcher prediction={passPrediction} />
		</group>
	)
}

// Nouveau composant pour dispatcher l'événement
function PassPredictionDispatcher({ prediction }) {
	useEffect(() => {
		if (!prediction) return;

		const event = new CustomEvent('iss-pass-prediction', {
			detail: prediction
		});
		window.dispatchEvent(event);
	}, [prediction]);

	return null;
}
