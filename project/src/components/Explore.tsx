import React, { useState } from 'react';
import { Search, Filter, Star, MapPin, Clock, Camera, Mountain, Waves, TreePine, Building } from 'lucide-react';

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: MapPin },
    { id: 'mountains', name: 'Mountains', icon: Mountain },
    { id: 'coastal', name: 'Coastal', icon: Waves },
    { id: 'nature', name: 'Nature', icon: TreePine },
    { id: 'urban', name: 'Urban', icon: Building },
  ];

  const destinations = [
    {
      id: 1,
      name: 'Blue Ridge Parkway',
      category: 'mountains',
      location: 'Virginia & North Carolina',
      rating: 4.8,
      reviews: 2847,
      duration: '2-5 hours',
      difficulty: 'Easy',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      description: 'Scenic mountain drive with breathtaking vistas and hiking trails.'
    },
    {
      id: 2,
      name: 'Pacific Coast Highway',
      category: 'coastal',
      location: 'California',
      rating: 4.9,
      reviews: 3521,
      duration: '4-8 hours',
      difficulty: 'Moderate',
      image: 'https://images.pexels.com/photos/1449729/pexels-photo-1449729.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      description: 'Iconic coastal route with stunning ocean views and charming towns.'
    },
    {
      id: 3,
      name: 'Antelope Canyon',
      category: 'nature',
      location: 'Arizona',
      rating: 4.7,
      reviews: 1923,
      duration: '1-2 hours',
      difficulty: 'Easy',
      image: 'https://images.pexels.com/photos/358238/pexels-photo-358238.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      description: 'Mesmerizing slot canyon with incredible light beams and rock formations.'
    },
    {
      id: 4,
      name: 'Napa Valley Wine Route',
      category: 'nature',
      location: 'California',
      rating: 4.6,
      reviews: 2156,
      duration: '3-6 hours',
      difficulty: 'Easy',
      image: 'https://images.pexels.com/photos/816608/pexels-photo-816608.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      description: 'Rolling vineyards and world-class wineries in beautiful countryside.'
    },
    {
      id: 5,
      name: 'San Francisco City Loop',
      category: 'urban',
      location: 'California',
      rating: 4.5,
      reviews: 1847,
      duration: '2-4 hours',
      difficulty: 'Moderate',
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      description: 'Historic neighborhoods, iconic bridges, and stunning city views.'
    },
    {
      id: 6,
      name: 'Great Smoky Mountains',
      category: 'mountains',
      location: 'Tennessee & North Carolina',
      rating: 4.8,
      reviews: 3247,
      duration: '3-7 hours',
      difficulty: 'Moderate',
      image: 'https://images.pexels.com/photos/161172/cycling-bike-trail-sport-161172.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      description: 'Misty mountains with diverse wildlife and ancient forests.'
    }
  ];

  const filteredDestinations = destinations.filter(dest => {
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Destinations</h1>
        <p className="text-gray-600">Discover amazing routes and hidden gems around the world</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations, locations..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700">More Filters</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Routes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDestinations.slice(0, 2).map((destination) => (
            <div key={destination.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(destination.difficulty)}`}>
                    {destination.difficulty}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{destination.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {destination.location}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-900">{destination.rating}</span>
                      <span className="ml-1 text-sm text-gray-600">({destination.reviews})</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {destination.duration}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{destination.description}</p>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-teal-700 transition-all duration-300">
                    Plan Route
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Destinations */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.slice(2).map((destination) => (
            <div key={destination.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(destination.difficulty)}`}>
                    {destination.difficulty}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{destination.name}</h3>
                <p className="text-sm text-gray-600 flex items-center mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {destination.location}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-900">{destination.rating}</span>
                    <span className="ml-1 text-sm text-gray-600">({destination.reviews})</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {destination.duration}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{destination.description}</p>
                
                <button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-teal-700 transition-all duration-300">
                  Plan Route
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredDestinations.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all duration-300"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}