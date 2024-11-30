import { Icon, LatLngExpression } from "leaflet"
import { Marker } from "react-leaflet"
interface ClickedMarkerProps {
  position: LatLngExpression | undefined
}
const customIcon = new Icon({
  iconUrl: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="32"  viewBox="0 0 24 24"  fill="#8b5cf6"  class="icon icon-tabler icons-tabler-filled icon-tabler-map-pin"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" /></svg>
  `),
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [8, 8], // Anchor point of the icon
});
export const ClickedMarker = (props: ClickedMarkerProps) => {
  return <>
  {props.position === undefined ? <></> : <>
    <Marker position={props.position} icon={customIcon} /></>}</>
}