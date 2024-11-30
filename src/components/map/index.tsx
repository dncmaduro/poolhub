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
import { CoordinateBox } from './ui/coordinate-box'
import Leaflet from 'leaflet'
import { ClickedMarker } from './LeafletMarker/clicked-marker'

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
}

const LeafletMapInner = (props: MapInnerProps) => {
  const [clickedPosition, setClickedPosition] = useState<Leaflet.LatLng | undefined>()
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
    if (!map) return
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      setClickedPosition(e.latlng)
    }
    map.on('click', handleMapClick)
    return () => {
      map.off('click', handleMapClick)
    }
  }, [map])

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
    <div className="absolute w-full h-full overflow-hidden" ref={viewportRef}>
      <div
        className={`absolute left-0 w-full transition-opacity ${isLoading ? 'opacity-0' : 'opacity-1'}`}
        style={{
          width: `${props.width}${props.usePercent ? '%' : 'px'}`,
          height: `${props.height}${props.usePercent ? '%' : 'px'}`
        }}
      >
        <CoordinateBox location={clickedPosition} />
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
}

const Map = (props: MapProps) => (
  <LeafleftMapContextProvider>
    <LeafletMapInner width={props.width} height={props.height} usePercent={props.usePercent || false}  />
  </LeafleftMapContextProvider>
)

export default Map
