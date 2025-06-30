import React, { useState, useCallback, useRef } from 'react';
import { 
  Search, 
  Navigation, 
  MapPin, 
  Route, 
  Building, 
  Eye, 
  Info, 
  Layers,
  Maximize,
  RotateCcw,
  Compass,
  Home,
  Car,
  Clock,
  Star
} from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface BuildingInfo {
  name: string;
  address: string;
  type: string;
  height: string;
  floors: number;
  yearBuilt: string;
  color: string;
  area: string;
  architect?: string;
  features: string[];
}

interface NearbyPlace {
  id: string;
  name: string;
  type: string;
  distance: string;
  rating: number;
  icon: string;
}

export default function MapView() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingInfo | null>(null);
  const [show3DView, setShow3DView] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'satellite' | '3d'>('map');
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [rotation, setRotation] = useState(0);

  // Mock building data
  const mockBuildingInfo: BuildingInfo = {
    name: "Metropolitan Tower",
    address: "123 Main Street, Downtown",
    type: "Commercial Office Building",
    height: "45 floors / 180m",
    floors: 45,
    yearBuilt: "2018",
    color: "Glass Blue with Steel Frame",
    area: "2,500 sq ft per floor",
    architect: "Smith & Associates",
    features: [
      "LEED Gold Certified",
      "Smart Building Technology",
      "Rooftop Garden",
      "Underground Parking",
      "24/7 Security",
      "High-Speed Elevators"
    ]
  };

  // Mock nearby places
  const mockNearbyPlaces: NearbyPlace[] = [
    { id: '1', name: 'Central Park', type: 'Park', distance: '0.2 mi', rating: 4.8, icon: '🌳' },
    { id: '2', name: 'Coffee Corner', type: 'Cafe', distance: '0.1 mi', rating: 4.5, icon: '☕' },
    { id: '3', name: 'Metro Station', type: 'Transit', distance: '0.3 mi', rating: 4.2, icon: '🚇' },
    { id: '4', name: 'City Mall', type: 'Shopping', distance: '0.4 mi', rating: 4.6, icon: '🛍️' },
    { id: '5', name: 'Grand Hotel', type: 'Hotel', distance: '0.5 mi', rating: 4.7, icon: '🏨' },
    { id: '6', name: 'Medical Center', type: 'Hospital', distance: '0.6 mi', rating: 4.4, icon: '🏥' }
  ];

  const handleSearch = () => {
    // Mock route calculation
    setRouteInfo({
      distance: '12.5 miles',
      duration: '25 minutes',
      traffic: 'Light traffic',
      route: 'Via Main St and Highway 101'
    });
    setNearbyPlaces(mockNearbyPlaces);
  };

  const handleBuildingClick = () => {
    setSelectedBuilding(mockBuildingInfo);
    setShow3DView(true);
  };

  const rotate360 = () => {
    setRotation(prev => prev + 90);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactive Map View</h1>
        <p className="text-gray-600">Navigate, explore, and discover with advanced 3D visualization</p>
      </div>

      {/* Search Controls */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
            <input
              type="text"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              placeholder="From: Enter starting location..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
            <input
              type="text"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              placeholder="To: Enter destination..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all duration-300 flex items-center"
          >
            <Search className="h-5 w-5 mr-2" />
            Find Route
          </button>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { id: 'map', label: 'Map', icon: MapPin },
              { id: 'satellite', label: 'Satellite', icon: Layers },
              { id: '3d', label: '3D View', icon: Building }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as any)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4 mr-1" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Map Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Map Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {viewMode === '3d' ? '3D Building View' : 'Route Map'}
                </h2>
                <div className="flex items-center space-x-2">
                  {viewMode === '3d' && (
                    <>
                      <button
                        onClick={rotate360}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Rotate 360°"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShow3DView(!show3DView)}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                        title="Toggle 3D View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <Maximize className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Map Content */}
            <div className="h-[600px] relative bg-gradient-to-br from-blue-50 to-green-50">
              {viewMode === '3d' && show3DView ? (
                /* 3D Building View */
                <div className="h-full flex items-center justify-center relative overflow-hidden">
                  <div 
                    className="relative transform transition-transform duration-1000"
                    style={{ transform: `rotateY(${rotation}deg)` }}
                  >
                    {/* 3D Building Representation */}
                    <div className="relative">
                      {/* Building Base */}
                      <div className="w-64 h-80 bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 rounded-lg shadow-2xl relative overflow-hidden">
                        {/* Building Details */}
                        <div className="absolute inset-0">
                          {/* Windows Pattern */}
                          <div className="grid grid-cols-8 gap-1 p-4 h-full">
                            {Array.from({ length: 64 }).map((_, i) => (
                              <div
                                key={i}
                                className={`bg-yellow-200 rounded-sm opacity-${Math.random() > 0.3 ? '80' : '20'}`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        {/* Building Shadow */}
                        <div className="absolute -bottom-4 -right-4 w-64 h-80 bg-gray-400 opacity-30 rounded-lg transform skew-x-12 -z-10"></div>
                      </div>
                      
                      {/* Building Info Overlay */}
                      <div className="absolute -right-8 top-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
                        <h3 className="font-bold text-gray-900 mb-2">Building Analysis</h3>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Color:</span> Glass Blue</p>
                          <p><span className="font-medium">Height:</span> 180m</p>
                          <p><span className="font-medium">Floors:</span> 45</p>
                          <p><span className="font-medium">Type:</span> Commercial</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 3D Controls */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Compass className="h-4 w-4" />
                      <span>Rotation: {rotation}°</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Regular Map View */
                <div className="h-full flex items-center justify-center relative">
                  {/* Mock Map Interface */}
                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 relative">
                    {/* Route Path */}
                    {routeInfo && (
                      <svg className="absolute inset-0 w-full h-full">
                        <path
                          d="M 100 500 Q 300 200 500 300 T 700 150"
                          stroke="#3B82F6"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray="10,5"
                          className="animate-pulse"
                        />
                      </svg>
                    )}
                    
                    {/* Location Markers */}
                    <div className="absolute top-20 left-20 bg-green-500 text-white p-2 rounded-full shadow-lg">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="absolute bottom-32 right-32 bg-red-500 text-white p-2 rounded-full shadow-lg">
                      <MapPin className="h-6 w-6" />
                    </div>
                    
                    {/* Buildings */}
                    <div 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={handleBuildingClick}
                    >
                      <div className="w-16 h-20 bg-blue-600 rounded-t-lg shadow-lg hover:bg-blue-700 transition-colors relative">
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
                          3D
                        </div>
                      </div>
                    </div>
                    
                    {/* Map Legend */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm">
                      <h4 className="font-semibold mb-2">Legend</h4>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span>Start Point</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                          <span>Destination</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
                          <span>3D Buildings</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Route Information */}
          {routeInfo && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Route className="h-5 w-5 mr-2 text-blue-600" />
                Route Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">{routeInfo.distance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {routeInfo.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Traffic:</span>
                  <span className="text-green-600 font-medium">{routeInfo.traffic}</span>
                </div>
                <div className="pt-2 border-t">
                  <span className="text-gray-600 text-sm">Route: {routeInfo.route}</span>
                </div>
              </div>
            </div>
          )}

          {/* Building Information */}
          {selectedBuilding && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-600" />
                Building Details
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedBuilding.name}</h4>
                  <p className="text-sm text-gray-600">{selectedBuilding.address}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <p className="font-medium">{selectedBuilding.type}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Height:</span>
                    <p className="font-medium">{selectedBuilding.height}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Built:</span>
                    <p className="font-medium">{selectedBuilding.yearBuilt}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Area:</span>
                    <p className="font-medium">{selectedBuilding.area}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-600 text-sm">Color & Material:</span>
                  <p className="font-medium">{selectedBuilding.color}</p>
                </div>
                
                <div>
                  <span className="text-gray-600 text-sm">Features:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedBuilding.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nearby Places */}
          {nearbyPlaces.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Compass className="h-5 w-5 mr-2 text-blue-600" />
                Nearby Places
              </h3>
              <div className="space-y-3">
                {nearbyPlaces.map((place) => (
                  <div key={place.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{place.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{place.name}</h4>
                        <p className="text-sm text-gray-600">{place.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{place.distance}</p>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">{place.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}