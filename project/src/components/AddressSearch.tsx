import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Navigation, Clock, Star, Building, Globe } from 'lucide-react';

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

interface AddressSearchProps {
  onAddressSelect: (address: AddressResult) => void;
  placeholder?: string;
  className?: string;
}

export default function AddressSearch({ 
  onAddressSelect, 
  placeholder = "Search for an address or landmark...",
  className = ""
}: AddressSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AddressResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock address data with building information + landmarks
  const mockAddresses: AddressResult[] = [
    // Regular buildings
    {
      id: '1',
      address: '123 Main Street, Downtown, NY 10001',
      type: 'Commercial Building',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      details: {
        buildingName: 'Metropolitan Tower',
        buildingType: 'Office Complex',
        floors: 45,
        yearBuilt: '2018'
      }
    },
    {
      id: '2',
      address: '456 Broadway Avenue, Midtown, NY 10018',
      type: 'Residential Complex',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      details: {
        buildingName: 'Broadway Residences',
        buildingType: 'Apartment Complex',
        floors: 32,
        yearBuilt: '2020'
      }
    },
    // World Landmarks
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

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filteredResults = mockAddresses.filter(address =>
        address.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        address.details?.buildingName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (address.isLandmark && address.landmarkData?.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setResults(filteredResults);
      setIsOpen(true);
      setIsLoading(false);
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleAddressClick = (address: AddressResult) => {
    setQuery(address.address);
    setIsOpen(false);
    onAddressSelect(address);
  };

  const getBuildingIcon = (address: AddressResult) => {
    if (address.isLandmark) {
      return <Globe className="h-4 w-4 text-purple-600" />;
    }
    
    const type = address.type.toLowerCase();
    switch (type) {
      case 'commercial building':
      case 'office complex':
      case 'corporate headquarters':
        return <Building className="h-4 w-4 text-blue-600" />;
      case 'residential complex':
      case 'apartment complex':
        return <Building className="h-4 w-4 text-green-600" />;
      case 'mixed use':
      case 'mixed use development':
        return <Building className="h-4 w-4 text-purple-600" />;
      case 'historic building':
      case 'historic office':
        return <Building className="h-4 w-4 text-amber-600" />;
      case 'financial center':
        return <Building className="h-4 w-4 text-emerald-600" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((address) => (
                <button
                  key={address.id}
                  onClick={() => handleAddressClick(address)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getBuildingIcon(address)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {address.details?.buildingName || 'Building'}
                        </p>
                        <div className="flex items-center space-x-2">
                          {address.isLandmark && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                              World Landmark
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {address.type}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{address.address}</p>
                      
                      {address.details && (
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {address.details.floors && (
                            <span className="flex items-center">
                              <Building className="h-3 w-3 mr-1" />
                              {address.details.floors} floors
                            </span>
                          )}
                          {address.details.yearBuilt && (
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Built {address.details.yearBuilt}
                            </span>
                          )}
                          {address.isLandmark && address.landmarkData?.visitorsPerYear && (
                            <span className="flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              {address.landmarkData.visitorsPerYear} visitors/year
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 && !isLoading ? (
            <div className="px-4 py-6 text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No addresses or landmarks found</p>
              <p className="text-xs">Try a different search term</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}