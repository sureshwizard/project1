import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Search, ChevronDown, Loader, ArrowRight } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface City {
  name: string;
  lat: number;
  lng: number;
  population: number;
  admin_name: string;
  landmarks?: string[];
}

interface CountryCitySelectorProps {
  onCitySelect: (city: City, country: Country) => void;
}

export default function CountryCitySelector({ onCitySelect }: CountryCitySelectorProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for immediate functionality with landmark information
  const mockCountries: Country[] = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  ];

  const mockCitiesData: { [key: string]: City[] } = {
    'US': [
      { 
        name: 'New York', 
        lat: 40.7128, 
        lng: -74.0060, 
        population: 8336817, 
        admin_name: 'New York',
        landmarks: ['Historic City Centre', 'Central Park', 'Brooklyn Bridge', 'One World Trade Center', 'Metropolitan Museum of Art', 'Times Square', 'Statue of Liberty']
      },
      { 
        name: 'Los Angeles', 
        lat: 34.0522, 
        lng: -118.2437, 
        population: 3979576, 
        admin_name: 'California',
        landmarks: ['Hollywood Sign', 'Getty Center', 'Santa Monica Pier', 'Griffith Observatory', 'Venice Beach']
      },
      { 
        name: 'Chicago', 
        lat: 41.8781, 
        lng: -87.6298, 
        population: 2693976, 
        admin_name: 'Illinois',
        landmarks: ['Millennium Park', 'Navy Pier', 'Art Institute of Chicago', 'Willis Tower', 'Lincoln Park Zoo']
      },
      { 
        name: 'San Francisco', 
        lat: 37.7749, 
        lng: -122.4194, 
        population: 881549, 
        admin_name: 'California',
        landmarks: ['Golden Gate Bridge', 'Alcatraz Island', 'Fishermans Wharf', 'Lombard Street', 'Chinatown']
      },
      { 
        name: 'Las Vegas', 
        lat: 36.1699, 
        lng: -115.1398, 
        population: 651319, 
        admin_name: 'Nevada',
        landmarks: ['Las Vegas Strip', 'Bellagio Fountains', 'Red Rock Canyon', 'Fremont Street', 'High Roller']
      },
    ],
    'FR': [
      { 
        name: 'Paris', 
        lat: 48.8566, 
        lng: 2.3522, 
        population: 2161000, 
        admin_name: 'Île-de-France',
        landmarks: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Arc de Triomphe', 'Champs-Élysées', 'Sacré-Cœur', 'Palace of Versailles']
      },
      { 
        name: 'Lyon', 
        lat: 45.7640, 
        lng: 4.8357, 
        population: 515695, 
        admin_name: 'Auvergne-Rhône-Alpes',
        landmarks: ['Basilica of Notre-Dame de Fourvière', 'Vieux Lyon', 'Place Bellecour', 'Musée des Confluences']
      },
      { 
        name: 'Marseille', 
        lat: 43.2965, 
        lng: 5.3698, 
        population: 861635, 
        admin_name: 'Provence-Alpes-Côte d\'Azur',
        landmarks: ['Old Port of Marseille', 'Basilique Notre-Dame de la Garde', 'Château d\'If', 'Calanques National Park']
      },
      { 
        name: 'Nice', 
        lat: 43.7102, 
        lng: 7.2620, 
        population: 342522, 
        admin_name: 'Provence-Alpes-Côte d\'Azur',
        landmarks: ['Promenade des Anglais', 'Old Town Nice', 'Castle Hill', 'Place Masséna']
      },
      { 
        name: 'Cannes', 
        lat: 43.5528, 
        lng: 7.0174, 
        population: 74152, 
        admin_name: 'Provence-Alpes-Côte d\'Azur',
        landmarks: ['Palais des Festivals', 'La Croisette', 'Le Suquet', 'Îles de Lérins']
      },
    ],
    'JP': [
      { 
        name: 'Tokyo', 
        lat: 35.6762, 
        lng: 139.6503, 
        population: 13929286, 
        admin_name: 'Tokyo',
        landmarks: ['Tokyo Skytree', 'Senso-ji Temple', 'Imperial Palace', 'Shibuya Crossing', 'Tokyo Tower', 'Meiji Shrine', 'Tsukiji Fish Market']
      },
      { 
        name: 'Osaka', 
        lat: 34.6937, 
        lng: 135.5023, 
        population: 2691185, 
        admin_name: 'Osaka',
        landmarks: ['Osaka Castle', 'Dotonbori', 'Universal Studios Japan', 'Sumiyoshi Taisha', 'Shitennoji Temple']
      },
      { 
        name: 'Kyoto', 
        lat: 35.0116, 
        lng: 135.7681, 
        population: 1475183, 
        admin_name: 'Kyoto',
        landmarks: ['Fushimi Inari Shrine', 'Kinkaku-ji (Golden Pavilion)', 'Arashiyama Bamboo Grove', 'Kiyomizu-dera', 'Gion District']
      },
      { 
        name: 'Hiroshima', 
        lat: 34.3853, 
        lng: 132.4553, 
        population: 1194034, 
        admin_name: 'Hiroshima',
        landmarks: ['Peace Memorial Park', 'Atomic Bomb Dome', 'Itsukushima Shrine', 'Hiroshima Castle']
      },
      { 
        name: 'Nagoya', 
        lat: 35.1815, 
        lng: 136.9066, 
        population: 2295638, 
        admin_name: 'Aichi',
        landmarks: ['Nagoya Castle', 'Atsuta Shrine', 'Osu Kannon Temple', 'Toyota Commemorative Museum']
      },
    ],
    'GB': [
      { 
        name: 'London', 
        lat: 51.5074, 
        lng: -0.1278, 
        population: 8982000, 
        admin_name: 'England',
        landmarks: ['Big Ben', 'Tower Bridge', 'Buckingham Palace', 'London Eye', 'Tower of London', 'Westminster Abbey', 'British Museum', 'Hyde Park']
      },
      { 
        name: 'Manchester', 
        lat: 53.4808, 
        lng: -2.2426, 
        population: 547000, 
        admin_name: 'England',
        landmarks: ['Manchester Cathedral', 'Old Trafford', 'Manchester Art Gallery', 'Castlefield']
      },
      { 
        name: 'Edinburgh', 
        lat: 55.9533, 
        lng: -3.1883, 
        population: 518500, 
        admin_name: 'Scotland',
        landmarks: ['Edinburgh Castle', 'Royal Mile', 'Arthur\'s Seat', 'Holyrood Palace', 'Princes Street']
      },
      { 
        name: 'Birmingham', 
        lat: 52.4862, 
        lng: -1.8904, 
        population: 1141816, 
        admin_name: 'England',
        landmarks: ['Birmingham Museum', 'Cadbury World', 'Jewellery Quarter', 'Birmingham Back to Backs']
      },
      { 
        name: 'Liverpool', 
        lat: 53.4084, 
        lng: -2.9916, 
        population: 498042, 
        admin_name: 'England',
        landmarks: ['Albert Dock', 'Cavern Club', 'Liverpool Cathedral', 'The Beatles Story', 'Walker Art Gallery']
      },
    ],
    'IT': [
      { 
        name: 'Rome', 
        lat: 41.9028, 
        lng: 12.4964, 
        population: 2872800, 
        admin_name: 'Lazio',
        landmarks: ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Pantheon', 'Roman Forum', 'Spanish Steps', 'Sistine Chapel']
      },
      { 
        name: 'Milan', 
        lat: 45.4642, 
        lng: 9.1900, 
        population: 1396059, 
        admin_name: 'Lombardy',
        landmarks: ['Milan Cathedral (Duomo)', 'La Scala Opera House', 'Sforza Castle', 'Navigli District', 'Brera District']
      },
      { 
        name: 'Venice', 
        lat: 45.4408, 
        lng: 12.3155, 
        population: 261905, 
        admin_name: 'Veneto',
        landmarks: ['St. Mark\'s Square', 'Doge\'s Palace', 'Rialto Bridge', 'Grand Canal', 'Bridge of Sighs', 'Murano Island']
      },
      { 
        name: 'Florence', 
        lat: 43.7696, 
        lng: 11.2558, 
        population: 382258, 
        admin_name: 'Tuscany',
        landmarks: ['Uffizi Gallery', 'Ponte Vecchio', 'Florence Cathedral', 'Palazzo Pitti', 'Boboli Gardens', 'Piazzale Michelangelo']
      },
      { 
        name: 'Naples', 
        lat: 40.8518, 
        lng: 14.2681, 
        population: 967069, 
        admin_name: 'Campania',
        landmarks: ['Mount Vesuvius', 'Pompeii', 'Naples Historic Center', 'Castel dell\'Ovo', 'Royal Palace of Naples']
      },
    ],
    'AE': [
      { 
        name: 'Dubai', 
        lat: 25.2048, 
        lng: 55.2708, 
        population: 3331420, 
        admin_name: 'Dubai',
        landmarks: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Burj Al Arab', 'Dubai Marina', 'Gold Souk', 'Dubai Fountain']
      },
      { 
        name: 'Abu Dhabi', 
        lat: 24.4539, 
        lng: 54.3773, 
        population: 1482816, 
        admin_name: 'Abu Dhabi',
        landmarks: ['Sheikh Zayed Grand Mosque', 'Emirates Palace', 'Louvre Abu Dhabi', 'Yas Island', 'Corniche Beach']
      },
      { 
        name: 'Sharjah', 
        lat: 25.3463, 
        lng: 55.4209, 
        population: 1684649, 
        admin_name: 'Sharjah',
        landmarks: ['Sharjah Art Museum', 'Al Noor Mosque', 'Sharjah Heritage Area', 'Blue Souk']
      },
    ],
    'EG': [
      { 
        name: 'Cairo', 
        lat: 30.0444, 
        lng: 31.2357, 
        population: 9500000, 
        admin_name: 'Cairo Governorate',
        landmarks: ['Pyramids of Giza', 'Great Sphinx', 'Egyptian Museum', 'Khan el-Khalili', 'Citadel of Saladin', 'Islamic Cairo']
      },
      { 
        name: 'Alexandria', 
        lat: 31.2001, 
        lng: 29.9187, 
        population: 5200000, 
        admin_name: 'Alexandria Governorate',
        landmarks: ['Bibliotheca Alexandrina', 'Citadel of Qaitbay', 'Pompey\'s Pillar', 'Montaza Palace', 'Alexandria National Museum']
      },
      { 
        name: 'Giza', 
        lat: 30.0131, 
        lng: 31.2089, 
        population: 4367343, 
        admin_name: 'Giza Governorate',
        landmarks: ['Great Pyramid of Giza', 'Pyramid of Khafre', 'Pyramid of Menkaure', 'Great Sphinx of Giza', 'Solar Boat Museum']
      },
    ]
  };

  useEffect(() => {
    // Simulate loading countries
    setTimeout(() => {
      setCountries(mockCountries);
      setLoadingCountries(false);
    }, 500);
  }, []);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setSelectedCity(null);
    setLoadingCities(true);
    
    // Simulate loading cities
    setTimeout(() => {
      setCities(mockCitiesData[country.code] || []);
      setLoadingCities(false);
    }, 300);
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
  };

  const handleExploreCity = () => {
    if (selectedCity && selectedCountry) {
      onCitySelect(selectedCity, selectedCountry);
    }
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Globe className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore the World</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Select a country and city to discover amazing routes, 3D landmarks, real-time weather, 
          and immersive 360° street views with MyWayMap's advanced exploration platform
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={selectedCountry ? "Search cities..." : "Search countries..."}
          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Countries Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center">
                <Globe className="h-6 w-6 mr-3" />
                Select Country
              </h2>
              {selectedCountry && (
                <button
                  onClick={() => {
                    setSelectedCountry(null);
                    setSelectedCity(null);
                    setCities([]);
                    setSearchTerm('');
                  }}
                  className="text-blue-100 hover:text-white text-sm font-medium"
                >
                  Change Country
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {loadingCountries ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600 text-lg">Loading countries...</span>
              </div>
            ) : selectedCountry ? (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 flex items-center">
                <span className="text-4xl mr-4">{selectedCountry.flag}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedCountry.name}</h3>
                  <p className="text-blue-700 font-medium">Selected country</p>
                </div>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className="w-full text-left p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center group"
                  >
                    <span className="text-2xl mr-4">{country.flag}</span>
                    <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {country.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cities Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
            <h2 className="text-2xl font-bold flex items-center">
              <MapPin className="h-6 w-6 mr-3" />
              Select City
            </h2>
          </div>

          <div className="p-6">
            {!selectedCountry ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Choose a Country First</h3>
                <p className="text-gray-600">Select a country to see available cities</p>
              </div>
            ) : loadingCities ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 animate-spin text-green-600" />
                <span className="ml-3 text-gray-600 text-lg">Loading cities...</span>
              </div>
            ) : cities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No cities found for {selectedCountry.name}</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredCities.map((city, index) => (
                  <button
                    key={index}
                    onClick={() => handleCitySelect(city)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      selectedCity?.name === city.name
                        ? 'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{city.name}</h3>
                        <p className="text-gray-600">
                          {city.admin_name} • {city.population.toLocaleString()} people
                        </p>
                        {city.landmarks && (
                          <div className="mt-2">
                            <p className="text-xs text-blue-600 font-medium">Famous landmarks:</p>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {city.landmarks.slice(0, 3).join(', ')}
                              {city.landmarks.length > 3 && ` +${city.landmarks.length - 3} more`}
                            </p>
                          </div>
                        )}
                      </div>
                      <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                        selectedCity?.name === city.name ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Explore Button */}
      {selectedCity && selectedCountry && (
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-6">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="text-3xl">{selectedCountry.flag}</span>
              <div className="text-left">
                <h3 className="text-2xl font-bold">{selectedCity.name}</h3>
                <p className="text-blue-100">{selectedCountry.name} • {selectedCity.population.toLocaleString()} people</p>
                {selectedCity.landmarks && (
                  <p className="text-blue-200 text-sm mt-1">
                    🏛️ {selectedCity.landmarks.length} famous landmarks to explore
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleExploreCity}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center mx-auto"
            >
              Explore {selectedCity.name} with MyWayMap
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
          
          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">360° Street Views</h4>
              <p className="text-sm text-gray-600">Immersive aerial exploration</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Local Insights</h4>
              <p className="text-sm text-gray-600">Weather, traffic, places</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Smart Routes</h4>
              <p className="text-sm text-gray-600">Optimized path planning</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ChevronDown className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Rich Stories</h4>
              <p className="text-sm text-gray-600">History and culture</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}