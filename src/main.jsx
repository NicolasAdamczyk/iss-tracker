import { StrictMode } from 'react' // Importer StrictMode pour activer les vérifications supplémentaires en mode développement
import { createRoot } from 'react-dom/client' // Importer createRoot pour rendre l'application React dans le DOM
import App from './App.jsx' // Importer le composant principal de l'application
import './style.css' // Importer le fichier CSS pour les styles globaux

// Créer la racine de l'application React et rendre le composant App dans l'élément avec l'ID 'root'
// Le StrictMode est utilisé pour détecter les problèmes potentiels dans l'application, comme les effets secondaires non sécurisés ou les composants obsolètes.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
