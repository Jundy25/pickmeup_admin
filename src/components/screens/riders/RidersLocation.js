import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Icon } from "leaflet";
import Sidenav from "../../parts/Sidenav";
import Header from "../../parts/Header";
import userService from "../../../services";
import "leaflet/dist/leaflet.css";
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import yellow from "../../pictures/rider_yellow.png";
import red from "../../pictures/rider_red.png";
import blue from "../../pictures/rider_blue.png";
import MapSearchController from "./MapSearchController";

const DEFAULT_CENTER = [8.504203, 124.60238];
const DEFAULT_ZOOM = 14;

// Custom marker icons
const createRiderIcon = (iconUrl) =>
  new Icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowSize: [32, 32],
  });

const createPinIcon = (iconUrl) =>
  new Icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const icons = {
  available: createRiderIcon(yellow),
  offline: createRiderIcon(red),
  booked: createRiderIcon(blue),
  device: createPinIcon(
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png"
  ),
  cluster: createPinIcon(
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png"
  )
};

// Debug Panel Component
const DebugPanel = ({ data }) => (
  <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg text-sm z-[9999]">
    <h3 className="font-bold mb-2">Additional Info: </h3>
    <div className="space-y-1">
      <p>Total Riders: {data.totalRiders}</p>
      <div className="">
        <h1 className="font-bold mb-2">Icon Legend:</h1>
        <div className="flex items-center space-x-2 mb-1">
          <img
            src={yellow}
            alt="Available Riders"
            height={15}
            width={15}
          />
          <p>Available</p>
        </div>
        <div className="flex items-center space-x-2 mb-1">
          <img
            src={blue}
            alt="Available Riders"
            height={15}
            width={15}
          />
          <p>Booked</p>
        </div>
        <div className="flex items-center space-x-2 mb-1">
          <img
            src={red}
            alt="Available Riders"
            height={15}
            width={15}
          />
          <p>Offline</p>
        </div>
        <div className="flex items-center space-x-2">
          <img
            src={"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png"}
            alt="Available Riders"
            height={15}
            width={15}
          />
          <p>Admin Current Location</p>
        </div>
      </div>
    </div>
  </div>
);

// Alert Component
const Alert = ({ message, type = "error", onClose }) => (
  <div
    className={`${
      type === "error"
        ? "bg-red-100 border-red-400 text-red-700"
        : "bg-yellow-100 border-yellow-400 text-yellow-700"
    } border px-4 py-3 rounded relative mb-4`}
    role="alert"
  >
    <strong className="font-bold">
      {type === "error" ? "Error! " : "Warning! "}
    </strong>
    <span className="block sm:inline">{message}</span>
    {onClose && (
      <button className="absolute top-0 right-0 px-4 py-3" onClick={onClose}>
        <svg
          className="fill-current h-6 w-6"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
        </svg>
      </button>
    )}
  </div>
);

