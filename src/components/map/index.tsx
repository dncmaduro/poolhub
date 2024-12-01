'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'

import { AppConfig } from './lib/AppConfig'
import MarkerCategories, { Category } from './lib/MarkerCategories'
import { Places } from './lib/Places'

import LeafleftMapContextProvider from './LeafletMapContextProvider'
import useMapContext from './useMapContext'
import useMarkerData from './useMarkerData'
import Leaflet from 'leaflet'

const CoordinateBox = dynamic(
  () => import('./ui/coordinate-box').then((mod) => mod.CoordinateBox),
  {
    ssr: false
  }
)

const ClickedMarker = dynamic(
  () =>
    import('./LeafletMarker/clicked-marker').then((mod) => mod.ClickedMarker),
  {
    ssr: false
  }
)

const LeafletCluster = dynamic(
  async () => (await import('./LeafletCluster')).LeafletCluster(),
  {
    ssr: false
  }
)

const CustomMarker = dynamic(
  async () => (await import('./LeafletMarker')).CustomMarker,
  {
    ssr: false
  }
)

const LeafletMapContainer = dynamic(
  async () => (await import('./LeafletMapContainer')).LeafletMapContainer,
  {
    ssr: false
  }
)

interface MapInnerProps {
  height: number
  width: number
  usePercent: boolean
  showCoordinate: boolean
  setLatLng?: (value: Leaflet.LatLng) => void
  currLat?: number | null
  currLng?: number | null
  onlyClick?: boolean
}

const LeafletMapInner = (props: MapInnerProps) => {
  const [clickedPosition, setClickedPosition] = useState<
    Leaflet.LatLng | undefined
  >()
  const { map } = useMapContext()
  const {
    width: viewportWidth,
    height: viewportHeight,
    ref: viewportRef
  } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 200
  })

  const { clustersByCategory, allMarkersBoundCenter } = useMarkerData({
    locations: Places,
    map,
    viewportWidth,
    viewportHeight
  })

  const isLoading = !map || !viewportWidth || !viewportHeight

  useEffect(() => {
    if (props.currLat && props.currLng) {
      setClickedPosition({
        lat: props.currLat,
        lng: props.currLng
      } as Leaflet.LatLng)
    }
  }, [props.currLat, props.currLng])

  useEffect(() => {
    if (map && clickedPosition) {
      map.flyTo(clickedPosition)
    }
  }, [clickedPosition, map])

  useEffect(() => {
    if (typeof window !== 'undefined' && map) {
      const handleMapClick = (e: L.LeafletMouseEvent) => {
        setClickedPosition(e.latlng)
        if (props.setLatLng) {
          props.setLatLng(e.latlng)
        }
      }
      map.on('click', handleMapClick)
      return () => {
        map.off('click', handleMapClick)
      }
    }
  }, [map, props])

  /** watch position & zoom of all markers */
  useEffect(() => {
    if (!allMarkersBoundCenter || !map) return

    const moveEnd = () => {
      map.off('moveend', moveEnd)
    }

    map.flyTo(allMarkersBoundCenter.centerPos, allMarkersBoundCenter.minZoom, {
      animate: false
    })
    map.once('moveend', moveEnd)
  }, [allMarkersBoundCenter, map])

  return (
    <div
      className={`absolute z-0 h-full w-full overflow-hidden`}
      ref={viewportRef}
    >
      <div
        className={`absolute left-0 w-full transition-opacity ${isLoading ? 'opacity-0' : 'opacity-1'}`}
        style={{
          width: `${props.width}${props.usePercent ? '%' : 'px'}`,
          height: `${props.height}${props.usePercent ? '%' : 'px'}`
        }}
      >
        {props.showCoordinate && <CoordinateBox location={clickedPosition} />}
        {allMarkersBoundCenter && clustersByCategory && (
          <LeafletMapContainer
            center={allMarkersBoundCenter.centerPos}
            zoom={allMarkersBoundCenter.minZoom}
            maxZoom={AppConfig.maxZoom}
            minZoom={AppConfig.minZoom}
          >
            {!isLoading ? (
              <>
                <ClickedMarker position={clickedPosition} />
                {Object.values(clustersByCategory).map((item) => (
                  <LeafletCluster
                    key={item.category}
                    icon={MarkerCategories[item.category as Category].icon}
                    color={MarkerCategories[item.category as Category].color}
                    chunkedLoading
                  >
                    {item.markers.map((marker) => (
                      <CustomMarker place={marker} key={marker.id} />
                    ))}
                  </LeafletCluster>
                ))}
              </>
            ) : (
              <></>
            )}
          </LeafletMapContainer>
        )}
      </div>
    </div>
  )
}

interface MapProps {
  width: number
  height: number
  usePercent?: boolean
  showCoordinate?: boolean
  setLatLng?: (value: Leaflet.LatLng) => void
  currLat?: number | null
  currLng?: number | null
  onlyClick?: boolean
}

const Map = (props: MapProps) => (
  <LeafleftMapContextProvider>
    <LeafletMapInner
      width={props.width}
      height={props.height}
      usePercent={props.usePercent || false}
      showCoordinate={props.showCoordinate || false}
      setLatLng={props.setLatLng}
      currLat={props.currLat}
      currLng={props.currLng}
      onlyClick={props.onlyClick}
    />
  </LeafleftMapContextProvider>
)

export default Map
