export function getEarthRotationY(speedFactor = 1) {
  const now = Date.now() / 1000
  const siderealDay = 86164
  return (((now * speedFactor) % siderealDay) / siderealDay) * 2 * Math.PI
}