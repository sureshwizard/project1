import React, { useEffect, useRef, useState } from 'react';
import { X, RotateCcw, Navigation, Eye, Maximize, Minimize } from 'lucide-react';

interface GoogleMaps3DViewerProps {
  landmark: {
    name: string;
    coordinates: { lat: number; lng: number };
    location: string;
    country: string;
  };
  onClose?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

declare global {
  interface Window {
    google: any;
    initGoogleMap: () => void;
  }
}

export default function GoogleMaps3DViewer({ 
  landmark, 
  onClose, 
  isFullscreen = false, 
  onToggleFullscreen 
}: GoogleMaps3DViewerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const panoRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'street' | 'aerial'>('street');
  const [isMapReady, setIsMapReady] = useState(false);
  
  const mapInstanceRef = useRef<any>(null);
  const panoramaRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const rotationIntervalRef = useRef<any>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Check if script is already loading
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        const checkGoogle = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkGoogle);
            initializeMap();
          }
        }, 100);
        return;
      }

      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'}&libraries=places,geocoding`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        console.error('Failed to load Google Maps');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      try {
        const { lat, lng } = landmark.coordinates;
        const location = new window.google.maps.LatLng(lat, lng);

        // Initialize map
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: location,
          zoom: 18,
          mapTypeId: 'satellite',
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: true,
          tilt: 45,
        });

        // Add marker
        markerRef.current = new window.google.maps.Marker({
          map: mapInstanceRef.current,
          position: location,
          title: landmark.name,
          animation: window.google.maps.Animation.DROP,
        });

        // Initialize Street View
        panoramaRef.current = mapInstanceRef.current.getStreetView();
        panoramaRef.current.setOptions({
          addressControl: false,
          linksControl: true,
          panControl: true,
          enableCloseButton: false,
        });

        setIsMapReady(true);
        findBestView(location);
      } catch (error) {
        console.error('Error initializing map:', error);
        setIsLoading(false);
      }
    };

    loadGoogleMaps();

    return () => {
      stopAerialRotation();
    };
  }, [landmark]);

  const findBestView = (location: any) => {
    if (!window.google || !mapInstanceRef.current) return;

    setIsLoading(true);

    const streetViewService = new window.google.maps.StreetViewService();
    streetViewService.getPanorama(
      { location, radius: 200, source: 'outdoor' },
      (data: any, status: any) => {
        if (status === 'OK') {
          showStreetView(data.location.latLng);
          setViewMode('street');
        } else {
          console.warn('Street View not available, using aerial view');
          startAerialRotation();
          setViewMode('aerial');
        }
        setIsLoading(false);
      }
    );
  };

  const showStreetView = (location: any) => {
    if (!panoramaRef.current) return;
    
    stopAerialRotation();
    panoramaRef.current.setPosition(location);
    panoramaRef.current.setVisible(true);
  };

  const startAerialRotation = () => {
    if (!mapInstanceRef.current) return;

    stopAerialRotation();
    mapInstanceRef.current.setMapTypeId('satellite');
    mapInstanceRef.current.setTilt(45);
    
    let heading = mapInstanceRef.current.getHeading() || 0;
    rotationIntervalRef.current = setInterval(() => {
      heading = (heading + 0.5) % 360;
      mapInstanceRef.current.setHeading(heading);
    }, 50);
  };

  const stopAerialRotation = () => {
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current);
      rotationIntervalRef.current = null;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTilt(0);
      }
    }
  };

  const toggleViewMode = () => {
    if (!isMapReady) return;

    if (viewMode === 'street') {
      startAerialRotation();
      setViewMode('aerial');
      if (panoramaRef.current) {
        panoramaRef.current.setVisible(false);
      }
    } else {
      const { lat, lng } = landmark.coordinates;
      const location = new window.google.maps.LatLng(lat, lng);
      findBestView(location);
    }
  };

  const resetView = () => {
    if (!mapInstanceRef.current) return;
    
    const { lat, lng } = landmark.coordinates;
    const location = new window.google.maps.LatLng(lat, lng);
    mapInstanceRef.current.panTo(location);
    mapInstanceRef.current.setZoom(18);
    
    if (viewMode === 'aerial') {
      startAerialRotation();
    }
  };

  return (
    <div className={`relative bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${
      isFullscreen ? 'fixed inset-0 z-50' : 'h-[600px]'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{landmark.name}</h2>
            <p className="text-blue-100 text-sm">
              {landmark.location}, {landmark.country} • Photorealistic 3D View
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleViewMode}
              disabled={!isMapReady}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
              title={viewMode === 'street' ? 'Switch to Aerial View' : 'Switch to Street View'}
            >
              {viewMode === 'street' ? <Eye className="h-5 w-5" /> : <Navigation className="h-5 w-5" />}
            </button>
            <button
              onClick={resetView}
              disabled={!isMapReady}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
              title="Reset View"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            {onToggleFullscreen && (
              <button
                onClick={onToggleFullscreen}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* View Mode Indicator */}
      <div className="absolute top-20 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium">
        <div className="flex items-center space-x-2">
          {viewMode === 'street' ? (
            <>
              <Navigation className="h-4 w-4 text-blue-600" />
              <span>Street View</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 text-purple-600" />
              <span>Aerial 3D View</span>
            </>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className={`relative ${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-[536px]'}`}>
        <div
          ref={mapRef}
          className="w-full h-full"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        />
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-gray-700 font-medium">Loading 3D View...</p>
              <p className="text-gray-500 text-sm">Searching for best viewpoint</p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button
            onClick={toggleViewMode}
            disabled={!isMapReady}
            className="bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-lg shadow-lg hover:bg-white transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {viewMode === 'street' ? 'Aerial View' : 'Street View'}
          </button>
        </div>

        {/* Info Panel */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 max-w-xs">
          <h4 className="font-semibold text-gray-900 mb-1">{landmark.name}</h4>
          <p className="text-sm text-gray-600">
            {viewMode === 'street' 
              ? 'Interactive Street View - Use mouse to look around'
              : 'Rotating aerial view with 3D buildings'
            }
          </p>
        </div>
      </div>
    </div>
  );
}