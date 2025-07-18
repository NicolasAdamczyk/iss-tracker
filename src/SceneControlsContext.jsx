import React, { createContext, useContext, useState } from 'react';

const SceneControlsContext = createContext();

export const SceneControlsProvider = ({ children }) => {
    const [focusTarget, setFocusTarget] = useState('earth');
    const [zoomDelta, setZoomDelta] = useState(0); // 0 par défaut
    const [showGridLines, setShowGridLines] = useState(false); // false par défaut
    const [recenterCameraRequested, setRecenterCameraRequested] = useState(false);
    const [thermalView, setThermalView] = useState(false)
    const [centerPanelCity, setCenterPanelCity] = useState(null)

    const zoomIn = () => setZoomDelta(0.5)
    const zoomOut = () => setZoomDelta(-0.5)
    const toggleGridLines = () => setShowGridLines(prev => !prev);
    const recenterCamera = () => setRecenterCameraRequested(true)
    const openCenterPanelWithCity = (city) => setCenterPanelCity(city)
    const closeCenterPanel = () => setCenterPanelCity(null)

    return (
        <SceneControlsContext.Provider value={{
            focusTarget, setFocusTarget,
            zoomDelta, setZoomDelta, zoomIn, zoomOut,
            showGridLines, toggleGridLines,
            recenterCamera, recenterCameraRequested, setRecenterCameraRequested,
            thermalView, setThermalView,
            centerPanelCity, openCenterPanelWithCity, closeCenterPanel,

        }}>
            {children}
        </SceneControlsContext.Provider>
    );
};

export const useSceneControls = () => {
    const context = useContext(SceneControlsContext);
    if (!context) throw new Error('useSceneControls must be used within SceneControlsProvider');
    return context;
};
