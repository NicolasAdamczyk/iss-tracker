import React from 'react';

export default function FancyButton({ children, className = '', onClick }) {
	return (
		<button
			onClick={onClick}
			className={`fancy-btn relative overflow-hidden border border-white rounded-full px-6 py-2 font-[800] text-white text-[18px] leading-[25px] font-foundry transition-colors duration-300 ${className}`}
		>
			<span className="relative z-10 flex items-center gap-2">{children}</span>
		</button>
	);
}
