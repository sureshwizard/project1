import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Phone, 
  Globe, 
  Star,
  Heart,
  GraduationCap,
  Plane,
  Train,
  Activity,
  Users,
  Calendar,
  Accessibility,
  Car,
  Navigation,
  Wifi,
  Coffee,
  Shield,
  Zap,
  Building2,
  Eye,
  Maximize,
  Minimize,
  RotateCcw,
  Info,
  Share,
  Download,
  Camera
} from 'lucide-react';
import GoogleMaps3DViewer from './GoogleMaps3DViewer';

interface InfrastructureItem {
  id: string;
  name: string;
  type: 'hospital' | 'university' | 'airport' | 'railway';
  coordinates: { lat: number; lng: number };
  address: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  operatingHours: string;
  contact: {
    phone?: string;
    website?: string;
    email?: string;
  };
  specialties?: string[];
  capacity?: number;
  yearEstablished?: number;
  realTimeData?: {
    status: string;
    waitTime?: string;
    occupancy?: number;
    nextDeparture?: string;
    delays?: string;
    availability?: string;
  };
  accessibility: {
    wheelchairAccessible: boolean;
    elevators: boolean;
    parkingAvailable: boolean;
    publicTransport: boolean;
  };
  image: string;
  category: string;
}

interface InfrastructureViewerProps {
  infrastructure: InfrastructureItem;
  onClose: () => void;
}

