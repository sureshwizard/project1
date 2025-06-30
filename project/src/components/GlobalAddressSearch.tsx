import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Navigation, Clock, Star, Building, Globe, Eye, RotateCcw, Maximize, Minimize, X } from 'lucide-react';

interface AddressResult {
  id: string;
  address: string;
  type: string;
  coordinates: { lat: number; lng: number };
  details?: {
    buildingName?: string;
    buildingType?: string;
    floors?: number;
    yearBuilt?: string;
  };
  isLandmark?: boolean;
  landmarkData?: any;
}

interface GlobalAddressSearchProps {
  onAddressSelect?: (address: AddressResult) => void;
  placeholder?: string;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initGoogleMap: () => void;
  }
}

export default function GlobalAddressSearch({ 
  onAddressSelect, 
  placeholder = "Search any address, building, or landmark worldwide...",
  className = ""
}: GlobalAddressSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AddressResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [show360View, setShow360View] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [googlePlacesResults, setGooglePlacesResults] = useState<any[]>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const rotationIntervalRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);

  // Enhanced mock data with more global landmarks and buildings
  const mockAddresses: AddressResult[] = [
    // World Famous Landmarks
    {
      id: 'eiffel-tower',
      address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
      type: 'Historic Landmark',
      coordinates: { lat: 48.8584, lng: 2.2945 },
      isLandmark: true,
      details: {
        buildingName: 'Eiffel Tower',
        buildingType: 'Iron Lattice Tower',
        floors: 3,
        yearBuilt: '1889'
      },
      landmarkData: {
        id: 'eiffel-tower',
        name: 'Eiffel Tower',
        location: 'Paris',
        country: 'France',
        height: '330 meters (1,083 ft)',
        visitorsPerYear: '7 million'
      }
    },
    {
      id: 'empire-state',
      address: '20 W 34th St, New York, NY 10001, United States',
      type: 'Historic Landmark',
      coordinates: { lat: 40.7484, lng: -73.9857 },
      isLandmark: true,
      details: {
        buildingName: 'Empire State Building',
        buildingType: 'Art Deco Skyscraper',
        floors: 102,
        yearBuilt: '1931'
      },
      landmarkData: {
        id: 'empire-state',
        name: 'Empire State Building',
        location: 'New York City',
        country: 'United States',
        height: '443.2 meters (1,454 ft)',
        visitorsPerYear: '4 million'
      }
    },
    {
      id: 'burj-khalifa',
      address: '1 Sheikh Mohammed bin Rashid Blvd, Dubai, United Arab Emirates',
      type: 'Historic Landmark',
      coordinates: { lat: 25.1972, lng: 55.2744 },
      isLandmark: true,
      details: {
        buildingName: 'Burj Khalifa',
        buildingType: 'Supertall Skyscraper',
        floors: 163,
        yearBuilt: '2010'
      },
      landmarkData: {
        id: 'burj-khalifa',
        name: 'Burj Khalifa',
        location: 'Dubai',
        country: 'United Arab Emirates',
        height: '828 meters (2,717 ft)',
        visitorsPerYear: '1.87 million'
      }
    },
    {
      id: 'taj-mahal',
      address: 'Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001, India',
      type: 'Historic Landmark',
      coordinates: { lat: 27.1751, lng: 78.0421 },
      isLandmark: true,
      details: {
        buildingName: 'Taj Mahal',
        buildingType: 'Mausoleum',
        floors: 1,
        yearBuilt: '1653'
      },
      landmarkData: {
        id: 'taj-mahal',
        name: 'Taj Mahal',
        location: 'Agra',
        country: 'India',
        height: '73 meters (240 ft)',
        visitorsPerYear: '6-8 million'
      }
    },
    {
      id: 'sydney-opera',
      address: 'Bennelong Point, Sydney NSW 2000, Australia',
      type: 'Historic Landmark',
      coordinates: { lat: -33.8568, lng: 151.2153 },
      isLandmark: true,
      details: {
        buildingName: 'Sydney Opera House',
        buildingType: 'Performing Arts Center',
        floors: 5,
        yearBuilt: '1973'
      },
      landmarkData: {
        id: 'sydney-opera',
        name: 'Sydney Opera House',
        location: 'Sydney',
        country: 'Australia',
        height: '65 meters (213 ft)',
        visitorsPerYear: '8.2 million'
      }
    },
    {
      id: 'big-ben',
      address: 'Westminster, London SW1A 0AA, United Kingdom',
      type: 'Historic Landmark',
      coordinates: { lat: 51.4994, lng: -0.1245 },
      isLandmark: true,
      details: {
        buildingName: 'Big Ben',
        buildingType: 'Clock Tower',
        floors: 11,
        yearBuilt: '1859'
      },
      landmarkData: {
        id: 'big-ben',
        name: 'Big Ben',
        location: 'London',
        country: 'United Kingdom',
        height: '96 meters (316 ft)',
        visitorsPerYear: '2 million'
      }
    },
    {
      id: 'colosseum',
      address: 'Piazza del Colosseo, 1, 00184 Roma RM, Italy',
      type: 'Historic Landmark',
      coordinates: { lat: 41.8902, lng: 12.4922 },
      isLandmark: true,
      details: {
        buildingName: 'Colosseum',
        buildingType: 'Ancient Amphitheater',
        floors: 4,
        yearBuilt: '80 AD'
      },
      landmarkData: {
        id: 'colosseum',
        name: 'Colosseum',
        location: 'Rome',
        country: 'Italy',
        height: '48 meters (157 ft)',
        visitorsPerYear: '6 million'
      }
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Load Google Maps API when component mounts
    loadGoogleMapsAPI();
    
    return () => {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
      }
    };
  }, []);

  const loadGoogleMapsAPI = () => {
    if (window.google && window.google.maps) {
      initializePlacesService();
      return;
    }

    // Check if script is already loading
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogle);
          initializePlacesService();
        }
      }, 100);
      return;
    }

    // Load Google Maps script with API key from environment
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places,marker`;
    script.async = true;
    script.defer = true;
    script.onload = initializePlacesService;
    script.onerror = () => {
      console.error('Failed to load Google Maps');
    };
    document.head.appendChild(script);
  };

  const initializePlacesService = () => {
    if (!window.google || !window.google.maps) return;

    // Create a hidden map for Places service
    const hiddenMapDiv = document.createElement('div');
    hiddenMapDiv.style.display = 'none';
    document.body.appendChild(hiddenMapDiv);

    const hiddenMap = new window.google.maps.Map(hiddenMapDiv, {
      center: { lat: 0, lng: 0 },
      zoom: 1
    });

    placesServiceRef.current = new window.google.maps.places.PlacesService(hiddenMap);
  };

  const searchGooglePlaces = (searchQuery: string) => {
    if (!placesServiceRef.current || !window.google) {
      return;
    }

    const request = {
      query: searchQuery,
      fields: ['name', 'formatted_address', 'geometry', 'place_id', 'types', 'rating']
    };

    placesServiceRef.current.textSearch(request, (results: any[], status: any) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const formattedResults = results.slice(0, 10).map((place, index) => ({
          id: place.place_id || `google-${index}`,
          address: place.formatted_address || '',
          type: place.types?.[0]?.replace(/_/g, ' ') || 'Location',
          coordinates: {
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0
          },
          details: {
            buildingName: place.name || 'Unknown Location',
            buildingType: place.types?.[0]?.replace(/_/g, ' ') || 'Location',
            floors: Math.floor(Math.random() * 50) + 1, // Mock data
            yearBuilt: (2024 - Math.floor(Math.random() * 100)).toString()
          },
          isLandmark: place.types?.includes('tourist_attraction') || place.types?.includes('landmark'),
          rating: place.rating
        }));

        setGooglePlacesResults(formattedResults);
      }
    });
  };

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setGooglePlacesResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);
    
    // Search in mock data
    const filteredMockResults = mockAddresses.filter(address =>
      address.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.details?.buildingName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (address.isLandmark && address.landmarkData?.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setResults(filteredMockResults);

    // Search using Google Places API
    searchGooglePlaces(searchQuery);

    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleAddressClick = (address: AddressResult) => {
    setQuery(address.details?.buildingName || address.address);
    setIsOpen(false);
    setSelectedLocation(address);
    
    if (onAddressSelect) {
      onAddressSelect(address);
    }
  };

  const open360View = (address: AddressResult) => {
    setSelectedLocation(address);
    setShow360View(true);
    // Initialize map after modal opens
    setTimeout(() => {
      initializeMap();
    }, 100);
  };

  const close360View = () => {
    setShow360View(false);
    stopRotation();
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google || !selectedLocation) return;

    const location = selectedLocation.coordinates;

    try {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 18,
        mapTypeId: 'satellite',
        tilt: 55,
        heading: 0,
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: false,
        zoomControl: true,
      });

      // Add marker
      if (window.google.maps.marker?.AdvancedMarkerElement) {
        markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
          map: mapInstanceRef.current,
          position: location,
          title: selectedLocation.details?.buildingName || 'Selected Location'
        });
      } else {
        // Fallback to regular marker
        markerRef.current = new window.google.maps.Marker({
          map: mapInstanceRef.current,
          position: location,
          title: selectedLocation.details?.buildingName || 'Selected Location'
        });
      }

      startRotation();
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const startRotation = () => {
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current);
    }

    let heading = 0;
    rotationIntervalRef.current = setInterval(() => {
      heading = (heading + 1) % 360;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.moveCamera({
          center: mapInstanceRef.current.getCenter(),
          heading: heading,
          tilt: 55,
          zoom: 18,
        });
      }
    }, 100);
  };

  const stopRotation = () => {
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current);
      rotationIntervalRef.current = null;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getBuildingIcon = (address: AddressResult) => {
    if (address.isLandmark) {
      return <Globe className="h-4 w-4 text-purple-600" />;
    }
    
    const type = address.type.toLowerCase();
    if (type.includes('commercial') || type.includes('office')) {
      return <Building className="h-4 w-4 text-blue-600" />;
    } else if (type.includes('residential')) {
      return <Building className="h-4 w-4 text-green-600" />;
    } else {
      return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  // Combine mock results and Google Places results
  const allResults = [...results, ...googlePlacesResults];

  return (
    <>
      <div ref={searchRef} className={`relative ${className}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder-gray-500"
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            style={{ 
              fontSize: '16px', // Prevents zoom on iOS
              color: '#111827',
              backgroundColor: '#ffffff'
            }}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {allResults.length > 0 ? (
              <div className="py-2">
                {allResults.map((address, index) => (
                  <div
                    key={`${address.id}-${index}`}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getBuildingIcon(address)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {address.details?.buildingName || 'Location'}
                          </p>
                          <div className="flex items-center space-x-2">
                            {address.isLandmark && (
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                                Landmark
                              </span>
                            )}
                            {address.rating && (
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-600 ml-1">{address.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{address.address}</p>
                        
                        {address.details && (
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                            <span className="capitalize">{address.type}</span>
                            {address.details.floors && (
                              <span className="flex items-center">
                                <Building className="h-3 w-3 mr-1" />
                                {address.details.floors} floors
                              </span>
                            )}
                            {address.details.yearBuilt && (
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {address.details.yearBuilt}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAddressClick(address)}
                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                          >
                            Select Location
                          </button>
                          <button
                            onClick={() => open360View(address)}
                            className="bg-green-600 text-white py-2 px-3 rounded text-xs font-medium hover:bg-green-700 transition-colors flex items-center"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            360° View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : query.length >= 2 && !isLoading ? (
              <div className="px-4 py-6 text-center text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No locations found</p>
                <p className="text-xs">Try searching for landmarks, addresses, or places</p>
              </div>
            ) : query.length >= 2 && isLoading ? (
              <div className="px-4 py-6 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm">Searching worldwide...</p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* 360° Aerial View Modal */}
      {show360View && selectedLocation && (
        <div className={`fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4`}>
          <div className={`bg-white rounded-xl shadow-2xl overflow-hidden ${isFullscreen ? 'w-full h-full' : 'max-w-6xl w-full max-h-[90vh]'}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedLocation.details?.buildingName || 'Selected Location'}
                  </h2>
                  <p className="text-blue-100 text-sm">
                    360° Aerial View • Auto-Rotating Satellite View
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => rotationIntervalRef.current ? stopRotation() : startRotation()}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    title={rotationIntervalRef.current ? "Stop Rotation" : "Start Rotation"}
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  >
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={close360View}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    title="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className={`relative ${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-[600px]'}`}>
              <div
                ref={mapRef}
                className="w-full h-full"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              />
              
              {/* Loading Overlay */}
              {!mapInstanceRef.current && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <p className="text-gray-700 font-medium">Loading 360° View...</p>
                    <p className="text-gray-500 text-sm">Preparing satellite imagery</p>
                  </div>
                </div>
              )}
              
              {/* Controls Overlay */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>360° Aerial View</span>
                  </div>
                  <div className="flex items-center">
                    <Navigation className="h-4 w-4 mr-1" />
                    <span>{rotationIntervalRef.current ? 'Auto-Rotating' : 'Rotation Paused'}</span>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
                <h3 className="font-bold text-gray-900 mb-2">
                  {selectedLocation.details?.buildingName}
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{selectedLocation.details?.buildingType}</span>
                  </div>
                  {selectedLocation.details?.floors && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Floors:</span>
                      <span className="font-medium">{selectedLocation.details.floors}</span>
                    </div>
                  )}
                  {selectedLocation.details?.yearBuilt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Built:</span>
                      <span className="font-medium">{selectedLocation.details.yearBuilt}</span>
                    </div>
                  )}
                  {selectedLocation.isLandmark && selectedLocation.landmarkData?.visitorsPerYear && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Visitors/Year:</span>
                      <span className="font-medium">{selectedLocation.landmarkData.visitorsPerYear}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Coordinates:</span>
                    <p className="font-medium text-xs">
                      {selectedLocation.coordinates.lat.toFixed(4)}, {selectedLocation.coordinates.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}