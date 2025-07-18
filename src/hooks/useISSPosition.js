// src/hooks/useISSPosition.js
import { useState, useEffect } from 'react' // Importer les hooks useState et useEffect de React

// Hook personnalisé pour récupérer la position de l'ISS depuis l'API
// Ce hook effectue une requête à l'API toutes les secondes pour obtenir la position actuelle de l'ISS
// Il retourne un objet contenant la latitude, la longitude, l'altitude et la vitesse de l'ISS
// La position est mise à jour en temps réel, permettant de suivre le mouvement de l'ISS en direct
export function useISSPosition() {
  const [position, setPosition] = useState(null) // État pour stocker la position de l'ISS

  // Utilisation de useEffect pour effectuer une requête à l'API toutes les secondes
  useEffect(() => {
    const interval = setInterval(() => { // Définir un intervalle pour récupérer la position de l'ISS toutes les secondes
      fetch('https://api.wheretheiss.at/v1/satellites/25544') // Faire une requête GET à l'API pour obtenir les données de l'ISS
        .then((res) => res.json()) // Convertir la réponse en JSON
        .then((data) => { // Traiter les données reçues de l'API
          setPosition({ // Mettre à jour l'état avec les données de position de l'ISS
            lat: data.latitude, // Latitude de l'ISS
            lon: data.longitude, // Longitude de l'ISS
            alt: data.altitude, // Altitude de l'ISS en mètres
            vel: data.velocity, // Vitesse de l'ISS en km/h
            visibility: data.visibility // ajout de visibility (daylight, eclipsed, etc.)
          })
        })
    }, 1000) // Intervalle de 1000 millisecondes (1 seconde)

    return () => clearInterval(interval) // Nettoyer l'intervalle lorsque le composant est démonté pour éviter les fuites de mémoire
  }, [])

  return position // Retourner la position actuelle de l'ISS
}