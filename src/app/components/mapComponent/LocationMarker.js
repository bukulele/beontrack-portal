"use client";

import { Marker, Popup, useMapEvents } from "react-leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";

// Component to render FontAwesomeIcon inside a custom Leaflet icon
const FontAwesomeDivIcon = () => {
  const iconHtml = L.divIcon({
    html: renderToStaticMarkup(
      <FontAwesomeIcon icon={faLocationDot} className="text-red-500 text-3xl" />
    ),
    className: "bg-transparent border-none !flex !items-end !justify-center",
  });

  return iconHtml;
};

const LocationMarker = ({ setCoordinates, coordinates, location }) => {
  useMapEvents({
    click(e) {
      if (!setCoordinates) return;
      const { lat, lng } = e.latlng;
      setCoordinates([lat, lng]);
    },
  });

  return coordinates ? (
    <Marker position={coordinates} icon={FontAwesomeDivIcon()}>
      {location.length > 0 && <Popup>{location}</Popup>}
    </Marker>
  ) : null;
};

export default LocationMarker;
