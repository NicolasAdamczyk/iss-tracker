import React, { useState, useEffect, useRef } from 'react'
import './CenterPanel.css'

export default function CenterPanel({ isVisible, children, onClose }) {
	const [shouldRender, setShouldRender] = useState(isVisible)
	const [animationClass, setAnimationClass] = useState(isVisible ? 'visible' : '')
	const panelRef = useRef(null)

	useEffect(() => {
		if (isVisible) {
			setShouldRender(true)
			setAnimationClass('visible')
		} else if (shouldRender) {
			setAnimationClass('exiting')
			const timer = setTimeout(() => setShouldRender(false), 600)
			return () => clearTimeout(timer)
		}
	}, [isVisible])

	const handleClose = () => {
		setAnimationClass('exiting')
		setTimeout(() => {
			onClose?.()
		}, 600)
	}

	// Fermer avec animation lorsqu'on clique à l'extérieur
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (panelRef.current && !panelRef.current.contains(event.target)) {
				handleClose()
			}
		}

		if (shouldRender) {
			document.addEventListener('mousedown', handleClickOutside)
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [shouldRender])

	if (!shouldRender) return null

	return (
		<div ref={panelRef} className={`center-panel ${animationClass}`}>
			<button className="center-panel-close-button" onClick={handleClose}>✖</button>
			<div className="center-panel-content">
				{children}
			</div>
		</div>
	)
}
