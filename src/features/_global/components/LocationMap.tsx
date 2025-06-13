import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";

// Fix Leaflet default marker icons
interface FixedDefaultIcon extends L.Icon.Default {
  _getIconUrl?: string;
}

delete (L.Icon.Default.prototype as FixedDefaultIcon)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationMapProps {
  latitude: number | null;
  longitude: number | null;
  title: string;
  officeLat?: number;
  officeLng?: number;
  allowedRadius?: number;
}

const LocationMap: React.FC<LocationMapProps> = ({
  latitude,
  longitude,
  title,
  officeLat = -6.1876709, // Default office location
  officeLng = 106.6646784,
  allowedRadius = 300,
}) => {
  if (!latitude || !longitude) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <FaMapMarkerAlt className="text-red-500 text-3xl mx-auto mb-2" />
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-gray-500 text-xs">Lokasi tidak tersedia</p>
        </div>
      </div>
    );
  }

  const center: [number, number] = [latitude, longitude];

  return (
    <div style={{ height: "250px", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        dragging={false}
        touchZoom={false}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <Marker position={center}>
          <Popup>{title}</Popup>
        </Marker>

        {/* Show office radius if office coordinates are provided */}
        {officeLat && officeLng && allowedRadius && (
          <Circle
            center={[officeLat, officeLng]}
            radius={allowedRadius}
            pathOptions={{
              color: "#10b981",
              fillColor: "#34d399",
              fillOpacity: 0.2,
              weight: 3,
              dashArray: "10, 10",
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default LocationMap;