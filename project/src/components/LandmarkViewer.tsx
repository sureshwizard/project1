import React, { useState, useEffect } from 'react';
import { 
  Building, 
  RotateCcw, 
  Maximize, 
  Info, 
  Palette, 
  Ruler, 
  Calendar,
  Eye,
  Camera,
  Download,
  Share,
  MapPin,
  Clock,
  Users,
  Star,
  Globe,
  Map,
  Minimize,
  BookOpen,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Award,
  Zap
} from 'lucide-react';
import GoogleMaps3DViewer from './GoogleMaps3DViewer';

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
  stories?: {
    main: string;
    chapters: {
      title: string;
      content: string;
      period: string;
      icon: string;
    }[];
    legends: string[];
    modernDay: string;
    audioAvailable: boolean;
  };
}

interface LandmarkViewerProps {
  landmark: LandmarkData;
  onClose?: () => void;
}

export default function LandmarkViewer({ landmark, onClose }: LandmarkViewerProps) {
  const [rotation, setRotation] = useState(0);
  const [viewMode, setViewMode] = useState<'photorealistic' | '3d' | 'details' | 'materials' | 'history' | 'stories'>('photorealistic');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(0);

  // Enhanced landmark stories database
  const getEnhancedStories = (landmarkId: string) => {
    const storiesDatabase: { [key: string]: any } = {
      'eiffel-tower': {
        main: "The Eiffel Tower stands as a testament to human ingenuity and the spirit of innovation that defined the late 19th century. What began as a temporary structure for the 1889 World's Fair has become the eternal symbol of Paris and France itself.",
        chapters: [
          {
            title: "The Iron Lady's Birth",
            content: "In 1887, Gustave Eiffel began construction of what would become the world's most recognizable landmark. Initially met with fierce criticism from Parisian artists and intellectuals who called it an 'iron monstrosity,' the tower was designed to demonstrate French engineering prowess for the 1889 Exposition Universelle.",
            period: "1887-1889",
            icon: "🏗️"
          },
          {
            title: "From Criticism to Love",
            content: "The tower's early years were marked by controversy. Many Parisians considered it an eyesore, and it was originally intended to be dismantled after 20 years. However, its value as a radio transmission tower saved it from destruction, and gradually, the public's opinion shifted from disdain to admiration.",
            period: "1889-1910",
            icon: "📻"
          },
          {
            title: "Wars and Resistance",
            content: "During World War II, the Eiffel Tower became a symbol of resistance. When Hitler visited Paris in 1940, the French cut the elevator cables, forcing the Nazis to climb the stairs. The tower's radio transmitters were also used by the French Resistance to communicate with Allied forces.",
            period: "1914-1945",
            icon: "⚔️"
          },
          {
            title: "Modern Icon",
            content: "Today, the Eiffel Tower welcomes over 7 million visitors annually. It has been featured in countless films, inspired countless proposals, and continues to be renovated and modernized while maintaining its historic charm. The tower's nightly illumination, added in 1985, creates a magical spectacle that captivates millions.",
            period: "1945-Present",
            icon: "✨"
          }
        ],
        legends: [
          "Legend says that if you make a wish while the tower sparkles at night, it will come true",
          "The tower sways up to 7 centimeters in strong winds, but has never fallen",
          "Gustave Eiffel had a secret apartment at the top where he entertained famous guests like Thomas Edison",
          "The tower is painted every 7 years and requires 60 tons of paint to protect it from rust"
        ],
        modernDay: "The Eiffel Tower continues to evolve with the times. Recent renovations include bulletproof glass walls for security, LED lighting systems for energy efficiency, and plans for sustainable tourism. It remains not just a monument, but a living symbol of Paris that adapts while honoring its heritage.",
        audioAvailable: true
      },
      'empire-state': {
        main: "The Empire State Building rose from the ashes of the Great Depression to become America's most beloved skyscraper. Built in just 410 days, it stands as a monument to American determination, ingenuity, and the indomitable spirit of New York City.",
        chapters: [
          {
            title: "Race to the Sky",
            content: "The 1920s saw a fierce competition to build the world's tallest building. The Empire State Building was conceived as part of this 'race to the sky,' designed to surpass the Chrysler Building and claim the title of world's tallest structure. Construction began in 1930, just as the Great Depression was taking hold.",
            period: "1929-1930",
            icon: "🏗️"
          },
          {
            title: "Depression Era Marvel",
            content: "Despite the economic downturn, construction proceeded at breakneck speed. Workers, many of them immigrants and Native Americans, built the tower in just 410 days. The building provided crucial employment during the Depression and became a symbol of hope and resilience for Americans.",
            period: "1930-1931",
            icon: "💪"
          },
          {
            title: "King Kong and Fame",
            content: "The 1933 film 'King Kong' immortalized the Empire State Building in popular culture. The iconic scene of the giant ape atop the building made it instantly recognizable worldwide and cemented its place in American mythology. The building has since appeared in over 250 films.",
            period: "1933-1940",
            icon: "🎬"
          },
          {
            title: "Modern Renaissance",
            content: "After decades of decline, the Empire State Building underwent a massive renovation in the 2000s. Today, it's a model of energy efficiency and sustainability, featuring LED lighting that can display any color combination. It remains one of New York's most popular tourist destinations and a working office building.",
            period: "2000-Present",
            icon: "🌟"
          }
        ],
        legends: [
          "The building has its own ZIP code: 10118",
          "Lightning strikes the building about 25 times per year, but it's designed to handle it safely",
          "On a clear day, you can see five states from the observation deck",
          "The building's lights have commemorated everything from holidays to sports victories to social causes"
        ],
        modernDay: "The Empire State Building continues to be a beacon of New York City. Its LED light shows celebrate holidays, achievements, and causes, making it a dynamic part of the city's skyline. Recent sustainability efforts have reduced its energy consumption by 40%, proving that historic buildings can be both preserved and modernized.",
        audioAvailable: true
      },
      'taj-mahal': {
        main: "The Taj Mahal is more than a monument; it's a love story carved in marble, a poem written in stone, and a testament to the power of devotion that transcends time. Built by Emperor Shah Jahan as a mausoleum for his beloved wife Mumtaz Mahal, it represents the pinnacle of Mughal architecture.",
        chapters: [
          {
            title: "A Love Beyond Death",
            content: "When Mumtaz Mahal died in 1631 during childbirth, Emperor Shah Jahan was devastated. He vowed to build the most beautiful mausoleum the world had ever seen in her memory. The Taj Mahal was his expression of eternal love, designed to be a replica of paradise on earth.",
            period: "1631-1632",
            icon: "💕"
          },
          {
            title: "Master Craftsmen Unite",
            content: "Shah Jahan assembled the finest architects, craftsmen, and artists from across the empire and beyond. Over 20,000 workers, including master craftsmen from Persia, Turkey, and Europe, worked for 22 years to complete this masterpiece. The main architect, Ustad Ahmad Lahauri, created a design that perfectly balanced Islamic, Persian, and Indian architectural elements.",
            period: "1632-1643",
            icon: "🎨"
          },
          {
            title: "Architectural Perfection",
            content: "Every element of the Taj Mahal was designed with mathematical precision and symbolic meaning. The four minarets lean slightly outward to protect the main dome in case of earthquake. The central dome appears to change color throughout the day, from pink at dawn to golden at sunset to white under moonlight, symbolizing the different moods of a woman.",
            period: "1643-1653",
            icon: "🕌"
          },
          {
            title: "Preservation and Wonder",
            content: "The Taj Mahal has survived wars, pollution, and the passage of time. Today, it's protected as a UNESCO World Heritage Site and attracts millions of visitors annually. Conservation efforts continue to preserve its pristine white marble and intricate inlay work for future generations.",
            period: "1653-Present",
            icon: "🛡️"
          }
        ],
        legends: [
          "Shah Jahan planned to build a black marble mausoleum for himself across the river, connected by a bridge",
          "The Taj Mahal appears to change color throughout the day, reflecting the changing moods of its creator",
          "It's said that Shah Jahan cut off the hands of the craftsmen so they could never create anything as beautiful again (this is a myth)",
          "The building is perfectly symmetrical except for Shah Jahan's tomb, which was added later and disrupts the symmetry"
        ],
        modernDay: "The Taj Mahal faces modern challenges including air pollution and millions of visitors annually. Conservation efforts include limiting visitor numbers, cleaning the marble with special clay, and creating a protective buffer zone. It remains a symbol of eternal love and India's rich cultural heritage.",
        audioAvailable: true
      },
      'sydney-opera': {
        main: "The Sydney Opera House is a masterpiece of 20th-century architecture that almost never came to be. From a young Danish architect's revolutionary design to becoming Australia's most recognizable landmark, its story is one of vision, controversy, and ultimate triumph.",
        chapters: [
          {
            title: "A Bold Vision",
            content: "In 1957, a young Danish architect named Jørn Utzon submitted a revolutionary design for Sydney's new opera house. His concept of shell-like structures rising from the harbor was unlike anything ever built. Despite being considered unbuildable by many, his design won the international competition.",
            period: "1957-1959",
            icon: "🎭"
          },
          {
            title: "Engineering Nightmare",
            content: "Utzon's visionary design presented unprecedented engineering challenges. The complex geometry of the shells required new construction techniques and computer modeling that was cutting-edge for the 1960s. Cost overruns and technical difficulties led to political controversy and Utzon's resignation in 1966.",
            period: "1959-1966",
            icon: "⚙️"
          },
          {
            title: "Completion and Recognition",
            content: "Despite the controversies, construction continued under new architects. The Opera House finally opened in 1973, 16 years after construction began and 10 times over budget. Queen Elizabeth II officially opened the building, and it quickly became a symbol of modern Australia.",
            period: "1966-1973",
            icon: "👑"
          },
          {
            title: "Cultural Icon",
            content: "Today, the Sydney Opera House hosts over 1,500 performances annually and attracts 8.2 million visitors. It's been designated a UNESCO World Heritage Site and continues to push boundaries in both architecture and performance. The building has become synonymous with Sydney and Australia itself.",
            period: "1973-Present",
            icon: "🌟"
          }
        ],
        legends: [
          "The design was inspired by orange segments, though Utzon later said it came from sailing boats",
          "The building has over 1 million ceramic tiles, each placed by hand",
          "It took 14 years to build and cost 15 times the original estimate",
          "The Concert Hall's acoustic design is so precise that a pin dropped on stage can be heard in the back row"
        ],
        modernDay: "The Sydney Opera House continues to evolve as a living cultural institution. Recent renovations have improved accessibility and acoustics while preserving Utzon's original vision. It remains a symbol of artistic achievement and architectural innovation, inspiring new generations of architects and performers.",
        audioAvailable: true
      },
      'burj-khalifa': {
        main: "The Burj Khalifa represents humanity's eternal desire to reach for the sky. Standing at 828 meters tall, it's not just the world's tallest building—it's a symbol of Dubai's transformation from desert outpost to global metropolis and a testament to 21st-century engineering prowess.",
        chapters: [
          {
            title: "Vision of the Future",
            content: "In the early 2000s, Dubai's leaders envisioned a tower that would put their city on the world map. The Burj Khalifa was conceived as the centerpiece of Downtown Dubai, a new urban district that would showcase the emirate's ambitions. The project aimed to break multiple world records and establish Dubai as a global destination.",
            period: "2004-2006",
            icon: "🌆"
          },
          {
            title: "Engineering Marvel",
            content: "Designed by Adrian Smith of Skidmore, Owings & Merrill, the tower's Y-shaped floor plan and setback design help it withstand high winds. The building required innovative construction techniques, including the world's longest concrete pour and a sophisticated elevator system with speeds up to 64 km/h.",
            period: "2006-2009",
            icon: "🏗️"
          },
          {
            title: "Record Breaking",
            content: "When completed in 2010, the Burj Khalifa shattered numerous records: tallest building, most floors, highest occupied floor, longest elevator travel distance, and tallest free-standing structure. The opening ceremony was a spectacular display that announced Dubai's arrival on the world stage.",
            period: "2009-2010",
            icon: "🏆"
          },
          {
            title: "Global Icon",
            content: "The Burj Khalifa has become more than a building—it's a global icon featured in movies, video games, and countless photographs. Its LED light shows celebrate holidays and events worldwide, and it continues to attract millions of visitors who come to experience the world from its observation decks.",
            period: "2010-Present",
            icon: "🌍"
          }
        ],
        legends: [
          "The building can be seen from 95 kilometers away on a clear day",
          "It uses enough concrete to build a sidewalk 1,000 kilometers long",
          "The tower has 57 elevators and 8 escalators, with the fastest reaching 64 km/h",
          "During construction, the building grew by one floor every three days"
        ],
        modernDay: "The Burj Khalifa continues to set standards for sustainable skyscraper design. Its advanced systems collect condensation for irrigation, and its mixed-use design creates a vertical city. As Dubai prepares for Expo 2020 and beyond, the tower remains a symbol of the city's limitless ambitions.",
        audioAvailable: true
      }
    };

    return storiesDatabase[landmarkId] || {
      main: `Discover the fascinating history and cultural significance of ${landmark.name}.`,
      chapters: [],
      legends: [],
      modernDay: `${landmark.name} continues to inspire visitors from around the world.`,
      audioAvailable: false
    };
  };

  const enhancedLandmark = {
    ...landmark,
    stories: getEnhancedStories(landmark.id)
  };

  const rotate360 = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const startAutoRotation = () => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    
    setTimeout(() => clearInterval(interval), 10000);
  };

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    // Here you would integrate with a text-to-speech service
    if (!isPlaying) {
      // Start audio narration
      console.log('Starting audio narration...');
    } else {
      // Stop audio narration
      console.log('Stopping audio narration...');
    }
  };

  // Render 3D CSS structure based on landmark type
  const render3DStructure = () => {
    switch (landmark.id) {
      case 'eiffel-tower':
        return (
          <div className="relative transform-gpu" style={{ transform: `rotateY(${rotation}deg)` }}>
            {/* Eiffel Tower Base */}
            <div className="relative">
              {/* Tower Legs */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                <div className="w-32 h-80 relative">
                  {/* Four legs */}
                  <div className="absolute bottom-0 left-0 w-2 h-40 bg-gradient-to-t from-amber-800 to-amber-600 transform rotate-12 origin-bottom"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-40 bg-gradient-to-t from-amber-800 to-amber-600 transform -rotate-12 origin-bottom"></div>
                  <div className="absolute bottom-0 left-1/2 w-2 h-40 bg-gradient-to-t from-amber-800 to-amber-600 transform -translate-x-1/2 rotate-6"></div>
                  <div className="absolute bottom-0 left-1/2 w-2 h-40 bg-gradient-to-t from-amber-800 to-amber-600 transform -translate-x-1/2 -rotate-6"></div>
                  
                  {/* Middle section */}
                  <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 w-16 h-32 bg-gradient-to-t from-amber-700 to-amber-500 clip-path-tower"></div>
                  
                  {/* Top section */}
                  <div className="absolute bottom-72 left-1/2 transform -translate-x-1/2 w-8 h-24 bg-gradient-to-t from-amber-600 to-amber-400"></div>
                  
                  {/* Antenna */}
                  <div className="absolute bottom-96 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-amber-300"></div>
                </div>
              </div>
              
              {/* Shadow */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-x-8 translate-y-2 w-32 h-80 bg-gray-600 opacity-20 skew-x-12 -z-10"></div>
            </div>
          </div>
        );

      case 'empire-state':
        return (
          <div className="relative transform-gpu" style={{ transform: `rotateY(${rotation}deg)` }}>
            <div className="relative">
              {/* Base */}
              <div className="w-24 h-64 bg-gradient-to-t from-gray-600 via-gray-500 to-gray-400 mx-auto relative">
                {/* Windows pattern */}
                <div className="absolute inset-2 grid grid-cols-6 gap-px">
                  {Array.from({ length: 120 }).map((_, i) => (
                    <div
                      key={i}
                      className={`bg-yellow-200 opacity-${Math.random() > 0.4 ? '80' : '20'} rounded-sm`}
                    />
                  ))}
                </div>
                
                {/* Art Deco top */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-t from-gray-400 to-gray-300 clip-path-pyramid"></div>
                
                {/* Spire */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-2 h-12 bg-gray-300"></div>
              </div>
              
              {/* Shadow */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-x-6 translate-y-2 w-24 h-64 bg-gray-600 opacity-20 skew-x-12 -z-10"></div>
            </div>
          </div>
        );

      case 'taj-mahal':
        return (
          <div className="relative transform-gpu" style={{ transform: `rotateY(${rotation}deg)` }}>
            <div className="relative">
              {/* Main dome */}
              <div className="w-32 h-32 bg-gradient-to-t from-gray-100 to-white rounded-full mx-auto relative">
                {/* Central spire */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-2 h-12 bg-yellow-400"></div>
              </div>
              
              {/* Main building */}
              <div className="w-40 h-24 bg-gradient-to-t from-gray-200 to-white mx-auto relative -mt-8">
                {/* Arched entrance */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-16 bg-gray-800 rounded-t-full"></div>
                
                {/* Side arches */}
                <div className="absolute top-4 left-4 w-4 h-8 bg-gray-700 rounded-t-full"></div>
                <div className="absolute top-4 right-4 w-4 h-8 bg-gray-700 rounded-t-full"></div>
              </div>
              
              {/* Minarets */}
              <div className="absolute top-8 left-0 w-4 h-32 bg-gradient-to-t from-gray-200 to-white rounded-t-full"></div>
              <div className="absolute top-8 right-0 w-4 h-32 bg-gradient-to-t from-gray-200 to-white rounded-t-full"></div>
              
              {/* Base platform */}
              <div className="w-48 h-4 bg-gradient-to-r from-red-800 to-red-700 mx-auto mt-2"></div>
            </div>
          </div>
        );

      case 'sydney-opera':
        return (
          <div className="relative transform-gpu" style={{ transform: `rotateY(${rotation}deg)` }}>
            <div className="relative">
              {/* Opera House shells */}
              <div className="flex space-x-2 items-end">
                <div className="w-16 h-24 bg-gradient-to-t from-gray-100 to-white rounded-t-full transform rotate-12 shadow-lg"></div>
                <div className="w-20 h-32 bg-gradient-to-t from-gray-100 to-white rounded-t-full shadow-lg"></div>
                <div className="w-18 h-28 bg-gradient-to-t from-gray-100 to-white rounded-t-full transform -rotate-12 shadow-lg"></div>
              </div>
              
              {/* Base platform */}
              <div className="w-32 h-8 bg-gradient-to-r from-gray-300 to-gray-200 rounded-lg mt-2 mx-auto"></div>
              
              {/* Water reflection */}
              <div className="w-32 h-16 bg-gradient-to-b from-blue-200 to-blue-400 opacity-30 rounded-lg mt-1 mx-auto transform scale-y-50"></div>
            </div>
          </div>
        );

      case 'burj-khalifa':
        return (
          <div className="relative transform-gpu" style={{ transform: `rotateY(${rotation}deg)` }}>
            <div className="relative">
              {/* Main tower */}
              <div className="w-12 h-96 bg-gradient-to-t from-blue-800 via-blue-600 to-blue-400 mx-auto relative">
                {/* Setbacks */}
                <div className="absolute bottom-0 w-16 h-32 bg-gradient-to-t from-blue-800 to-blue-700 left-1/2 transform -translate-x-1/2"></div>
                <div className="absolute bottom-32 w-14 h-32 bg-gradient-to-t from-blue-700 to-blue-600 left-1/2 transform -translate-x-1/2"></div>
                
                {/* Windows pattern */}
                <div className="absolute inset-1 grid grid-cols-3 gap-px">
                  {Array.from({ length: 150 }).map((_, i) => (
                    <div
                      key={i}
                      className={`bg-yellow-100 opacity-${Math.random() > 0.3 ? '70' : '20'}`}
                    />
                  ))}
                </div>
                
                {/* Spire */}
                <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-1 h-24 bg-blue-300"></div>
              </div>
              
              {/* Shadow */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-x-8 translate-y-2 w-16 h-96 bg-gray-600 opacity-15 skew-x-12 -z-10"></div>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-32 h-32 bg-gradient-to-t from-gray-600 to-gray-400 rounded-lg mx-auto flex items-center justify-center">
            <Building className="h-16 w-16 text-white" />
          </div>
        );
    }
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'}`}>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{landmark.name}</h2>
              <p className="text-blue-100 text-sm flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {landmark.location}, {landmark.country}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={rotate360}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title="Rotate 90°"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <button
                onClick={startAutoRotation}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title="Auto Rotate"
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  title="Close"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex space-x-1">
            {[
              { id: 'photorealistic', label: 'Photorealistic 3D', icon: Map },
              { id: '3d', label: 'Stylized 3D', icon: Building },
              { id: 'stories', label: 'Stories & Legends', icon: BookOpen },
              { id: 'details', label: 'Details', icon: Info },
              { id: 'materials', label: 'Architecture', icon: Palette },
              { id: 'history', label: 'History', icon: Calendar }
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
          {viewMode === 'photorealistic' && (
            <GoogleMaps3DViewer
              landmark={landmark}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          )}

          {viewMode === '3d' && (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 relative">
              {/* 3D Landmark */}
              <div className="relative transform transition-transform duration-1000 ease-in-out">
                {render3DStructure()}
                
                {/* Landmark Info Overlay */}
                <div className="absolute -right-16 top-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg min-w-64 max-w-xs">
                  <h3 className="font-bold text-gray-900 mb-3">Landmark Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Height:</span>
                      <span className="font-medium">{landmark.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Built:</span>
                      <span className="font-medium">{landmark.yearBuilt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Style:</span>
                      <span className="font-medium">{landmark.style}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Visitors/Year:</span>
                      <span className="font-medium">{landmark.visitorsPerYear}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Significance:</span>
                      <p className="font-medium text-xs mt-1">{landmark.significance}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D Controls */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    <span>Rotation: {rotation}°</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>Stylized 3D View</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button className="p-3 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg">
                  <Camera className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-3 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg">
                  <Download className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-3 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg">
                  <Share className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}

          {viewMode === 'stories' && enhancedLandmark.stories && (
            <div className="h-full overflow-y-auto bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="max-w-4xl mx-auto p-8">
                {/* Main Story Header */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">The Story of {landmark.name}</h2>
                  
                  {/* Audio Controls */}
                  {enhancedLandmark.stories.audioAvailable && (
                    <div className="flex items-center justify-center space-x-4 mb-6">
                      <button
                        onClick={toggleAudio}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                          isPlaying 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        <span>{isPlaying ? 'Pause Story' : 'Listen to Story'}</span>
                      </button>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                      >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Main Story */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                  <p className="text-lg leading-relaxed text-gray-700 font-medium">
                    {enhancedLandmark.stories.main}
                  </p>
                </div>

                {/* Story Chapters */}
                {enhancedLandmark.stories.chapters.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <Clock className="h-6 w-6 mr-3 text-amber-600" />
                      Historical Timeline
                    </h3>
                    
                    {/* Chapter Navigation */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {enhancedLandmark.stories.chapters.map((chapter, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedChapter(index)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedChapter === index
                              ? 'bg-amber-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-amber-100'
                          }`}
                        >
                          <span className="mr-2">{chapter.icon}</span>
                          {chapter.period}
                        </button>
                      ))}
                    </div>

                    {/* Selected Chapter */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-4">{enhancedLandmark.stories.chapters[selectedChapter].icon}</span>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">
                            {enhancedLandmark.stories.chapters[selectedChapter].title}
                          </h4>
                          <p className="text-amber-600 font-medium">
                            {enhancedLandmark.stories.chapters[selectedChapter].period}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {enhancedLandmark.stories.chapters[selectedChapter].content}
                      </p>
                    </div>
                  </div>
                )}

                {/* Legends & Myths */}
                {enhancedLandmark.stories.legends.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <Star className="h-6 w-6 mr-3 text-purple-600" />
                      Legends & Fascinating Facts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {enhancedLandmark.stories.legends.map((legend, index) => (
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
                )}

                {/* Modern Day */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Globe className="h-6 w-6 mr-3 text-green-600" />
                    Modern Day Legacy
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {enhancedLandmark.stories.modernDay}
                  </p>
                </div>

                {/* Share Story */}
                <div className="text-center mt-8">
                  <div className="flex items-center justify-center space-x-4">
                    <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      <Heart className="h-5 w-5" />
                      <span>Save Story</span>
                    </button>
                    <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Share className="h-5 w-5" />
                      <span>Share Story</span>
                    </button>
                    <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="h-5 w-5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'details' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-blue-600" />
                    Landmark Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <p className="font-medium">{landmark.type}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Height:</span>
                      <p className="font-medium">{landmark.height}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Year Built:</span>
                      <p className="font-medium">{landmark.yearBuilt}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Visitors/Year:</span>
                      <p className="font-medium">{landmark.visitorsPerYear}</p>
                    </div>
                    {landmark.architect && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Architect:</span>
                        <p className="font-medium">{landmark.architect}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Area Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Ruler className="h-5 w-5 mr-2 text-green-600" />
                    Dimensions
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Area:</span>
                      <p className="font-medium">{landmark.area.total}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Footprint:</span>
                      <p className="font-medium">{landmark.area.footprint}</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Notable Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {landmark.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fun Facts */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-600" />
                    Fun Facts
                  </h3>
                  <div className="space-y-2">
                    {landmark.funFacts.map((fact, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-sm text-gray-700">{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'materials' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Architectural Style */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-purple-600" />
                    Architectural Style
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 text-sm">Primary Style:</span>
                      <p className="font-medium">{landmark.style}</p>
                    </div>
                    {landmark.architect && (
                      <div>
                        <span className="text-gray-600 text-sm">Architect:</span>
                        <p className="font-medium">{landmark.architect}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Construction Materials */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Construction Materials</h3>
                  <div className="space-y-2">
                    {landmark.materials.map((material, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                        <span className="font-medium text-gray-900">{material}</span>
                        <span className="text-sm text-gray-600">Primary</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cultural Significance */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-blue-600" />
                    Cultural Significance
                  </h3>
                  <p className="text-sm text-gray-700">{landmark.significance}</p>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'history' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Timeline */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-green-600" />
                    Historical Timeline
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-1 mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900">Construction Completed</p>
                        <p className="text-sm text-gray-600">{landmark.yearBuilt}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900">UNESCO World Heritage</p>
                        <p className="text-sm text-gray-600">Recognized for cultural significance</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mt-1 mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900">Modern Day</p>
                        <p className="text-sm text-gray-600">Attracts {landmark.visitorsPerYear} annually</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visitor Statistics */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-green-600" />
                    Visitor Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Annual Visitors:</span>
                      <p className="font-medium">{landmark.visitorsPerYear}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Peak Season:</span>
                      <p className="font-medium">Summer months</p>
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Location Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">City:</span>
                      <p className="font-medium">{landmark.location}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Country:</span>
                      <p className="font-medium">{landmark.country}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Coordinates:</span>
                      <p className="font-medium">{landmark.coordinates.lat}°, {landmark.coordinates.lng}°</p>
                    </div>
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