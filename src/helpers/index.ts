export const PoolMapUrl = 'https://pool-map-1.vercel.app'

type Point = {
  lat: number | null
  lon: number | null
}

export const urlToPoolMap = (point1?: Point, point2?: Point) => {
  return `${PoolMapUrl}/?point=${point1 ? `${point1.lat},${point1.lon}` : ''}&point=${point2 ? `${point2.lat},${point2.lon}` : ''}`
}

export const isAddressFilled = (address: Point) => {
  return address.lat !== null && address.lon !== null
}
