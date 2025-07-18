import React, { useEffect, useState } from "react";

const CurrentCountry = ({ lat, lon }) => {
	const [countryName, setCountryName] = useState("Loading...");
	const [countryCode, setCountryCode] = useState(null);

	useEffect(() => {
		if (!lat || !lon) return;

		const fetchCountry = async () => {
			try {
				const response = await fetch(
					`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=5&addressdetails=1&accept-language=en`,
					{
						headers: {
							"User-Agent": "ISSLiveApp/1.0 (ton-email@example.com)",
						},
					}
				);

				const data = await response.json();

				if (data?.address?.country) {
					setCountryName(data.address.country);
					setCountryCode(data.address.country_code?.toUpperCase());
				} else {
					setCountryName("Ocean");
					setCountryCode(null);
				}
			} catch (error) {
				console.error("Error fetching country:", error);
				setCountryName("Error");
			}
		};

		fetchCountry();
	}, [lat, lon]);

	return (
		<div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
			<span>{countryName}</span>
			{countryCode && (
				<img
					src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
					alt={`Flag of ${countryName}`}
					style={{ width: "24px", height: "16px", objectFit: "cover", borderRadius: "2px" }}
				/>
			)}
		</div>
	);
};

export default CurrentCountry;
