'use client'

import Leaflet from 'leaflet'
interface CoordinateBoxProps {
  location: Leaflet.LatLng | undefined
}

export const CoordinateBox = (props: CoordinateBoxProps) => {
  return <div style={{zIndex: 1000}} className='px-4 left-10 text-sm py-2 absolute rounded-lg bg-white shadow border border-gray-200'>
    <span>Tọa độ: {props.location?.lat.toFixed(5)}, {props.location?.lng.toFixed(5)}</span>
  </div>
}