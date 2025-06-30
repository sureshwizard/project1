import React, { useState } from 'react';
import { Search, Filter, Star, MapPin, Clock, Camera, Mountain, Waves, TreePine, Building, Globe, Calendar } from 'lucide-react';
import LandmarkViewer from './LandmarkViewer';

interface LandmarkData {
  id: string;
  name: string;
  location: string;
  country: string;
  type: string;
  height: string;
  yearBuilt: string;
  architect?: string;
  style: string;
  materials: string[];
  area: {
    total: string;
    footprint: string;
  };
  features: string[];
  coordinates: { lat: number; lng: number };
  visitorsPerYear: string;
  significance: string;
  funFacts: string[];
  image: string;
  cssStructure: string;
  category: string;
  rating: number;
  reviews: number;
}

export default function WorldLandmarks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkData | null>(null);

  const categories = [
    { id: 'all', name: 'All Landmarks', icon: Globe },
    { id: 'towers', name: 'Towers', icon: Building },
    { id: 'monuments', name: 'Monuments', icon: Mountain },
    { id: 'bridges', name: 'Bridges', icon: Waves },
    { id: 'religious', name: 'Religious', icon: TreePine },
  ];

  const landmarks: LandmarkData[] = [
    {
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
      cssStructure: 'lattice-tower',
      category: 'towers',
      rating: 4.8,
      reviews: 125000
    },
    {
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
      cssStructure: 'art-deco-tower',
      category: 'towers',
      rating: 4.7,
      reviews: 89000
    },
    {
      id: 'big-ben',
      name: 'Big Ben',
      location: 'London',
      country: 'United Kingdom',
      type: 'Clock Tower',
      height: '96 meters (316 ft)',
      yearBuilt: '1859',
      architect: 'Augustus Pugin',
      style: 'Gothic Revival',
      materials: ['Limestone', 'Cast Iron', 'Steel'],
      area: {
        total: '1,200 sq m',
        footprint: '12m × 12m'
      },
      features: ['Great Bell', 'Clock Faces', 'Belfry', 'Ayrton Light'],
      coordinates: { lat: 51.4994, lng: -0.1245 },
      visitorsPerYear: '2 million',
      significance: 'Symbol of British democracy and parliamentary government',
      funFacts: [
        'Big Ben refers to the bell, not the tower',
        'The tower is officially called Elizabeth Tower',
        'Clock faces are 7 meters in diameter',
        'Chimes every 15 minutes'
      ],
      image: 'https://images.pexels.com/photos/77171/pexels-photo-77171.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      cssStructure: 'gothic-tower',
      category: 'towers',
      rating: 4.6,
      reviews: 67000
    },
    {
      id: 'sydney-opera',
      name: 'Sydney Opera House',
      location: 'Sydney',
      country: 'Australia',
      type: 'Performing Arts Center',
      height: '65 meters (213 ft)',
      yearBuilt: '1973',
      architect: 'Jørn Utzon',
      style: 'Expressionist Modern',
      materials: ['Precast Concrete', 'Ceramic Tiles', 'Steel', 'Glass'],
      area: {
        total: '45,000 sq m',
        footprint: '183m × 120m'
      },
      features: ['Concert Halls', 'Opera Theatre', 'Drama Theatre', 'Restaurants'],
      coordinates: { lat: -33.8568, lng: 151.2153 },
      visitorsPerYear: '8.2 million',
      significance: 'Masterpiece of 20th century architecture and UNESCO World Heritage Site',
      funFacts: [
        'Took 14 years to build',
        'Has over 1 million ceramic tiles',
        'Hosts over 1,500 performances annually',
        'Inspired by orange segments'
      ],
      image: 'https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      cssStructure: 'shell-structure',
      category: 'monuments',
      rating: 4.9,
      reviews: 156000
    },
    {
      id: 'burj-khalifa',
      name: 'Burj Khalifa',
      location: 'Dubai',
      country: 'United Arab Emirates',
      type: 'Supertall Skyscraper',
      height: '828 meters (2,717 ft)',
      yearBuilt: '2010',
      architect: 'Adrian Smith (SOM)',
      style: 'Neo-Futurism',
      materials: ['Reinforced Concrete', 'Steel', 'Aluminum', 'Glass'],
      area: {
        total: '460,000 sq m',
        footprint: '105m × 105m'
      },
      features: ['Observation Decks', 'Hotel', 'Residences', 'Offices', 'Restaurant'],
      coordinates: { lat: 25.1972, lng: 55.2744 },
      visitorsPerYear: '1.87 million',
      significance: 'World\'s tallest building and symbol of modern Dubai',
      funFacts: [
        'Has 163 floors above ground',
        'Contains 57 elevators and 8 escalators',
        'Can be seen from 95 km away',
        'Uses enough concrete to build a sidewalk 1,000 km long'
      ],
      image: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      cssStructure: 'supertall-tower',
      category: 'towers',
      rating: 4.8,
      reviews: 234000
    },
    {
      id: 'taj-mahal',
      name: 'Taj Mahal',
      location: 'Agra',
      country: 'India',
      type: 'Mausoleum',
      height: '73 meters (240 ft)',
      yearBuilt: '1653',
      architect: 'Ustad Ahmad Lahauri',
      style: 'Mughal Architecture',
      materials: ['White Marble', 'Red Sandstone', 'Precious Stones', 'Gold'],
      area: {
        total: '42 acres',
        footprint: '95m × 95m'
      },
      features: ['Central Dome', 'Four Minarets', 'Gardens', 'Reflecting Pool'],
      coordinates: { lat: 27.1751, lng: 78.0421 },
      visitorsPerYear: '6-8 million',
      significance: 'UNESCO World Heritage Site and symbol of eternal love',
      funFacts: [
        'Took 22 years to complete',
        'Required 20,000 artisans',
        'Changes color throughout the day',
        'Cost equivalent to $827 million today'
      ],
      image: 'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      cssStructure: 'dome-structure',
      category: 'religious',
      rating: 4.9,
      reviews: 445000
    },
    {
      id: 'colosseum',
      name: 'Colosseum',
      location: 'Rome',
      country: 'Italy',
      type: 'Ancient Amphitheater',
      height: '48 meters (157 ft)',
      yearBuilt: '80 AD',
      architect: 'Unknown Roman Architects',
      style: 'Roman Architecture',
      materials: ['Travertine', 'Tuff', 'Brick-faced Concrete'],
      area: {
        total: '24,000 sq m',
        footprint: '189m × 156m'
      },
      features: ['Arena Floor', 'Underground Chambers', 'Seating Tiers', 'Entrance Arches'],
      coordinates: { lat: 41.8902, lng: 12.4922 },
      visitorsPerYear: '6 million',
      significance: 'Symbol of Imperial Rome and architectural engineering marvel',
      funFacts: [
        'Could hold 50,000-80,000 spectators',
        'Had a retractable roof system',
        'Hosted gladiatorial contests for 400 years',
        'Partially destroyed by earthquakes'
      ],
      image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      cssStructure: 'amphitheater',
      category: 'monuments',
      rating: 4.7,
      reviews: 378000
    },
    {
      id: 'golden-gate',
      name: 'Golden Gate Bridge',
      location: 'San Francisco',
      country: 'United States',
      type: 'Suspension Bridge',
      height: '227 meters (746 ft)',
      yearBuilt: '1937',
      architect: 'Joseph Strauss',
      style: 'Art Deco',
      materials: ['Steel', 'Concrete', 'Cable Wire'],
      area: {
        total: '90,000 sq m',
        footprint: '2,737m × 27m'
      },
      features: ['Suspension Cables', 'Art Deco Towers', 'Pedestrian Walkway', 'Bike Path'],
      coordinates: { lat: 37.8199, lng: -122.4783 },
      visitorsPerYear: '15 million',
      significance: 'Engineering marvel and symbol of San Francisco',
      funFacts: [
        'Painted in International Orange color',
        'Main span is 1,280 meters long',
        'Took 4 years to build',
        'Withstands winds up to 100 mph'
      ],
      image: 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      cssStructure: 'suspension-bridge',
      category: 'bridges',
      rating: 4.8,
      reviews: 267000
    },
    {
      id: 'christ-redeemer',
      name: 'Christ the Redeemer',
      location: 'Rio de Janeiro',
      country: 'Brazil',
      type: 'Religious Statue',
      height: '38 meters (125 ft)',
      yearBuilt: '1931',
      architect: 'Paul Landowski',
      style: 'Art Deco',
      materials: ['Reinforced Concrete', 'Soapstone'],
      area: {
        total: '1,145 sq m',
        footprint: '28m wingspan'
      },
      features: ['Outstretched Arms', 'Observation Platform', 'Chapel', 'Lightning Rod'],
      coordinates: { lat: -22.9519, lng: -43.2105 },
      visitorsPerYear: '2 million',
      significance: 'Symbol of Christianity and Brazilian culture',
      funFacts: [
        'Weighs 635 metric tons',
        'Arms span 28 meters wide',
        'Struck by lightning frequently',
        'One of the New Seven Wonders'
      ],
      image: 'https://images.pexels.com/photos/351283/pexels-photo-351283.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      cssStructure: 'statue-structure',
      category: 'religious',
      rating: 4.6,
      reviews: 189000
    },
    {
      id: 'leaning-tower',
      name: 'Leaning Tower of Pisa',
      location: 'Pisa',
      country: 'Italy',
      type: 'Bell Tower',
      height: '56 meters (184 ft)',
      yearBuilt: '1372',
      architect: 'Bonanno Pisano',
      style: 'Romanesque',
      materials: ['White Marble', 'Grey Marble'],
      area: {
        total: '285 sq m',
        footprint: '15.5m diameter'
      },
      features: ['Bell Chamber', 'Spiral Staircase', 'Arcaded Galleries', 'Seven Bells'],
      coordinates: { lat: 43.7230, lng: 10.3966 },
      visitorsPerYear: '1 million',
      significance: 'Architectural anomaly and UNESCO World Heritage Site',
      funFacts: [
        'Leans at 3.97 degrees',
        'Construction took 344 years',
        'Has 296 steps to the top',
        'Galileo conducted experiments here'
      ],
      image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      cssStructure: 'leaning-tower',
      category: 'towers',
      rating: 4.5,
      reviews: 156000
    }
  ];

  const filteredLandmarks = landmarks.filter(landmark => {
    const matchesCategory = selectedCategory === 'all' || landmark.category === selectedCategory;
    const matchesSearch = landmark.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         landmark.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         landmark.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">World Landmarks Explorer</h1>
        <p className="text-gray-600">Discover famous landmarks with interactive 3D visualizations and detailed information</p>
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
              placeholder="Search landmarks, locations, countries..."
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

      {/* Featured Landmarks */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Landmarks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLandmarks.slice(0, 2).map((landmark) => (
            <div key={landmark.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src={landmark.image}
                  alt={landmark.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    3D View Available
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{landmark.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {landmark.location}, {landmark.country}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-900">{landmark.rating}</span>
                      <span className="ml-1 text-sm text-gray-600">({landmark.reviews.toLocaleString()})</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {landmark.yearBuilt}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{landmark.significance}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedLandmark(landmark)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    Explore 3D View
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

      {/* All Landmarks Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Landmarks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLandmarks.slice(2).map((landmark) => (
            <div key={landmark.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src={landmark.image}
                  alt={landmark.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    3D
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{landmark.name}</h3>
                <p className="text-sm text-gray-600 flex items-center mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {landmark.location}, {landmark.country}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-900">{landmark.rating}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {landmark.yearBuilt}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{landmark.significance}</p>
                
                <button
                  onClick={() => setSelectedLandmark(landmark)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Explore 3D View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredLandmarks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No landmarks found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Landmark Viewer Modal */}
      {selectedLandmark && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <LandmarkViewer 
              landmark={selectedLandmark} 
              onClose={() => setSelectedLandmark(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}