export const PoolMapUrl = 'https://pool-map-1.vercel.app'

type Point = {
  lat: number
  lon: number
}

export const urlToPoolMap = (point1?: Point, point2?: Point) => {
  return `${PoolMapUrl}/?point=${point1 ? `${point1.lat},${point1.lon}` : ''}&point=${point2 ? `${point2.lat},${point2.lon}` : ''}`
}