export default function InfrastructureViewer({ infrastructure, onClose }: InfrastructureViewerProps) {
  const [viewMode, setViewMode] = useState<'overview' | '3d' | 'details' | 'realtime' | 'services'>('overview');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hospital': return Heart;
      case 'university': return GraduationCap;
      case 'airport': return Plane;
      case 'railway': return Train;
      default: return Building2;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hospital': return 'from-red-500 to-pink-600';
      case 'university': return 'from-blue-500 to-indigo-600';
      case 'airport': return 'from-green-500 to-emerald-600';
      case 'railway': return 'from-purple-500 to-violet-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'text-gray-600 bg-gray-100';
    if (status.includes('Normal') || status.includes('Open')) return 'text-green-600 bg-green-100';
    if (status.includes('Busy') || status.includes('High')) return 'text-orange-600 bg-orange-100';
    if (status.includes('Closed') || status.includes('Emergency')) return 'text-red-600 bg-red-100';
    return 'text-blue-600 bg-blue-100';
  };

  const IconComponent = getTypeIcon(infrastructure.type);
  const typeColor = getTypeColor(infrastructure.type);

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'}`}>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${typeColor} text-white px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <IconComponent className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{infrastructure.name}</h2>
                <p className="text-white/90 text-sm flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {infrastructure.address}
                </p>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-300" />
                    <span className="text-sm">{infrastructure.rating} ({infrastructure.reviews.toLocaleString()})</span>
                  </div>
                  {infrastructure.realTimeData?.status && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(infrastructure.realTimeData.status)}`}>
                      {infrastructure.realTimeData.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: '3d', label: '3D View', icon: Building2 },
              { id: 'realtime', label: 'Live Data', icon: Activity },
              { id: 'services', label: 'Services', icon: Info },
              { id: 'details', label: 'Details', icon: MapPin }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as any)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className={`${isFullscreen ? 'h-screen' : 'h-96'} relative overflow-hidden`}>
          {viewMode === 'overview' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Hero Image */}
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <img
                    src={infrastructure.image}
                    alt={infrastructure.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{infrastructure.category}</h3>
                      <p className="text-gray-700">{infrastructure.description}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {infrastructure.yearEstablished && (
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{infrastructure.yearEstablished}</p>
                      <p className="text-sm text-gray-600">Established</p>
                    </div>
                  )}
                  {infrastructure.capacity && (
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{infrastructure.capacity.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Capacity</p>
                    </div>
                  )}
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{infrastructure.rating}</p>
                    <p className="text-sm text-gray-600">Rating</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <Activity className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">24/7</p>
                    <p className="text-sm text-gray-600">Available</p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Operating Hours
                  </h3>
                  <p className="text-gray-700">{infrastructure.operatingHours}</p>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    {infrastructure.contact.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-600" />
                        <span className="text-gray-700">{infrastructure.contact.phone}</span>
                      </div>
                    )}
                    {infrastructure.contact.website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-gray-600" />
                        <a href={infrastructure.contact.website} className="text-blue-600 hover:underline">
                          {infrastructure.contact.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === '3d' && (
            <GoogleMaps3DViewer
              landmark={{
                name: infrastructure.name,
                coordinates: infrastructure.coordinates,
                location: infrastructure.address.split(',')[0],
                country: 'United States'
              }}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            />
          )}

          {viewMode === 'realtime' && infrastructure.realTimeData && (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Activity className="h-6 w-6 mr-3 text-blue-600" />
                  Live Information & Real-time Data
                </h3>

                {/* Current Status */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Current Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Operational Status</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(infrastructure.realTimeData.status)}`}>
                          {infrastructure.realTimeData.status || 'Unknown'}
                        </span>
                      </div>
                    </div>
                    
                    {infrastructure.realTimeData.occupancy && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600">Current Occupancy</span>
                          <span className="font-bold text-gray-900">{infrastructure.realTimeData.occupancy}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              infrastructure.realTimeData.occupancy >= 90 ? 'bg-red-500' :
                              infrastructure.realTimeData.occupancy >= 70 ? 'bg-orange-500' :
                              infrastructure.realTimeData.occupancy >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${infrastructure.realTimeData.occupancy}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Updates */}
                {(infrastructure.realTimeData.waitTime || infrastructure.realTimeData.nextDeparture || infrastructure.realTimeData.delays) && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                      Live Updates
                    </h4>
                    <div className="space-y-3">
                      {infrastructure.realTimeData.waitTime && (
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-gray-700">Current Wait Time</span>
                          <span className="font-bold text-blue-600">{infrastructure.realTimeData.waitTime}</span>
                        </div>
                      )}
                      {infrastructure.realTimeData.nextDeparture && (
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-gray-700">Next Departure</span>
                          <span className="font-bold text-green-600">{infrastructure.realTimeData.nextDeparture}</span>
                        </div>
                      )}
                      {infrastructure.realTimeData.delays && (
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <span className="text-gray-700">Current Delays</span>
                          <span className="font-bold text-orange-600">{infrastructure.realTimeData.delays}</span>
                        </div>
                      )}
                      {infrastructure.realTimeData.availability && (
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <span className="text-gray-700">Availability</span>
                          <span className="font-bold text-purple-600">{infrastructure.realTimeData.availability}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Real-time Insights */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="font-semibold text-gray-900 mb-4">Real-time Insights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <p className="font-bold text-gray-900">Live Monitoring</p>
                      <p className="text-sm text-gray-600">24/7 status updates</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <p className="font-bold text-gray-900">Instant Alerts</p>
                      <p className="text-sm text-gray-600">Real-time notifications</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <p className="font-bold text-gray-900">Reliable Data</p>
                      <p className="text-sm text-gray-600">Verified information</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'services' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Services & Amenities</h3>

                {/* Main Features */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Main Services</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {infrastructure.features.map((feature, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Zap className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-gray-900 font-medium text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialties */}
                {infrastructure.specialties && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {infrastructure.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accessibility */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Accessibility & Transportation</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-lg text-center ${
                      infrastructure.accessibility.wheelchairAccessible ? 'bg-green-50' : 'bg-gray-50'
                    }`}>
                      <Accessibility className={`h-6 w-6 mx-auto mb-2 ${
                        infrastructure.accessibility.wheelchairAccessible ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <p className="text-sm font-medium">Wheelchair Access</p>
                      <p className="text-xs text-gray-600">
                        {infrastructure.accessibility.wheelchairAccessible ? 'Available' : 'Not Available'}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg text-center ${
                      infrastructure.accessibility.parkingAvailable ? 'bg-green-50' : 'bg-gray-50'
                    }`}>
                      <Car className={`h-6 w-6 mx-auto mb-2 ${
                        infrastructure.accessibility.parkingAvailable ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <p className="text-sm font-medium">Parking</p>
                      <p className="text-xs text-gray-600">
                        {infrastructure.accessibility.parkingAvailable ? 'Available' : 'Not Available'}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg text-center ${
                      infrastructure.accessibility.publicTransport ? 'bg-green-50' : 'bg-gray-50'
                    }`}>
                      <Navigation className={`h-6 w-6 mx-auto mb-2 ${
                        infrastructure.accessibility.publicTransport ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <p className="text-sm font-medium">Public Transport</p>
                      <p className="text-xs text-gray-600">
                        {infrastructure.accessibility.publicTransport ? 'Accessible' : 'Not Accessible'}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg text-center ${
                      infrastructure.accessibility.elevators ? 'bg-green-50' : 'bg-gray-50'
                    }`}>
                      <Building2 className={`h-6 w-6 mx-auto mb-2 ${
                        infrastructure.accessibility.elevators ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <p className="text-sm font-medium">Elevators</p>
                      <p className="text-xs text-gray-600">
                        {infrastructure.accessibility.elevators ? 'Available' : 'Not Available'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'details' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Detailed Information</h3>

                {/* Location Details */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Location & Contact
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 text-sm">Full Address:</span>
                      <p className="font-medium">{infrastructure.address}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Coordinates:</span>
                      <p className="font-medium">{infrastructure.coordinates.lat}°, {infrastructure.coordinates.lng}°</p>
                    </div>
                    {infrastructure.contact.phone && (
                      <div>
                        <span className="text-gray-600 text-sm">Phone:</span>
                        <p className="font-medium">{infrastructure.contact.phone}</p>
                      </div>
                    )}
                    {infrastructure.contact.email && (
                      <div>
                        <span className="text-gray-600 text-sm">Email:</span>
                        <p className="font-medium">{infrastructure.contact.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{infrastructure.rating}</p>
                      <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{infrastructure.reviews.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Reviews</p>
                    </div>
                    {infrastructure.capacity && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{infrastructure.capacity.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Capacity</p>
                      </div>
                    )}
                    {infrastructure.yearEstablished && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{infrastructure.yearEstablished}</p>
                        <p className="text-sm text-gray-600">Year Established</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Operating Information */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-green-600" />
                    Operating Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 text-sm">Operating Hours:</span>
                      <p className="font-medium">{infrastructure.operatingHours}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Category:</span>
                      <p className="font-medium">{infrastructure.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Type:</span>
                      <p className="font-medium capitalize">{infrastructure.type}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Share className="h-4 w-4" />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Camera className="h-4 w-4" />
                <span>Photos</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}