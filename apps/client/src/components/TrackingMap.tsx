"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icon in Leaflet with Next.js/Webpack
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface TrackingMapProps {
  orderId: string;
}

const TrackingMap = ({ orderId }: TrackingMapProps) => {
  // Mock coordinates
  const warehousePos: [number, number] = [40.7128, -74.006]; // New York
  const deliveryPos: [number, number] = [40.7549, -73.984]; // Times Square
  const destPos: [number, number] = [40.7829, -73.9654]; // Central Park

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={deliveryPos}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Warehouse Marker */}
        <Marker position={warehousePos} icon={icon}>
          <Popup>Warehouse</Popup>
        </Marker>

        {/* Current Delivery Location Marker */}
        <Marker position={deliveryPos} icon={icon}>
          <Popup>
            <div className="font-semibold">Your Package</div>
            <div className="text-xs text-gray-500">Updated 5 min ago</div>
          </Popup>
        </Marker>

        {/* Destination Marker */}
        <Marker position={destPos} icon={icon}>
          <Popup>Delivery Address</Popup>
        </Marker>

        {/* Route Line */}
        <Polyline
          positions={[warehousePos, deliveryPos, destPos]}
          color="#4f46e5"
          weight={4}
          opacity={0.7}
          dashArray="10, 10"
        />
      </MapContainer>
    </div>
  );
};

export default TrackingMap;
