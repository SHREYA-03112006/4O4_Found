import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function ClickMarker({ position, onPin }) {
  useMapEvents({
    click(e) {
      onPin({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return position ? <Marker position={[position.lat, position.lng]} /> : null
}

export default function MapPicker({ onPinned, onClear }) {
  const [active, setActive] = useState(false)
  const [pin, setPin] = useState(null)
  const center = [20.5937, 78.9629]

  const handlePin = (pos) => {
    setPin(pos)
    onPinned?.(pos)
  }

  const clearPin = () => {
    setPin(null)
    onClear?.()
  }

  return (
    <div className="w-full">
      {!active ? (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="text-sm text-indigo-600 hover:text-indigo-800 underline"
        >
          📍 Pin pickup point on map (optional)
        </button>
      ) : (
        <div className="border border-gray-300 rounded-xl overflow-hidden">
          <div className="h-48 w-full" style={{ zIndex: 1 }}>
            <MapContainer center={center} zoom={4} className="h-full w-full" scrollWheelZoom={true}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <ClickMarker position={pin} onPin={handlePin} />
            </MapContainer>
          </div>
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
            {pin ? (
              <span className="text-xs text-gray-600">
                Pinned: {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
              </span>
            ) : (
              <span className="text-xs text-gray-400">Click on the map to place a marker</span>
            )}
            <div className="flex gap-2">
              {pin && (
                <button type="button" onClick={clearPin} className="text-xs text-red-500 hover:text-red-700">
                  Remove
                </button>
              )}
              <button type="button" onClick={() => setActive(false)} className="text-xs text-gray-500 hover:text-gray-700">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}