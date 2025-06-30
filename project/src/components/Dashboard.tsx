import React from 'react';
import { Plus, Clock, MapPin, TrendingUp, Navigation, Calendar } from 'lucide-react';
import GlobalAddressSearch from './GlobalAddressSearch';

interface DashboardProps {
  onPlanRoute: () => void;
}

export default function Dashboard({ onPlanRoute }: DashboardProps) {
  const recentTrips = [
    {
      id: 1,
      name: 'Weekend Mountain Escape',
      date: '2024-01-15',
      distance: '240 miles',
      duration: '4h 30m',
      status: 'completed',
    },
    {
      id: 2,
      name: 'Coastal Road Trip',
      date: '2024-01-08',
      distance: '180 miles',
      duration: '3h 15m',
      status: 'completed',
    },
    {
      id: 3,
      name: 'City Tour Adventure',
      date: '2024-01-02',
      distance: '95 miles',
      duration: '2h 45m',
      status: 'completed',
    },
  ];

  const upcomingTrips = [
    {
      id: 1,
      name: 'Desert Photography Tour',
      date: '2024-01-25',
      waypoints: 8,
      status: 'planned',
    },
    {
      id: 2,
      name: 'Historic Towns Route',
      date: '2024-02-02',
      waypoints: 12,
      status: 'draft',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Explorer!</h1>
        <p className="text-gray-600">Ready to plan your next adventure?</p>
      </div>

      {/* Global Search Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Search Any Address Worldwide</h2>
          <p className="text-blue-100">Find buildings, landmarks, hospitals, universities, airports, and more with 3D visualization</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <GlobalAddressSearch 
            placeholder="Search any address, building, or landmark worldwide..."
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <MapPin className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium">Buildings</p>
            <p className="text-xs text-blue-200">3D visualization</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Plus className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium">Infrastructure</p>
            <p className="text-xs text-blue-200">Real-time data</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Navigation className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium">Landmarks</p>
            <p className="text-xs text-blue-200">World famous sites</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium">Businesses</p>
            <p className="text-xs text-blue-200">Local insights</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <button
          onClick={onPlanRoute}
          className="group bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-xl text-white hover:from-blue-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Plus className="h-8 w-8 mb-3 group-hover:rotate-90 transition-transform duration-300" />
          <h3 className="font-semibold text-lg mb-1">Plan New Route</h3>
          <p className="text-blue-100 text-sm">Create your next journey</p>
        </button>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <Navigation className="h-8 w-8 text-orange-500 mb-3" />
          <h3 className="font-semibold text-lg mb-1 text-gray-900">Quick Navigate</h3>
          <p className="text-gray-600 text-sm">Get directions instantly</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <MapPin className="h-8 w-8 text-green-500 mb-3" />
          <h3 className="font-semibold text-lg mb-1 text-gray-900">Saved Places</h3>
          <p className="text-gray-600 text-sm">Access your favorites</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <TrendingUp className="h-8 w-8 text-purple-500 mb-3" />
          <h3 className="font-semibold text-lg mb-1 text-gray-900">Analytics</h3>
          <p className="text-gray-600 text-sm">View your travel stats</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Total Distance</h3>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Navigation className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">2,847</p>
          <p className="text-sm text-gray-600">miles traveled</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Routes Completed</h3>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">24</p>
          <p className="text-sm text-gray-600">successful journeys</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Time Saved</h3>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">18.5</p>
          <p className="text-sm text-gray-600">hours optimized</p>
        </div>
      </div>

      {/* Recent and Upcoming Trips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Trips */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Trips</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All</button>
          </div>

          <div className="space-y-4">
            {recentTrips.map((trip) => (
              <div key={trip.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{trip.name}</h3>
                  <p className="text-sm text-gray-600">{trip.distance} • {trip.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{trip.date}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Trips */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Trips</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Manage</button>
          </div>

          <div className="space-y-4">
            {upcomingTrips.map((trip) => (
              <div key={trip.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{trip.name}</h3>
                  <p className="text-sm text-gray-600">{trip.waypoints} waypoints</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{trip.date}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    trip.status === 'planned' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {trip.status === 'planned' ? 'Planned' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onPlanRoute}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all duration-300"
          >
            Plan New Trip
          </button>
        </div>
      </div>
    </div>
  );
}