// Custom cluster icon styles
const createClusterCustomIcon = function (cluster) {
  return new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`
  });
};

// New component to handle marker updates
const DynamicMarkers = ({ riders, icons, search }) => {
  const markers = useMemo(() => {
    return riders.map((rider) => {
      const isHighlighted = search && 
        (rider.user.first_name.toLowerCase().includes(search.toLowerCase()) ||
         rider.user.last_name.toLowerCase().includes(search.toLowerCase()));

      return (
        <Marker
          key={rider.rider_id}
          position={[
            parseFloat(rider.rider_latitude),
            parseFloat(rider.rider_longitude),
          ]}
          icon={
            rider.availability === "Available"
              ? icons.available
              : rider.availability === "Booked"
              ? icons.booked
              : icons.offline
          }
          // Add a larger z-index to highlighted markers
          zIndexOffset={isHighlighted ? 1000 : 0}
        >
          <Popup>
            <div>
              <h3 className="font-bold">
                {rider.user.first_name} {rider.user.last_name}
              </h3>
              <p>Status: {rider.availability}</p>
            </div>
          </Popup>
        </Marker>
      );
    });
  }, [riders, icons, search]);

  return (
    <MarkerClusterGroup
      chunkedLoading
      spiderfyOnMaxZoom={true}
      showCoverageOnHover={true}
      zoomToBoundsOnClick={true}
      maxClusterRadius={40}
      iconCreateFunction={createClusterCustomIcon}
      removeOutsideVisibleBounds={true}
    >
      {markers}
    </MarkerClusterGroup>
  );
};

const RidersLocation = () => {
  const [riders, setRiders] = useState([]);
  const [search, setSearch] = useState("");
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [debugInfo, setDebugInfo] = useState({
    totalRiders: 0,
    validRiders: 0,
    deviceLocation: null,
    currentCenter: DEFAULT_CENTER,
    mapLoaded: false,
  });

  // Get device location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setDeviceLocation(newLocation);
          setMapCenter(newLocation);
          setDebugInfo((prev) => ({
            ...prev,
            deviceLocation: newLocation,
            currentCenter: newLocation,
          }));
        },
        (error) => {
          console.warn("Geolocation error:", error);
          setWarning(
            "Using default location as device location is unavailable."
          );
          setDebugInfo((prev) => ({
            ...prev,
            deviceLocation: null,
            currentCenter: DEFAULT_CENTER,
          }));
        }
      );
    }
  }, []);

  const fetchRiders = useCallback(async () => {
    try {
      const response = await userService.fetchLoc();
      if (!response || !Array.isArray(response)) {
        throw new Error("Invalid response format");
      }
      setRiders(response);
      setDebugInfo((prev) => ({
        ...prev,
        totalRiders: response.length,
      }));
    } catch (err) {
      console.error("Error fetching riders:", err);
      setError("Failed to fetch riders locations.");
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchRiders().finally(() => setIsLoading(false));
    
    const interval = setInterval(fetchRiders, 10000);
    return () => clearInterval(interval);
  }, [fetchRiders]);

  const validRiders = useMemo(() => {
    const filtered = riders.filter((rider) => {
      const lat = parseFloat(rider.rider_latitude);
      const lng = parseFloat(rider.rider_longitude);
      const isValid =
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180 &&
        rider.user?.first_name?.toLowerCase().includes(search.toLowerCase());

      return isValid;
    });

    setDebugInfo((prev) => ({
      ...prev,
      validRiders: filtered.length,
    }));

    return filtered;
  }, [riders, search]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow">
        <div className="z-[9999]">
          <Sidenav />
        </div>
        <div className="flex flex-col w-full">
          <Header />
          <main className="flex-grow p-4 bg-gray-50 overflow-y-auto max-h-screen">
            <div className="mb-6 relative">
              <h1 className="text-2xl font-bold mb-4">Riders Location</h1>

              {error && <Alert message={error} onClose={() => setError(null)} />}
              {warning && (
                <Alert
                  message={warning}
                  type="warning"
                  onClose={() => setWarning(null)}
                />
              )}

              <div className="flex mb-4">
                <input
                  type="text"
                  placeholder="Search by rider name"
                  className="flex-grow border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r transition-colors"
                  onClick={() => setSearch("")}
                >
                  Clear
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Available Riders: {validRiders.length} / {riders.length}
                </p>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-[600px] bg-gray-100 rounded">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="relative h-[600px]">
                  <MapContainer
                    center={mapCenter}
                    zoom={DEFAULT_ZOOM}
                    className="h-full w-full"
                    whenReady={() => {
                      setDebugInfo(prev => ({
                        ...prev,
                        mapLoaded: true
                      }));
                    }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {deviceLocation && (
                      <Marker position={deviceLocation} icon={icons.device}>
                        <Popup>Your Location</Popup>
                      </Marker>
                    )}

                    <DynamicMarkers riders={validRiders} icons={icons} search={search} />
                    <MapSearchController riders={validRiders} search={search} />
                  </MapContainer>

                  {process.env.NODE_ENV === "development" && (
                    <DebugPanel data={debugInfo} />
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default RidersLocation;