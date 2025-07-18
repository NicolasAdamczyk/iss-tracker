export default function ExpandableIconButton({ icon, text, onClick }) {
	return (
		<button className="expandable-icon-btn" onClick={onClick}>
			<div className="icon">{icon}</div>
			<span className="label">{text}</span>
		</button>
	);
}
