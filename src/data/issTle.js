// src/data/issTle.js
import tleText from './iss.tle?raw'
export const ISS_TLE_LINES = tleText.trim().split('\n').slice(1)