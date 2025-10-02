"use client";

import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationMarker from "./LocationMarker";
import parseCoordinates from "@/app/functions/parseCoordinates";
import "leaflet/dist/leaflet.css";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";

const MapComponent = ({
  initialCoordinates,
  onSaveCoordinates,
  location,
  objectDataKey,
}) => {
  const [coordinates, setCoordinates] = useState(
    parseCoordinates(initialCoordinates)
  );

  //   Function to open coordinates in Google Maps
  const openInGoogleMaps = () => {
    const [lat, lng] = coordinates;
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  return (
    <div>
      <MapContainer
        center={coordinates || [49.9382522, -97.2796903]}
        zoom={13}
        style={{ height: "600px", width: "600px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker
          setCoordinates={onSaveCoordinates ? setCoordinates : null}
          coordinates={coordinates}
          location={location}
        />
      </MapContainer>
      <div className="flex gap-2 mt-3">
        {coordinates && onSaveCoordinates && (
          <Button
            content={"Save"}
            style={"classicButton"}
            fn={() => onSaveCoordinates(objectDataKey, coordinates)}
            highlighted={true}
          />
        )}
        {coordinates && (
          <Button
            content={
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMapLocationDot} />
                <p>Open in Google Maps</p>
              </div>
            }
            fn={openInGoogleMaps}
            style={"classicButton"}
          />
        )}
      </div>
    </div>
  );
};

export default MapComponent;
