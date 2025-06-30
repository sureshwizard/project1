import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  GraduationCap, 
  Plane, 
  Train,
  MapPin,
  Clock,
  Star,
  Phone,
  Globe,
  Navigation,
  Users,
  Calendar,
  Activity,
  Wifi,
  Car,
  Coffee,
  Shield,
  Heart,
  BookOpen,
  Zap,
  Search,
  Filter,
  Eye,
  Info,
  ArrowRight,
  Accessibility
} from 'lucide-react';
import InfrastructureViewer from './InfrastructureViewer';

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
    currentStatus: string;
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

interface CityInfrastructureProps {
  cityName: string;
  coordinates: { lat: number; lng: number };
}

export default function CityInfrastructure({ cityName, coordinates }: CityInfrastructureProps) {
  const [activeCategory, setActiveCategory] = useState<'hospitals' | 'universities' | 'airports' | 'railways'>('hospitals');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<InfrastructureItem | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock comprehensive infrastructure data
  const getInfrastructureData = (cityName: string): { [key: string]: InfrastructureItem[] } => {
    const infrastructureDatabase: { [key: string]: any } = {
      'New York': {
        hospitals: [
          {
            id: 'nyp-weill-cornell',
            name: 'NewYork-Presbyterian/Weill Cornell Medical Center',
            type: 'hospital',
            coordinates: { lat: 40.7648, lng: -73.9540 },
            address: '525 E 68th St, New York, NY 10065',
            rating: 4.2,
            reviews: 1847,
            description: 'Leading academic medical center with cutting-edge research and patient care',
            features: ['Emergency Care', 'Trauma Center', 'Cancer Center', 'Heart Surgery', 'Neurology', 'Pediatrics'],
            operatingHours: '24/7 Emergency, Outpatient: 6 AM - 10 PM',
            contact: {
              phone: '+1 (212) 746-5454',
              website: 'https://www.nyp.org',
              email: 'info@nyp.org'
            },
            specialties: ['Cardiology', 'Oncology', 'Neurosurgery', 'Transplant Surgery', 'Emergency Medicine'],
            capacity: 862,
            yearEstablished: 1877,
            realTimeData: {
              currentStatus: 'Open - Normal Operations',
              waitTime: '45 minutes (Emergency)',
              occupancy: 78,
              availability: 'Accepting patients'
            },
            accessibility: {
              wheelchairAccessible: true,
              elevators: true,
              parkingAvailable: true,
              publicTransport: true
            },
            image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            category: 'Academic Medical Center'
          },
          {
            id: 'mount-sinai',
            name: 'Mount Sinai Hospital',
            type: 'hospital',
            coordinates: { lat: 40.7903, lng: -73.9527 },
            address: '1 Gustave L. Levy Pl, New York, NY 10029',
            rating: 4.1,
            reviews: 2156,
            description: 'Renowned medical center known for innovative treatments and research',
            features: ['Emergency Care', 'Maternity Ward', 'ICU', 'Surgery Center', 'Rehabilitation', 'Mental Health'],
            operatingHours: '24/7 Emergency, Outpatient: 7 AM - 9 PM',
            contact: {
              phone: '+1 (212) 241-6500',
              website: 'https://www.mountsinai.org',
              email: 'info@mountsinai.org'
            },
            specialties: ['Geriatrics', 'Gastroenterology', 'Dermatology', 'Psychiatry', 'Orthopedics'],
            capacity: 1171,
            yearEstablished: 1852,
            realTimeData: {
              currentStatus: 'Open - High Volume',
              waitTime: '65 minutes (Emergency)',
              occupancy: 89,
              availability: 'Limited capacity'
            },
            accessibility: {
              wheelchairAccessible: true,
              elevators: true,
              parkingAvailable: true,
              publicTransport: true
            },
            image: 'https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            category: 'General Hospital'
          },
          {
            id: 'memorial-sloan-kettering',
            name: 'Memorial Sloan Kettering Cancer Center',
            type: 'hospital',
            coordinates: { lat: 40.7635, lng: -73.9533 },
            address: '1275 York Ave, New York, NY 10065',
            rating: 4.6,
            reviews: 987,
            description: 'World-leading cancer treatment and research center',
            features: ['Cancer Treatment', 'Radiation Therapy', 'Chemotherapy', 'Surgery', 'Clinical Trials', 'Support Services'],
            operatingHours: 'Mon-Fri: 8 AM - 6 PM, Emergency: 24/7',
            contact: {
              phone: '+1 (212) 639-2000',
              website: 'https://www.mskcc.org',
              email: 'info@mskcc.org'
            },
            specialties: ['Oncology', 'Hematology', 'Radiation Oncology', 'Surgical Oncology', 'Pediatric Oncology'],
            capacity: 470,
            yearEstablished: 1884,
            realTimeData: {
              currentStatus: 'Open - Scheduled Appointments',
              waitTime: '15 minutes (Scheduled)',
              occupancy: 65,
              availability: 'Appointment required'
            },
            accessibility: {
              wheelchairAccessible: true,
              elevators: true,
              parkingAvailable: true,
              publicTransport: true
            },
            image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            category: 'Specialty Hospital'
          }
        ],
        universities: [
          {
            id: 'columbia-university',
            name: 'Columbia University',
            type: 'university',
            coordinates: { lat: 40.8075, lng: -73.9626 },
            address: '116th St & Broadway, New York, NY 10027',
            rating: 4.5,
            reviews: 3421,
            description: 'Ivy League research university with world-class programs',
            features: ['Research Facilities', 'Libraries', 'Student Housing', 'Sports Complex', 'Medical School', 'Law School'],
            operatingHours: 'Campus: 24/7, Offices: Mon-Fri 9 AM - 5 PM',
            contact: {
              phone: '+1 (212) 854-1754',
              website: 'https://www.columbia.edu',
              email: 'info@columbia.edu'
            },
            specialties: ['Medicine', 'Law', 'Business', 'Engineering', 'Journalism', 'Arts & Sciences'],
            capacity: 33000,
            yearEstablished: 1754,
            realTimeData: {
              currentStatus: 'Open - Academic Session',
              availability: 'Tours available',
              occupancy: 85
            },
            accessibility: {
              wheelchairAccessible: true,
              elevators: true,
              parkingAvailable: true,
              publicTransport: true
            },
            image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            category: 'Ivy League'
          },
          {
            id: 'nyu',
            name: 'New York University',
            type: 'university',
            coordinates: { lat: 40.7295, lng: -73.9965 },
            address: '4 Washington Square N, New York, NY 10003',
            rating: 4.3,
            reviews: 2876,
            description: 'Private research university in the heart of Greenwich Village',
            features: ['Research Centers', 'Student Life', 'Global Campuses', 'Arts Programs', 'Business School', 'Medical Center'],
            operatingHours: 'Campus: 24/7, Admissions: Mon-Fri 9 AM - 5 PM',
            contact: {
              phone: '+1 (212) 998-1212',
              website: 'https://www.nyu.edu',
              email: 'admissions@nyu.edu'
            },
            specialties: ['Film & TV', 'Business', 'Medicine', 'Law', 'Arts', 'Computer Science'],
            capacity: 51848,
            yearEstablished: 1831,
            realTimeData: {
              currentStatus: 'Open - Regular Operations',
              availability: 'Campus tours daily',
              occupancy: 92
            },
            accessibility: {
              wheelchairAccessible: true,
              elevators: true,
              parkingAvailable: false,
              publicTransport: true
            },
            image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            category: 'Private Research'
          },
          {
            id: 'fordham-university',
            name: 'Fordham University',
            type: 'university',
            coordinates: { lat: 40.8618, lng: -73.8854 },
            address: '441 E Fordham Rd, Bronx, NY 10458',
            rating: 4.2,
            reviews: 1543,
            description: 'Jesuit research university with strong liberal arts tradition',
            features: ['Liberal Arts', 'Business School', 'Law School', 'Graduate Programs', 'Campus Ministry', 'Athletics'],
            operatingHours: 'Campus: 6 AM - 11 PM, Offices: Mon-Fri 8:30 AM - 4:30 PM',
            contact: {
              phone: '+1 (718) 817-1000',
              website: 'https://www.fordham.edu',
              email: 'info@fordham.edu'
            },
            specialties: ['Liberal Arts', 'Business', 'Law', 'Education', 'Social Work', 'Theology'],
            capacity: 16556,
            yearEstablished: 1841,
            realTimeData: {
              currentStatus: 'Open - Academic Year',
              availability: 'Guided tours available',
              occupancy: 78
            },
            accessibility: {
              wheelchairAccessible: true,
              elevators: true,
              parkingAvailable: true,
              publicTransport: true
            },
            image: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            category: 'Private Catholic'
          }
        ],
        airports: [
          {
            id: 'jfk-airport',
            name: 'John F. Kennedy International Airport',
            type: 'airport',
            coordinates: { lat: 40.6413, lng: -73.7781 },
            address: 'Queens, NY 11430',
            rating: 3.8,
            reviews: 15420,
            description: 'Major international gateway serving New York City',
            features: ['International Flights', 'Duty Free Shopping', 'Restaurants', 'Lounges', 'Car Rental', 'Hotels'],
            operatingHours: '24/7 Operations',
            contact: {
              phone: '+1 (718) 244-4444',
              website: 'https://www.jfkairport.com',
              email: 'info@jfkairport.com'
            },
            specialties: ['International Hub', 'Cargo Operations', 'Private Aviation', 'Transit Hub'],
            capacity: 62500000,
            yearEstablished: 1948,
            realTimeData: {
              currentStatus: 'Operational - Normal',
              delays: 'Average 15 min departure delay',
              nextDeparture: 'Flight AA123 to London - 14:30',
              occupancy: 67
            },
            accessibility: {
              wheelchairAccessible: true,
              elevators: true,
              parkingAvailable: true,
              publicTransport: true
            },
            image: 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            category: 'International Hub'
          },
          {
            id: 'laguardia-airport',
            name: 'LaGuardia Airport',
            type: 'airport',
            coordinates: { lat: 40.7769, lng: -73.8740 },
            address: 'East Elmhurst, NY 11371',
            rating: 3.5,
            reviews: 8934,
            description: 'Domestic hub with newly renovated terminals',
            features: ['Domestic Flights', 'Food Courts', 'Shopping', 'Business Centers', 'Ground Transportation'],
            operatingHours: '24/7 Operations',
            contact: {
              phone: '+1 (718) 533-3400',
              website: 'https://www.laguardiaairport.com',
              email: 'info@laguardiaairport.com'
            },
            specialties: ['Domestic Hub', 'Business Travel', 'Regional Flights'],
            capacity: 31000000,
            yearEstablished: 1939,
            realTimeData: {
              currentStatus: 'Operational - Busy',
              delays: 'Average 25 min departure delay',
              nextDeparture: 'Flight DL456 to Atlanta - 15:15',
              occupancy: 82
            },
            accessibility: {
              wheelchairAccessible: true,
              elevators: true,
              parkingAvailable: true,
              publicTransport: true
            },
            image: 'https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            category: 'Domestic Hub'
          },
          {
            id: 'newark-airport',
            name: 'Newark Liberty International Airport',
            type: 'airport',
            coordinates: { lat: 40.6895, lng: -74.1745 },
            address: '3 Brewster Rd, Newark, NJ 07114',
            rating: 3.6,
            reviews: 11267,
            description: 'Major international airport serving the New York metropolitan area',
            features: ['International & Domestic', 'United Hub', 'Shopping', 'Dining', 'Business Services', 'Hotels'],
            operatingHours: '24/7 Operations',
            contact: {
              phone: '+1 (973) 961-6000',
              website: 'https://www.newarkairport.com',
              email: 'info@newarkairport.com'
            },
            specialties: ['United Hub', 'International Gateway', 'Cargo Hub'],
            capacity: 46300000,
            yearEstablished: 1928,
            realTimeData: {
              currentStatus: 'Operational - Normal',
              delays: 'Average 10 min departure delay',
              nextDeparture: 'Flight UA789 to San Francisco - 16:45',
              occupancy: 71
            },
            accessibility: {
              wheelchairAccessible: true,
              elevators: true,
              parkingAvailable: true,
              publicTransport: true
            },
            image: 'https://images.pexels.com/photos/723240/pexels-photo-723240.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            category: 'International Gateway'
          }
        ],
        railways: [
          {
            id: 'penn-station',
            name: 'Pennsylvania Station (Penn Station)',
            type: 'railway',
            coordinates: { lat: 40.7505, lng: -73.9934 },
            address: '4 Pennsylvania Plaza, New York, NY 10001',
            rating: 3.2,
            reviews: 7834,
            description: 'Major transportation hub serving Amtrak, NJ Transit, and LIRR',
            features: ['Amtrak Services', 'NJ Transit', 'LIRR', 'Subway Access', 'Shopping', 'Dining'],
            operatingHours: '24/7 Operations',
            contact: {
              phone: '+1 (212) 630-6401',
              website: 'https://www.amtrak.com',
              email: 'info@amtrak.com'
            },
            specialties: ['Long Distance Rail', 'Regional Rail', 'Commuter Rail', 'Subway Hub'],
            capacity: 650000,
            yearEstablished: 1910,
            realTimeData: {
              currentStatus: 'Operational - Heavy Traffic',
              nextDeparture: 'Acela Express to Boston - 14:20',
              delays: 'Northeast Regional delayed 20 minutes',
              occupancy: 88
            },
            accessibility: {
              wheelchairAccessible: true,
              elevators: true,
              parkingAvailable: false,
              publicTransport: true
            },
            image: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            category: 'Major Hub'
          },
          {
            id: 'grand-central',
            name: 'Grand Central Terminal',
            type: 'railway',
            coordinates: { lat: 40.7527, lng: -73.9772 },
            address: '89 E 42nd St, New York, NY 10017',
            rating: 4.4,
            reviews: 12456,
            description: 'Historic terminal serving Metro-North Railroad with iconic architecture',
            features: ['Metro-North', 'Subway Access', 'Shopping', 'Dining', 'Food Market', 'Tours'],
            operatingHours: '5:30 AM - 2:00 AM',
            contact: {
              phone: '+1 (212) 340-2583',
              website: 'https://www.grandcentralterminal.com',
              email: 'info@grandcentral.com'
            },
            specialties: ['Commuter Rail', 'Historic Architecture', 'Shopping Destination', 'Tourist Attraction'],
            capacity: 750000,
            yearEstablished: 1913,
            realTimeData: {
              currentStatus: 'Operational - Normal',
              nextDeparture: 'Express to White Plains - 14:35',
              delays: 'All trains on time',
              occupancy: 65
            },
            accessibility: {
              wheelchairAccessible: true,
              elevators: true,
              parkingAvailable: false,
              publicTransport: true
            },
            image: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            category: 'Historic Terminal'
          },
          {
            id: 'atlantic-terminal',
            name: 'Atlantic Terminal',
            type: 'railway',
            coordinates: { lat: 40.6844, lng: -73.9767 },
            address: '139 Flatbush Ave, Brooklyn, NY 11217',
            rating: 3.9,
            reviews: 4521,
            description: 'Major Brooklyn transportation hub connecting LIRR and subway lines',
            features: ['LIRR Services', 'Subway Hub', 'Shopping Mall', 'Dining', 'Barclays Center Access'],
            operatingHours: '24/7 Operations',
            contact: {
              phone: '+1 (718) 217-5477',
              website: 'https://www.atlanticterminal.com',
              email: 'info@atlanticterminal.com'
            },
            specialties: ['Brooklyn Hub', 'Sports Venue Access', 'Shopping Center', 'Transit Hub'],
            capacity: 200000,
            yearEstablished: 1877,
            realTimeData: {
              currentStatus: 'Operational - Moderate Traffic',
              nextDeparture: 'Train to Jamaica - 14:42',
              delays: 'Minor delays on some lines',
              occupancy: 72
            },
            accessibility: {
              wheelchairAccessible: true,
              elevators: true,
              parkingAvailable: true,
              publicTransport: true
            },
            image: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            category: 'Regional Hub'
          }
        ]
      }
    };

    return infrastructureDatabase[cityName] || {
      hospitals: [],
      universities: [],
      airports: [],
      railways: []
    };
  };

  const infrastructureData = getInfrastructureData(cityName);
  const currentData = infrastructureData[activeCategory] || [];

  const filteredData = currentData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { 
      id: 'hospitals', 
      name: 'Hospitals', 
      icon: Heart, 
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      count: infrastructureData.hospitals?.length || 0
    },
    { 
      id: 'universities', 
      name: 'Universities', 
      icon: GraduationCap, 
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      count: infrastructureData.universities?.length || 0
    },
    { 
      id: 'airports', 
      name: 'Airports', 
      icon: Plane, 
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      count: infrastructureData.airports?.length || 0
    },
    { 
      id: 'railways', 
      name: 'Railway Stations', 
      icon: Train, 
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      count: infrastructureData.railways?.length || 0
    }
  ];

  const getStatusColor = (status: string) => {
    if (status.includes('Normal') || status.includes('Open')) return 'text-green-600 bg-green-100';
    if (status.includes('Busy') || status.includes('High')) return 'text-orange-600 bg-orange-100';
    if (status.includes('Closed') || status.includes('Emergency')) return 'text-red-600 bg-red-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 90) return 'bg-red-500';
    if (occupancy >= 70) return 'bg-orange-500';
    if (occupancy >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">City Infrastructure</h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Explore {cityName}'s essential infrastructure with real-time data, operating hours, 
          and detailed insights for hospitals, universities, airports, and railway stations.
        </p>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as any)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                activeCategory === category.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{category.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{category.count} locations</p>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                activeCategory === category.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {activeCategory === category.id ? 'Selected' : 'View All'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${categories.find(c => c.id === activeCategory)?.name.toLowerCase()}...`}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="text-gray-700">Filters</span>
        </button>
      </div>

      {/* Infrastructure Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredData.map((item) => {
          const categoryInfo = categories.find(c => c.id === activeCategory);
          const IconComponent = categoryInfo?.icon || Building2;
          
          return (
            <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Header Image */}
              <div className="relative h-48">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.realTimeData?.currentStatus || 'Unknown')}`}>
                    {item.realTimeData?.currentStatus || 'Status Unknown'}
                  </span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${categoryInfo?.bgColor} ${categoryInfo?.textColor}`}>
                    <IconComponent className="h-4 w-4" />
                    <span className="text-xs font-medium">{item.category}</span>
                  </div>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-white/90 text-sm flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {item.address.split(',')[0]}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Rating and Reviews */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{item.rating}</span>
                    <span className="ml-1 text-sm text-gray-500">({item.reviews.toLocaleString()})</span>
                  </div>
                  {item.realTimeData?.occupancy && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Occupancy:</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-full rounded-full ${getOccupancyColor(item.realTimeData.occupancy)}`}
                          style={{ width: `${item.realTimeData.occupancy}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{item.realTimeData.occupancy}%</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{item.description}</p>

                {/* Real-time Data */}
                {item.realTimeData && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center">
                      <Activity className="h-4 w-4 mr-1 text-blue-600" />
                      Live Information
                    </h4>
                    <div className="space-y-1 text-xs">
                      {item.realTimeData.waitTime && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Wait Time:</span>
                          <span className="font-medium">{item.realTimeData.waitTime}</span>
                        </div>
                      )}
                      {item.realTimeData.nextDeparture && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Next Departure:</span>
                          <span className="font-medium text-blue-600">{item.realTimeData.nextDeparture}</span>
                        </div>
                      )}
                      {item.realTimeData.delays && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Delays:</span>
                          <span className="font-medium text-orange-600">{item.realTimeData.delays}</span>
                        </div>
                      )}
                      {item.realTimeData.availability && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Availability:</span>
                          <span className="font-medium">{item.realTimeData.availability}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Key Features */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">Key Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {item.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                    {item.features.length > 3 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{item.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{item.operatingHours}</span>
                </div>

                {/* Accessibility Icons */}
                <div className="flex items-center space-x-3 mb-4">
                  {item.accessibility.wheelchairAccessible && (
                    <div className="flex items-center text-green-600" title="Wheelchair Accessible">
                      <Accessibility className="h-4 w-4" />
                    </div>
                  )}
                  {item.accessibility.parkingAvailable && (
                    <div className="flex items-center text-blue-600" title="Parking Available">
                      <Car className="h-4 w-4" />
                    </div>
                  )}
                  {item.accessibility.publicTransport && (
                    <div className="flex items-center text-purple-600" title="Public Transport Access">
                      <Navigation className="h-4 w-4" />
                    </div>
                  )}
                  {item.contact.website && (
                    <div className="flex items-center text-gray-600" title="Website Available">
                      <Globe className="h-4 w-4" />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-sm flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Explore 3D
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <Info className="h-4 w-4" />
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <Navigation className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or explore other categories</p>
          <button
            onClick={() => setSearchQuery('')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Infrastructure Viewer Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <InfrastructureViewer 
              infrastructure={selectedItem} 
              onClose={() => setSelectedItem(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}