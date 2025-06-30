import React, { useState } from 'react';
import { Plus, MapPin, Navigation, Clock, Route, Settings, Save, Globe } from 'lucide-react';
import AddressSearch from './AddressSearch';
import BuildingViewer from './BuildingViewer';
import LandmarkViewer from './LandmarkViewer';

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

export default function PlanRoute() {
  const [waypoints, setWaypoints] = useState([
    { id: 1, location: '', type: 'start', addressData: null as AddressResult | null },
    { id: 2, location: '', type: 'end', addressData: null as AddressResult | null }
  ]);
  const [routeName, setRouteName] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  const [selectedLandmark, setSelectedLandmark] = useState<any>(null);

  const addWaypoint = () => {
    const newId = Math.max(...waypoints.map(w => w.id)) + 1;
    const newWaypoint = { id: newId, location: '', type: 'waypoint', addressData: null as AddressResult | null };
    setWaypoints([...waypoints.slice(0, -1), newWaypoint, waypoints[waypoints.length - 1]]);
  };

  const removeWaypoint = (id: number) => {
    setWaypoints(waypoints.filter(w => w.id !== id));
  };

  const updateWaypoint = (id: number, addressResult: AddressResult) => {
    setWaypoints(waypoints.map(w => 
      w.id === id 
        ? { ...w, location: addressResult.address, addressData: addressResult }
        : w
    ));
  };

  const handleAddressSelect = (waypointId: number, addressResult: AddressResult) => {
    updateWaypoint(waypointId, addressResult);
    
    // If it's a landmark, prepare landmark data for 3D view
    if (addressResult.isLandmark && addressResult.landmarkData) {
      // Get full landmark data (this would normally come from a database)
      const fullLandmarkData = getLandmarkData(addressResult.landmarkData.id);
      setSelectedLandmark(fullLandmarkData);
    } else if (addressResult.details) {
      // Regular building data
      const buildingData = {
        id: addressResult.id,
        name: addressResult.details.buildingName || 'Selected Building',
        address: addressResult.address,
        type: addressResult.details.buildingType || addressResult.type,
        height: `${addressResult.details.floors || 20} floors`,
        floors: addressResult.details.floors || 20,
        yearBuilt: addressResult.details.yearBuilt || '2020',
        architect: 'Unknown',
        color: 'Glass Blue with Steel Frame',
        materials: ['Reinforced Steel', 'Tempered Glass', 'Concrete Foundation', 'Aluminum Cladding'],
        area: {
          total: '125,000 sq ft',
          perFloor: '2,500 sq ft'
        },
        features: [
          'LEED Gold Certified',
          'Smart Building Technology',
          'High-Speed Elevators',
          '24/7 Security',
          'Underground Parking',
          'Rooftop Garden'
        ],
        coordinates: addressResult.coordinates
      };
      
      setSelectedBuilding(buildingData);
    }
  };

  // Mock function to get full landmark data
  const getLandmarkData = (landmarkId: string) => {
    const landmarkDatabase: { [key: string]: any } = {
      'eiffel-tower': {
        id: 'eiffel-tower',
        name: 'Eiffel Tower',
        location: 'Paris',
        country: 'France',
        type: 'Iron Lattice Tower',
        height: '330 meters (1,083 ft)',
        yearBuilt: '1889',
        architect: 'Gustave Eiffel',
        style: 'Structural Expressionism',
        materials: ['Wrought Iron', 'Steel', 'Cast Iron'],
        area: {
          total: '15,625 sq m',
          footprint: '125m × 125m'
        },
        features: ['Observation Decks', 'Restaurant', 'Broadcasting Antenna', 'LED Lighting System'],
        coordinates: { lat: 48.8584, lng: 2.2945 },
        visitorsPerYear: '7 million',
        significance: 'Symbol of France and architectural marvel of the Industrial Revolution',
        funFacts: [
          'Was the world\'s tallest structure until 1930',
          'Weighs approximately 10,100 tons',
          'Painted every 7 years to prevent rust',
          'Can sway up to 7 cm in strong winds'
        ],
        image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        cssStructure: 'lattice-tower'
      },
      'empire-state': {
        id: 'empire-state',
        name: 'Empire State Building',
        location: 'New York City',
        country: 'United States',
        type: 'Art Deco Skyscraper',
        height: '443.2 meters (1,454 ft)',
        yearBuilt: '1931',
        architect: 'Shreve, Lamb & Harmon',
        style: 'Art Deco',
        materials: ['Steel Frame', 'Limestone', 'Granite', 'Brick'],
        area: {
          total: '257,000 sq m',
          footprint: '129m × 61m'
        },
        features: ['Observatory', 'LED Light Show', 'High-Speed Elevators', 'Broadcast Facilities'],
        coordinates: { lat: 40.7484, lng: -73.9857 },
        visitorsPerYear: '4 million',
        significance: 'Icon of American architecture and engineering achievement',
        funFacts: [
          'Built in just 410 days',
          'Has its own ZIP code (10118)',
          'Lightning strikes it about 25 times per year',
          'Featured in over 250 movies'
        ],
        image: 'https://images.pexels.com/photos/2190283/pexels-photo-2190283.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        cssStructure: 'art-deco-tower'
      }
      // Add more landmarks as needed
    };

    return landmarkDatabase[landmarkId] || null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Plan Your Route</h1>
        <p className="text-gray-600">Create a detailed itinerary with 3D building visualization and world landmarks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Route Planning Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Route Name */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Route Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Route Name</label>
              <input
                type="text"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                placeholder="Enter route name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Waypoints with Address Search */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Waypoints</h2>
              <button
                onClick={addWaypoint}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Stop</span>
              </button>
            </div>

            <div className="space-y-3">
              {waypoints.map((waypoint, index) => (
                <div key={waypoint.id} className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                      waypoint.type === 'start' ? 'bg-green-500' : 
                      waypoint.type === 'end' ? 'bg-red-500' : 
                      'bg-blue-500'
                    }`}>
                      {waypoint.type === 'start' ? 'S' : waypoint.type === 'end' ? 'E' : index}
                    </div>
                    <div className="flex-1">
                      <AddressSearch
                        onAddressSelect={(address) => handleAddressSelect(waypoint.id, address)}
                        placeholder={
                          waypoint.type === 'start' ? 'Search starting location or landmark...' :
                          waypoint.type === 'end' ? 'Search destination or landmark...' :
                          'Search waypoint or landmark...'
                        }
                        className="w-full"
                      />
                    </div>
                    {waypoint.type === 'waypoint' && (
                      <button
                        onClick={() => removeWaypoint(waypoint.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  
                  {/* Show building/landmark info if available */}
                  {waypoint.addressData?.details && (
                    <div className={`ml-11 p-3 rounded-lg text-sm ${
                      waypoint.addressData.isLandmark ? 'bg-purple-50' : 'bg-blue-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className={`font-medium ${
                              waypoint.addressData.isLandmark ? 'text-purple-900' : 'text-blue-900'
                            }`}>
                              {waypoint.addressData.details.buildingName}
                            </p>
                            {waypoint.addressData.isLandmark && (
                              <span className="flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                                <Globe className="h-3 w-3 mr-1" />
                                World Landmark
                              </span>
                            )}
                          </div>
                          <p className={`${
                            waypoint.addressData.isLandmark ? 'text-purple-700' : 'text-blue-700'
                          }`}>
                            {waypoint.addressData.details.buildingType} • {waypoint.addressData.details.floors} floors
                          </p>
                          {waypoint.addressData.isLandmark && waypoint.addressData.landmarkData?.visitorsPerYear && (
                            <p className="text-purple-600 text-xs">
                              {waypoint.addressData.landmarkData.visitorsPerYear} visitors/year
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            if (waypoint.addressData!.isLandmark) {
                              const fullLandmarkData = getLandmarkData(waypoint.addressData!.landmarkData.id);
                              setSelectedLandmark(fullLandmarkData);
                            } else {
                              const buildingData = {
                                id: waypoint.addressData!.id,
                                name: waypoint.addressData!.details!.buildingName || 'Building',
                                address: waypoint.addressData!.address,
                                type: waypoint.addressData!.details!.buildingType || waypoint.addressData!.type,
                                height: `${waypoint.addressData!.details!.floors || 20} floors`,
                                floors: waypoint.addressData!.details!.floors || 20,
                                yearBuilt: waypoint.addressData!.details!.yearBuilt || '2020',
                                architect: 'Unknown',
                                color: 'Glass Blue with Steel Frame',
                                materials: ['Reinforced Steel', 'Tempered Glass', 'Concrete Foundation'],
                                area: { total: '125,000 sq ft', perFloor: '2,500 sq ft' },
                                features: ['LEED Certified', 'Smart Building', 'High-Speed Elevators'],
                                coordinates: waypoint.addressData!.coordinates
                              };
                              setSelectedBuilding(buildingData);
                            }
                          }}
                          className={`text-xs font-medium ${
                            waypoint.addressData.isLandmark 
                              ? 'text-purple-600 hover:text-purple-800' 
                              : 'text-blue-600 hover:text-blue-800'
                          }`}
                        >
                          View 3D
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Route Options */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Route Options</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Route Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                  <option>Fastest Route</option>
                  <option>Scenic Route</option>
                  <option>Landmark Tour</option>
                  <option>Avoid Highways</option>
                  <option>Eco-Friendly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                  <option>Car</option>
                  <option>Motorcycle</option>
                  <option>Bicycle</option>
                  <option>Walking</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center">
              <Navigation className="h-5 w-5 mr-2" />
              Calculate Route
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
              <Save className="h-5 w-5 mr-2" />
              Save Draft
            </button>
          </div>
        </div>

        {/* Map/Building/Landmark Viewer Area */}
        <div className="lg:col-span-2">
          {selectedLandmark ? (
            <LandmarkViewer 
              landmark={selectedLandmark} 
              onClose={() => setSelectedLandmark(null)}
            />
          ) : selectedBuilding ? (
            <BuildingViewer 
              building={selectedBuilding} 
              onClose={() => setSelectedBuilding(null)}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-[700px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Map & 3D View</h3>
                <p className="text-gray-600 mb-4">Search for addresses or world landmarks to see route visualization and 3D views</p>
                <div className="grid grid-cols-3 gap-4 max-w-lg">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Route className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-blue-900">Route Planning</p>
                    <p className="text-xs text-blue-700">Optimized paths</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-900">3D Buildings</p>
                    <p className="text-xs text-green-700">360° visualization</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <Globe className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-purple-900">World Landmarks</p>
                    <p className="text-xs text-purple-700">Famous sites</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}