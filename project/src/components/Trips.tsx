import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Route, MoreVertical, Edit, Trash2, Share, Download } from 'lucide-react';

export default function Trips() {
  const [activeTab, setActiveTab] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  const trips = [
    {
      id: 1,
      name: 'Weekend Mountain Escape',
      date: '2024-01-15',
      distance: '240 miles',
      duration: '4h 30m',
      waypoints: 6,
      status: 'completed',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Coastal Road Trip',
      date: '2024-01-08',
      distance: '180 miles',
      duration: '3h 15m',
      waypoints: 4,
      status: 'completed',
      image: 'https://images.pexels.com/photos/1449729/pexels-photo-1449729.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'Desert Photography Tour',
      date: '2024-01-25',
      distance: '320 miles',
      duration: '5h 45m',
      waypoints: 8,
      status: 'planned',
      image: 'https://images.pexels.com/photos/358238/pexels-photo-358238.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
    {
      id: 4,
      name: 'Historic Towns Route',
      date: '2024-02-02',
      distance: '150 miles',
      duration: '3h 00m',
      waypoints: 12,
      status: 'draft',
      image: 'https://images.pexels.com/photos/161172/cycling-bike-trail-sport-161172.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
    {
      id: 5,
      name: 'Wine Country Explorer',
      date: '2024-01-12',
      distance: '95 miles',
      duration: '2h 30m',
      waypoints: 5,
      status: 'completed',
      image: 'https://images.pexels.com/photos/816608/pexels-photo-816608.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
    {
      id: 6,
      name: 'City Adventure Loop',
      date: '2024-02-10',
      distance: '75 miles',
      duration: '2h 15m',
      waypoints: 10,
      status: 'planned',
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    }
  ];

  const tabs = [
    { id: 'all', name: 'All Trips', count: trips.length },
    { id: 'completed', name: 'Completed', count: trips.filter(t => t.status === 'completed').length },
    { id: 'planned', name: 'Planned', count: trips.filter(t => t.status === 'planned').length },
    { id: 'draft', name: 'Drafts', count: trips.filter(t => t.status === 'draft').length },
  ];

  const filteredTrips = activeTab === 'all' ? trips : trips.filter(trip => trip.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Trips</h1>
        <p className="text-gray-600">Manage your routes and travel history</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.name} ({tab.count})
          </button>
        ))}
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              <img
                src={trip.image}
                alt={trip.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(dropdownOpen === trip.id ? null : trip.id)}
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-600" />
                  </button>

                  {dropdownOpen === trip.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Route
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Share className="h-4 w-4 mr-2" />
                          Share Trip
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </button>
                        <hr className="my-1" />
                        <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                  {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">{trip.name}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {trip.date}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Route className="h-4 w-4 mr-2" />
                  {trip.distance}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {trip.duration}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {trip.waypoints} waypoints
                </div>
              </div>

              <div className="flex space-x-2">
                {trip.status === 'completed' && (
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                )}
                {trip.status === 'planned' && (
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    Start Trip
                  </button>
                )}
                {trip.status === 'draft' && (
                  <button className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                    Continue Planning
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTrips.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Route className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
          <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
          <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all duration-300">
            Plan New Route
          </button>
        </div>
      )}
    </div>
  );
}