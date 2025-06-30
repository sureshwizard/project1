import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Cloud, 
  Navigation, 
  Star,
  Accessibility,
  Volume2,
  Share,
  Download,
  Eye,
  Route,
  Clock,
  Users,
  Camera,
  Thermometer,
  Wind,
  Building,
  Globe,
  Heart,
  GraduationCap,
  Plane,
  Train,
  Play,
  Pause,
  VolumeX,
  BookOpen,
  Calendar,
  Award,
  Zap
} from 'lucide-react';
import GoogleMaps3DViewer from './GoogleMaps3DViewer';
import CityInfrastructure from './CityInfrastructure';

interface City {
  name: string;
  lat: number;
  lng: number;
  population: number;
  admin_name: string;
  landmarks?: string[];
}

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface CityExplorerProps {
  city: City;
  country: Country;
  onBack: () => void;
}

export default function CityExplorer({ city, country, onBack }: CityExplorerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [selectedLandmark, setSelectedLandmark] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Enhanced landmark data for New York with specific coordinates
  const getLandmarkData = (cityName: string) => {
    const landmarkDatabase: { [key: string]: any[] } = {
      'New York': [
        {
          name: 'Historic City Centre (Financial District)',
          lat: 40.7074,
          lng: -74.0113,
          rating: 4.8,
          types: ['historic_area', 'financial_district'],
          vicinity: 'Lower Manhattan',
          description: 'The historic heart of New York with Wall Street, Trinity Church, and colonial architecture',
          photo_reference: null,
          category: 'Historic'
        },
        {
          name: 'Central Park',
          lat: 40.7829,
          lng: -73.9654,
          rating: 4.6,
          types: ['park', 'tourist_attraction'],
          vicinity: 'Manhattan',
          description: 'Iconic 843-acre park in the heart of Manhattan with lakes, meadows, and recreational facilities',
          photo_reference: null,
          category: 'Nature'
        },
        {
          name: 'Brooklyn Bridge',
          lat: 40.7061,
          lng: -73.9969,
          rating: 4.7,
          types: ['bridge', 'tourist_attraction'],
          vicinity: 'Brooklyn/Manhattan',
          description: 'Historic suspension bridge connecting Manhattan and Brooklyn with stunning city views',
          photo_reference: null,
          category: 'Architecture'
        },
        {
          name: 'One World Trade Center',
          lat: 40.7127,
          lng: -74.0134,
          rating: 4.5,
          types: ['skyscraper', 'memorial'],
          vicinity: 'Financial District',
          description: 'The tallest building in NYC, built as a memorial and symbol of resilience',
          photo_reference: null,
          category: 'Modern'
        },
        {
          name: 'Metropolitan Museum of Art',
          lat: 40.7794,
          lng: -73.9632,
          rating: 4.7,
          types: ['museum', 'art_gallery'],
          vicinity: 'Upper East Side',
          description: 'One of the world\'s largest and most prestigious art museums',
          photo_reference: null,
          category: 'Culture'
        },
        {
          name: 'Times Square',
          lat: 40.7580,
          lng: -73.9855,
          rating: 4.3,
          types: ['tourist_attraction', 'commercial_area'],
          vicinity: 'Midtown Manhattan',
          description: 'The bright lights and energy of NYC\'s entertainment district',
          photo_reference: null,
          category: 'Entertainment'
        },
        {
          name: 'Statue of Liberty',
          lat: 40.6892,
          lng: -74.0445,
          rating: 4.8,
          types: ['monument', 'tourist_attraction'],
          vicinity: 'Liberty Island',
          description: 'Symbol of freedom and democracy, gift from France to the United States',
          photo_reference: null,
          category: 'Monument'
        }
      ]
    };
    
    return landmarkDatabase[cityName] || [];
  };

  // Enhanced New York City Stories with Audio
  const getNewYorkStories = () => {
    return {
      main: "New York City stands as the ultimate testament to human ambition and the American Dream. From a small Dutch trading post called New Amsterdam to the world's most influential metropolis, NYC has been the stage for countless stories of triumph, tragedy, innovation, and reinvention. This is the city that never sleeps, where dreams are made and broken, where cultures collide and create something entirely new.",
      chapters: [
        {
          title: "New Amsterdam: The Dutch Beginning",
          content: "In 1624, Dutch colonists established New Amsterdam on the southern tip of Manhattan Island. Peter Minuit famously 'purchased' Manhattan from the Lenape Native Americans for goods worth about $24 in today's money. The Dutch built a wall for protection - today's Wall Street. The settlement was small but strategically located, with windmills, farms, and a diverse population speaking 18 different languages.",
          period: "1624-1664",
          icon: "🏛️",
          audioEnabled: true,
          audioText: "Picture Manhattan in 1624 - not the towering skyscrapers we know today, but rolling hills covered in forests, with Native American trails winding through the wilderness. Dutch settlers arrived with big dreams and bigger ambitions, establishing New Amsterdam as a trading post that would change the world forever."
        },
        {
          title: "British Rule and Revolutionary Spirit",
          content: "In 1664, the British seized New Amsterdam without a fight, renaming it New York after the Duke of York. The city grew rapidly as a major port. During the Revolutionary War, New York was occupied by the British for seven years. George Washington's farewell to his officers at Fraunces Tavern in 1783 marked the end of British rule and the beginning of American independence.",
          period: "1664-1783",
          icon: "🇺🇸",
          audioEnabled: true,
          audioText: "The British takeover was surprisingly peaceful - they simply sailed into the harbor and demanded surrender. But the revolutionary spirit was already brewing in the taverns and meeting halls of lower Manhattan, where patriots plotted independence and dreamed of a new nation."
        },
        {
          title: "Immigration and the Melting Pot",
          content: "The 19th century saw massive waves of immigration. Ellis Island opened in 1892, processing over 12 million immigrants. Irish fleeing the potato famine, Germans seeking opportunity, and later Italians and Eastern Europeans all made New York their first stop in America. Tenements crowded the Lower East Side, while wealthy industrialists built mansions on Fifth Avenue.",
          period: "1800-1900",
          icon: "🚢",
          audioEnabled: true,
          audioText: "Imagine the hope and fear in the eyes of millions as they sailed past the Statue of Liberty into New York Harbor. Ellis Island was the gateway to the American Dream - families clutching their possessions, speaking dozens of languages, all united by the hope for a better life in the New World."
        },
        {
          title: "The Skyscraper Era and Jazz Age",
          content: "The early 20th century transformed New York's skyline forever. The Flatiron Building (1902), Chrysler Building (1930), and Empire State Building (1931) reached toward the heavens. The 1920s brought jazz, speakeasies during Prohibition, and the Harlem Renaissance. Wall Street boomed until the 1929 crash, but New York's spirit remained unbroken.",
          period: "1900-1940",
          icon: "🏗️",
          audioEnabled: true,
          audioText: "The roaring twenties in New York were truly roaring - jazz music spilled from Harlem clubs, flappers danced in speakeasies, and construction crews raced to build ever-taller skyscrapers. The city was electric with possibility, even as the Great Depression loomed on the horizon."
        },
        {
          title: "World War II and Post-War Boom",
          content: "During WWII, New York was America's arsenal of democracy. The Brooklyn Navy Yard built warships, while Times Square celebrated V-J Day with the famous sailor's kiss photograph. Post-war prosperity brought suburban growth, but also urban challenges. The UN headquarters opened in 1952, making NYC the world's diplomatic capital.",
          period: "1940-1970",
          icon: "🌍",
          audioText: "The famous V-J Day kiss in Times Square captured the joy of a city and nation celebrating victory. New York had proven itself as more than just America's largest city - it was the beating heart of the free world, ready to lead the post-war era.",
          audioEnabled: true
        },
        {
          title: "Crisis and Rebirth",
          content: "The 1970s brought fiscal crisis, crime, and urban decay. The city nearly went bankrupt in 1975. But New Yorkers are resilient. The 1980s saw a cultural renaissance - hip-hop was born in the Bronx, Wall Street boomed again, and artists transformed abandoned buildings into galleries. The city that was once written off came roaring back.",
          period: "1970-1990",
          icon: "🎭",
          audioEnabled: true,
          audioText: "When President Ford told New York to 'drop dead' in 1975, New Yorkers responded with typical defiance. From the ashes of near-bankruptcy rose a cultural phoenix - hip-hop, punk rock, street art, and a new generation of dreamers who refused to give up on their city."
        },
        {
          title: "9/11 and Resilience",
          content: "September 11, 2001, tested New York's spirit like never before. The Twin Towers fell, but the city's resolve only grew stronger. First responders became heroes, neighbors helped neighbors, and the world watched New York demonstrate what it means to be unbreakable. One World Trade Center rose from the ashes as a symbol of remembrance and renewal.",
          period: "2001-2010",
          icon: "🕊️",
          audioEnabled: true,
          audioText: "In the darkest hour of September 11th, New York showed the world what courage looks like. Firefighters ran toward danger, ordinary citizens became heroes, and from the rubble emerged an even stronger city, united in grief but unbroken in spirit."
        },
        {
          title: "Modern Metropolis",
          content: "Today's New York is more diverse and dynamic than ever. Tech companies have joined Wall Street as economic drivers. Brooklyn has become a global cultural capital. The High Line transformed abandoned infrastructure into beloved public space. Through pandemics and challenges, New York continues to reinvent itself while honoring its incredible history.",
          period: "2010-Present",
          icon: "🌟",
          audioEnabled: true,
          audioText: "Modern New York is a testament to human adaptability and dreams. From Silicon Alley startups to world-class restaurants in Queens, from Broadway stages to Brooklyn art studios, the city continues to be where the future is written, one dream at a time."
        }
      ],
      legends: [
        "The ghost of Peter Stuyvesant still walks the streets of the East Village, protecting his old farm",
        "There's a secret subway tunnel that connects Grand Central to the Waldorf Astoria, used by presidents",
        "The Statue of Liberty's torch was once a lighthouse that guided ships into New York Harbor",
        "Central Park was designed with hidden tunnels and secret passages for maintenance workers",
        "The Empire State Building has its own ZIP code and was built in just 410 days",
        "There are more languages spoken in Queens than anywhere else on Earth - over 200 different tongues",
        "The original Penn Station was so beautiful that its demolition sparked the historic preservation movement",
        "Beneath the city lies a forgotten network of pneumatic postal tubes that once delivered mail at lightning speed"
      ],
      modernDay: "Today, New York City stands as the world's ultimate urban laboratory - a place where 8.3 million people from every corner of the globe create the future together. From the tech startups of Silicon Alley to the stages of Broadway, from the galleries of Chelsea to the food trucks of Queens, NYC remains the city where dreams come to life. Climate change, inequality, and urban challenges test the city daily, but New Yorkers face them with the same spirit that built the Brooklyn Bridge and survived 9/11. This is still the city that never sleeps, the place where anything is possible.",
      audioAvailable: true,
      totalDuration: "45 minutes",
      narratorVoice: "Professional narrator with New York accent",
      backgroundMusic: "Ambient city sounds with period-appropriate music"
    };
  };

  // Mock data for immediate functionality
  const mockCityData = {
    weather: {
      temperature: 22,
      description: 'partly cloudy',
      humidity: 65,
      wind_speed: 3.2,
      icon: '02d'
    },
    places: getLandmarkData(city.name),
    traffic: {
      status: 'moderate',
      description: 'Moderate traffic conditions',
      last_updated: new Date().toISOString()
    },
    accessibility: {
      accessibility_score: 0.75,
      description: 'Good accessibility with most areas wheelchair accessible'
    },
    storytelling: getNewYorkStories()
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [city]);

  // Audio control functions
  const toggleAudio = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const playAudio = () => {
    // In a real implementation, this would use Web Speech API or audio files
    setIsPlaying(true);
    
    // Simulate audio playback with text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        mockCityData.storytelling.chapters[selectedChapter].audioText || 
        mockCityData.storytelling.chapters[selectedChapter].content
      );
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = isMuted ? 0 : 1;
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const pauseAudio = () => {
    setIsPlaying(false);
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if ('speechSynthesis' in window && isPlaying) {
      speechSynthesis.cancel();
      if (!isMuted) {
        // Restart with muted audio
        playAudio();
      }
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: MapPin },
    { id: 'places', name: 'Famous Landmarks', icon: Star },
    { id: 'infrastructure', name: 'Infrastructure', icon: Building },
    { id: 'routes', name: 'Routes', icon: Route },
    { id: 'street-view', name: '360° View', icon: Eye },
    { id: 'story', name: 'Stories & Audio', icon: Volume2 }
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Historic': 'from-amber-400 to-orange-500',
      'Nature': 'from-green-400 to-emerald-500',
      'Architecture': 'from-blue-400 to-indigo-500',
      'Modern': 'from-gray-400 to-slate-500',
      'Culture': 'from-purple-400 to-violet-500',
      'Entertainment': 'from-pink-400 to-rose-500',
      'Monument': 'from-red-400 to-red-600'
    };
    return colors[category] || 'from-gray-400 to-gray-500';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      'Historic': Building,
      'Nature': MapPin,
      'Architecture': Building,
      'Modern': Building,
      'Culture': Star,
      'Entertainment': Camera,
      'Monument': Globe
    };
    const IconComponent = icons[category] || MapPin;
    return <IconComponent className="h-8 w-8 text-white" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading {city.name}</h2>
          <p className="text-gray-600">Gathering real-time data and insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={onBack}
                className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-4xl">{country.flag}</span>
                  <h1 className="text-4xl font-bold">{city.name}</h1>
                </div>
                <p className="text-blue-100 text-lg">
                  {city.admin_name}, {country.name} • {city.population.toLocaleString()} residents
                </p>
                {city.landmarks && (
                  <p className="text-blue-200 text-sm mt-1">
                    🏛️ {city.landmarks.length} famous landmarks • 🎧 Audio stories available • 📚 Rich history & culture
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                <Share className="h-6 w-6" />
              </button>
              <button className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                <Download className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.name}</span>
                  {tab.id === 'story' && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      Audio
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Thermometer className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {mockCityData.weather.temperature}°C
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">Weather</h3>
                <p className="text-sm text-gray-600 capitalize">{mockCityData.weather.description}</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Navigation className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-sm font-bold text-green-600 uppercase">
                    {mockCityData.traffic.status}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">Traffic</h3>
                <p className="text-sm text-gray-600">Current conditions</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Accessibility className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {Math.round(mockCityData.accessibility.accessibility_score * 100)}%
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">Accessibility</h3>
                <p className="text-sm text-gray-600">Wheelchair friendly</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Volume2 className="h-6 w-6 text-orange-600" />
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    Audio Stories
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">Stories Available</h3>
                <p className="text-sm text-gray-600">45 min total</p>
              </div>
            </div>

            {/* Infrastructure Quick Access */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Building className="h-6 w-6 mr-3 text-blue-600" />
                City Infrastructure
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <button 
                  onClick={() => setActiveTab('infrastructure')}
                  className="group p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Hospitals</h4>
                  <p className="text-sm text-gray-600">Medical facilities & emergency care</p>
                </button>

                <button 
                  onClick={() => setActiveTab('infrastructure')}
                  className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Universities</h4>
                  <p className="text-sm text-gray-600">Educational institutions & research</p>
                </button>

                <button 
                  onClick={() => setActiveTab('infrastructure')}
                  className="group p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Plane className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Airports</h4>
                  <p className="text-sm text-gray-600">Flight schedules & real-time data</p>
                </button>

                <button 
                  onClick={() => setActiveTab('infrastructure')}
                  className="group p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Train className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Railway Stations</h4>
                  <p className="text-sm text-gray-600">Train schedules & departures</p>
                </button>
              </div>
            </div>

            {/* Featured Landmarks Preview */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Star className="h-6 w-6 mr-3 text-yellow-500" />
                Featured Landmarks in {city.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockCityData.places.slice(0, 3).map((place, index) => (
                  <div key={index} className="group cursor-pointer" onClick={() => setActiveTab('places')}>
                    <div className={`h-32 bg-gradient-to-br ${getCategoryColor(place.category)} rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                      {getCategoryIcon(place.category)}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{place.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{place.description}</p>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{place.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <button 
                  onClick={() => setActiveTab('places')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View All {mockCityData.places.length} Landmarks
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'infrastructure' && (
          <CityInfrastructure 
            cityName={city.name} 
            coordinates={{ lat: city.lat, lng: city.lng }} 
          />
        )}

        {activeTab === 'places' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Famous Landmarks in {city.name}</h2>
              <div className="text-sm text-gray-600">
                {mockCityData.places.length} landmarks • All with 360° views available
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCityData.places.map((place, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className={`h-48 bg-gradient-to-br ${getCategoryColor(place.category)} flex items-center justify-center relative`}>
                    {getCategoryIcon(place.category)}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                      {place.category}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                        <h3 className="font-bold text-gray-900 text-lg">{place.name}</h3>
                        <p className="text-sm text-gray-600">{place.vicinity}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">{place.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="ml-1 font-medium">{place.rating}</span>
                        <span className="ml-1 text-sm text-gray-500">rating</span>
                      </div>
                      <div className="flex items-center text-sm text-blue-600">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>360° Available</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedLandmark({
                          name: place.name,
                          coordinates: { lat: place.lat, lng: place.lng },
                          location: place.vicinity,
                          country: country.name
                        });
                        setActiveTab('street-view');
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium flex items-center justify-center"
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      Explore in 360°
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'street-view' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">360° Street & Aerial Views</h2>
            {selectedLandmark ? (
              <GoogleMaps3DViewer
                landmark={selectedLandmark}
                isFullscreen={false}
              />
            ) : (
              <GoogleMaps3DViewer
                landmark={{
                  name: city.name,
                  coordinates: { lat: city.lat, lng: city.lng },
                  location: city.admin_name,
                  country: country.name
                }}
                isFullscreen={false}
              />
            )}
            
            {/* Landmark Quick Access */}
            <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Access to Landmarks</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {mockCityData.places.map((place, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedLandmark({
                      name: place.name,
                      coordinates: { lat: place.lat, lng: place.lng },
                      location: place.vicinity,
                      country: country.name
                    })}
                    className={`p-3 rounded-lg text-center transition-all ${
                      selectedLandmark?.name === place.name
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="text-xs font-medium">{place.name.split(' ')[0]}</div>
                    <div className="text-xs opacity-75">{place.name.split(' ').slice(1).join(' ')}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'story' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <BookOpen className="h-8 w-8 mr-3 text-blue-600" />
              The Complete Story of New York City
            </h2>
            
            {/* Audio Story Header */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Volume2 className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Audio-Enhanced Storytelling</h3>
                <p className="text-blue-100 mb-4">Experience NYC's history with professional narration and immersive audio</p>
                
                {/* Audio Controls */}
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <button
                    onClick={toggleAudio}
                    className={`flex items-center space-x-2 px-8 py-4 rounded-full font-medium transition-all transform hover:scale-105 ${
                      isPlaying 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-white text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    <span className="text-lg">{isPlaying ? 'Pause Story' : 'Play Story'}</span>
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-4 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  >
                    {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                  </button>
                </div>

                {/* Audio Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/10 rounded-lg p-3">
                    <Clock className="h-5 w-5 mx-auto mb-1" />
                    <p className="font-medium">Total Duration</p>
                    <p className="text-blue-200">{mockCityData.storytelling.totalDuration}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <Users className="h-5 w-5 mx-auto mb-1" />
                    <p className="font-medium">Narrator</p>
                    <p className="text-blue-200">{mockCityData.storytelling.narratorVoice}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <Zap className="h-5 w-5 mx-auto mb-1" />
                    <p className="font-medium">Audio Quality</p>
                    <p className="text-blue-200">HD with ambient sounds</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Story */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The Epic Tale of the Big Apple</h3>
              <p className="text-lg leading-relaxed text-gray-700 font-medium">
                {mockCityData.storytelling.main}
              </p>
            </div>

            {/* Story Chapters with Audio */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="h-6 w-6 mr-3 text-amber-600" />
                Historical Timeline with Audio Narration
              </h3>
              
              {/* Chapter Navigation */}
              <div className="flex flex-wrap gap-2 mb-6">
                {mockCityData.storytelling.chapters.map((chapter, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedChapter(index)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedChapter === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-blue-100 border border-gray-200'
                    }`}
                  >
                    <span className="text-lg">{chapter.icon}</span>
                    <span>{chapter.period}</span>
                    {chapter.audioEnabled && (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>

              {/* Selected Chapter with Audio */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl">{mockCityData.storytelling.chapters[selectedChapter].icon}</span>
                      <div>
                        <h4 className="text-2xl font-bold">
                          {mockCityData.storytelling.chapters[selectedChapter].title}
                        </h4>
                        <p className="text-amber-100 text-lg">
                          {mockCityData.storytelling.chapters[selectedChapter].period}
                        </p>
                      </div>
                    </div>
                    {mockCityData.storytelling.chapters[selectedChapter].audioEnabled && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={toggleAudio}
                          className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                        >
                          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </button>
                        <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                          Audio Available
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-8">
                  <p className="text-gray-700 leading-relaxed text-lg mb-6">
                    {mockCityData.storytelling.chapters[selectedChapter].content}
                  </p>
                  
                  {mockCityData.storytelling.chapters[selectedChapter].audioText && (
                    <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                      <h5 className="font-semibold text-blue-900 mb-2 flex items-center">
                        <Volume2 className="h-5 w-5 mr-2" />
                        Audio Narration Preview
                      </h5>
                      <p className="text-blue-800 italic">
                        "{mockCityData.storytelling.chapters[selectedChapter].audioText}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Legends & Myths */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Star className="h-6 w-6 mr-3 text-purple-600" />
                NYC Legends & Fascinating Facts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockCityData.storytelling.legends.map((legend, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-gray-700 leading-relaxed">{legend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modern Day */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-100 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Globe className="h-6 w-6 mr-3 text-green-600" />
                New York Today: The Never-Ending Story
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {mockCityData.storytelling.modernDay}
              </p>
            </div>

            {/* Story Actions */}
            <div className="text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <Heart className="h-5 w-5" />
                  <span>Save Complete Story</span>
                </button>
                <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  <Share className="h-5 w-5" />
                  <span>Share NYC Stories</span>
                </button>
                <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  <Download className="h-5 w-5" />
                  <span>Download Audio</span>
                </button>
              </div>
              
              <p className="text-gray-600 mt-4 text-sm">
                🎧 Audio stories use your browser's text-to-speech technology for immediate playback
              </p>
            </div>
          </div>
        )}

        {activeTab === 'routes' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Route Planning</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Route className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Advanced Route Planning</h3>
                <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                  Plan optimized routes through {city.name} with real-time traffic, multiple waypoints, and accessibility considerations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <Route className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">Smart Routes</h4>
                    <p className="text-sm text-gray-600">AI-optimized paths between attractions</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-xl">
                    <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">Real-time Updates</h4>
                    <p className="text-sm text-gray-600">Live traffic and travel duration</p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-xl">
                    <Navigation className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">Multi-modal</h4>
                    <p className="text-sm text-gray-600">Walking, driving, public transport</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}