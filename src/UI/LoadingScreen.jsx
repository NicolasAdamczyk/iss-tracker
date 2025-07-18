// src/UI/LoadingScreen.jsx
import React from 'react';

export default function LoadingScreen() {
	return (
		<div
			style={{
				position: 'fixed',
				top: 0, left: 0, right: 0, bottom: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'black',
				color: 'white',
				fontSize: '2rem',
				zIndex: 999,
			}}
		>
			Loading…
		</div>
	);
}