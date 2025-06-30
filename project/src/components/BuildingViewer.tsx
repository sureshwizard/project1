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
  Share
} from 'lucide-react';

interface BuildingData {
  id: string;
  name: string;
  address: string;
  type: string;
  height: string;
  floors: number;
  yearBuilt: string;
  architect?: string;
  color: string;
  materials: string[];
  area: {
    total: string;
    perFloor: string;
  };
  features: string[];
  coordinates: { lat: number; lng: number };
}

interface BuildingViewerProps {
  building: BuildingData;
  onClose?: () => void;
}

export default function BuildingViewer({ building, onClose }: BuildingViewerProps) {
  const [rotation, setRotation] = useState(0);
  const [viewMode, setViewMode] = useState<'3d' | 'details' | 'materials'>('3d');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const rotate360 = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Generate building color based on type
  const getBuildingColors = (type: string, color: string) => {
    const baseColors = {
      'Office Complex': 'from-blue-600 via-blue-500 to-blue-400',
      'Apartment Complex': 'from-green-600 via-green-500 to-green-400',
      'Mixed Use Development': 'from-purple-600 via-purple-500 to-purple-400',
      'Historic Office': 'from-amber-600 via-amber-500 to-amber-400',
      'Corporate Headquarters': 'from-emerald-600 via-emerald-500 to-emerald-400',
    };
    
    return baseColors[type as keyof typeof baseColors] || 'from-gray-600 via-gray-500 to-gray-400';
  };

  // Generate window pattern based on building type
  const generateWindows = (floors: number, type: string) => {
    const windowsPerFloor = type.includes('Residential') ? 6 : 8;
    const totalWindows = floors * windowsPerFloor;
    
    return Array.from({ length: totalWindows }).map((_, i) => {
      const isLit = Math.random() > 0.4; // 60% chance of being lit
      const floor = Math.floor(i / windowsPerFloor);
      const isTopFloor = floor >= floors - 3; // Top 3 floors might have different lighting
      
      return {
        id: i,
        isLit: isTopFloor ? Math.random() > 0.2 : isLit,
        opacity: isLit ? (Math.random() * 0.4 + 0.6) : 0.2
      };
    });
  };

  const windows = generateWindows(building.floors, building.type);
  const buildingGradient = getBuildingColors(building.type, building.color);

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'}`}>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{building.name}</h2>
              <p className="text-blue-100 text-sm">{building.address}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={rotate360}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title="Rotate 360°"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title="Toggle Fullscreen"
              >
                <Maximize className="h-5 w-5" />
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
              { id: '3d', label: '3D View', icon: Building },
              { id: 'details', label: 'Details', icon: Info },
              { id: 'materials', label: 'Materials', icon: Palette }
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
          {viewMode === '3d' && (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative">
              {/* 3D Building */}
              <div 
                className="relative transform transition-transform duration-1000 ease-in-out"
                style={{ 
                  transform: `rotateY(${rotation}deg) perspective(1000px)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Main Building Structure */}
                <div className="relative">
                  {/* Building Body */}
                  <div 
                    className={`w-48 bg-gradient-to-t ${buildingGradient} rounded-lg shadow-2xl relative overflow-hidden`}
                    style={{ height: `${Math.min(building.floors * 6, 320)}px` }}
                  >
                    {/* Windows Grid */}
                    <div 
                      className="absolute inset-0 p-3"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(8, 1fr)',
                        gap: '2px'
                      }}
                    >
                      {windows.map((window) => (
                        <div
                          key={window.id}
                          className={`rounded-sm transition-opacity duration-1000 ${
                            window.isLit ? 'bg-yellow-200' : 'bg-blue-900/30'
                          }`}
                          style={{ opacity: window.opacity }}
                        />
                      ))}
                    </div>

                    {/* Building Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30 transform skew-x-12"></div>
                  </div>

                  {/* Building Shadow */}
                  <div 
                    className="absolute bg-gray-600/30 rounded-lg transform -z-10"
                    style={{
                      width: '192px',
                      height: `${Math.min(building.floors * 6, 320)}px`,
                      top: '8px',
                      left: '8px',
                      transform: 'skewX(15deg) skewY(2deg)'
                    }}
                  ></div>
                </div>

                {/* Building Info Overlay */}
                <div className="absolute -right-16 top-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg min-w-64 max-w-xs">
                  <h3 className="font-bold text-gray-900 mb-3">Live Building Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Height:</span>
                      <span className="font-medium">{building.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Floors:</span>
                      <span className="font-medium">{building.floors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{building.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Built:</span>
                      <span className="font-medium">{building.yearBuilt}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Primary Color:</span>
                      <p className="font-medium text-xs mt-1">{building.color}</p>
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
                    <span>3D View</span>
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

          {viewMode === 'details' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-blue-600" />
                    Building Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Building Type:</span>
                      <p className="font-medium">{building.type}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Height:</span>
                      <p className="font-medium">{building.height}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Number of Floors:</span>
                      <p className="font-medium">{building.floors}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Year Built:</span>
                      <p className="font-medium">{building.yearBuilt}</p>
                    </div>
                    {building.architect && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Architect:</span>
                        <p className="font-medium">{building.architect}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Area Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Ruler className="h-5 w-5 mr-2 text-green-600" />
                    Area Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Area:</span>
                      <p className="font-medium">{building.area.total}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Per Floor:</span>
                      <p className="font-medium">{building.area.perFloor}</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Building Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {building.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'materials' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Color Analysis */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-purple-600" />
                    Color Analysis
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 text-sm">Primary Color Scheme:</span>
                      <p className="font-medium">{building.color}</p>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded border-2 border-white shadow-sm"></div>
                      <div className="w-8 h-8 bg-gray-400 rounded border-2 border-white shadow-sm"></div>
                      <div className="w-8 h-8 bg-yellow-200 rounded border-2 border-white shadow-sm"></div>
                      <div className="w-8 h-8 bg-gray-800 rounded border-2 border-white shadow-sm"></div>
                    </div>
                  </div>
                </div>

                {/* Materials */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Construction Materials</h3>
                  <div className="space-y-2">
                    {building.materials.map((material, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                        <span className="font-medium text-gray-900">{material}</span>
                        <span className="text-sm text-gray-600">Primary</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Environmental Impact */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Environmental Features</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Energy Efficient Windows</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Sustainable Materials</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>LEED Certified</span>
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