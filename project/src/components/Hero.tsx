import React, { useState } from 'react';
import { ArrowRight, MapPin, Route, Compass, Play, X } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  const [showDemoModal, setShowDemoModal] = useState(false);

  const handleWatchDemo = () => {
    setShowDemoModal(true);
  };

  const closeDemoModal = () => {
    setShowDemoModal(false);
  };

  return (
    <>
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Plan Your Journey,
              <span className="block bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                Navigate Your Way
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create personalized routes, discover new destinations, and track your adventures 
              with the most intuitive mapping platform designed for modern travelers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={onGetStarted}
                className="group bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={handleWatchDemo}
                className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center justify-center"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>

            {/* Feature Icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/20">
                  <MapPin className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Smart Waypoints</h3>
                <p className="text-blue-100 text-sm">Add custom stops and optimize your route automatically</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/20">
                  <Route className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Route Planning</h3>
                <p className="text-blue-100 text-sm">Create detailed itineraries with real-time traffic updates</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/20">
                  <Compass className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Explore</h3>
                <p className="text-blue-100 text-sm">Discover hidden gems and popular destinations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Video Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">MyWayMap Demo</h2>
                <button
                  onClick={closeDemoModal}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Video Content */}
            <div className="p-8">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-12 w-12 text-white ml-1" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Demo Video Coming Soon!</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Experience MyWayMap's powerful features including 3D building visualization, 
                    world landmarks exploration, and intelligent route planning.
                  </p>
                  
                  {/* Demo Features Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900 mb-1">Global Search</h4>
                      <p className="text-sm text-gray-600">Find any address worldwide</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <Route className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900 mb-1">3D Visualization</h4>
                      <p className="text-sm text-gray-600">Explore buildings in 3D</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <Compass className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900 mb-1">Smart Routes</h4>
                      <p className="text-sm text-gray-600">Intelligent path planning</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    closeDemoModal();
                    onGetStarted();
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Try MyWayMap Now
                </button>
                <button
                  onClick={closeDemoModal}
                  className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}