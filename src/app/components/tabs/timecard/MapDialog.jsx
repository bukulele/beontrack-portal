/**
 * Map Dialog Component
 *
 * Read-only modal dialog to display GPS coordinates on a map
 * Shows check-in/check-out location with link to open in Google Maps
 *
 * Uses React Leaflet for map display
 * No coordinate editing - view only
 */

'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Dynamic imports for client-side only components
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);

export default function MapDialog({ open, coordinates, onClose }) {
  // Parse coordinates string to [lat, lng]
  const parsedCoordinates = useMemo(() => {
    if (!coordinates) return null;

    // Handle various coordinate formats
    // "lat,lng" or "lat, lng" or just pass through if already array
    if (typeof coordinates === 'string') {
      const parts = coordinates.split(',').map(c => parseFloat(c.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return parts;
      }
    }

    return null;
  }, [coordinates]);

  const handleOpenInGoogleMaps = () => {
    if (!parsedCoordinates) return;
    const [lat, lng] = parsedCoordinates;
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  if (!parsedCoordinates) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Check-in/Check-out Location</DialogTitle>
        </DialogHeader>

        {/* Map display */}
        <div className="w-full h-[500px] rounded-md overflow-hidden border">
          {typeof window !== 'undefined' && (
            <MapContainer
              center={parsedCoordinates}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={parsedCoordinates}>
                <Popup>
                  Check-in/Check-out location
                  <br />
                  {parsedCoordinates[0].toFixed(6)}, {parsedCoordinates[1].toFixed(6)}
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={handleOpenInGoogleMaps}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Open in Google Maps
          </Button>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
