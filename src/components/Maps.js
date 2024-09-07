import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Default icon fix for React-Leaflet v3
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom icons
const donorIcon = new L.Icon({
  iconUrl:
    "https://static.vecteezy.com/system/resources/previews/023/652/060/original/green-map-pointer-icon-on-a-transparent-background-free-png.png",
  iconRetinaUrl:
    "https://static.vecteezy.com/system/resources/previews/023/652/060/original/green-map-pointer-icon-on-a-transparent-background-free-png.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const requestIcon = new L.Icon({
  iconUrl:
    "https://i.pinimg.com/736x/d9/23/98/d9239829a431f6b122cab13ce3cf52e2.jpg",
  iconRetinaUrl:
    "https://i.pinimg.com/736x/d9/23/98/d9239829a431f6b122cab13ce3cf52e2.jpg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Maps = ({ donorLocation, requests }) => {
  if (!requests) requests = false;
  return (
    <MapContainer
      center={[donorLocation.lat, donorLocation.long]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker
        position={[donorLocation.lat, donorLocation.long]}
        icon={donorIcon}
      >
        <Popup>Your Location</Popup>
      </Marker>
      {requests &&
        requests.map((request, index) => (
          <Marker
            key={index}
            position={[request.location.lat, request.location.long]}
            icon={requestIcon}
          >
            <Popup>{request.receiverName}</Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default Maps;