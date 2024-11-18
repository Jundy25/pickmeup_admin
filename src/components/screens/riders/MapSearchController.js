import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const MapSearchController = ({ riders, search }) => {
  const map = useMap();

  useEffect(() => {
    if (!search || !riders.length) return;

    // Filter riders based on search term
    const matchedRiders = riders.filter(rider => 
      rider.user.first_name.toLowerCase().includes(search.toLowerCase()) ||
      rider.user.last_name.toLowerCase().includes(search.toLowerCase())
    );

    if (matchedRiders.length > 0) {
      // Create bounds from all matched riders
      const bounds = matchedRiders.map(rider => [
        parseFloat(rider.rider_latitude),
        parseFloat(rider.rider_longitude)
      ]);

      // Fit map to show all matched riders
      map.fitBounds(bounds, {
        padding: [50, 50], // Add padding around bounds
        maxZoom: 15, // Limit maximum zoom level
        duration: 1 // Animation duration in seconds
      });
    }
  }, [map, riders, search]);

  return null; // This is a controller component, so it doesn't render anything
};

export default MapSearchController;