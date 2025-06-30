import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import MapView from './components/MapView';
import PlanRoute from './components/PlanRoute';
import Trips from './components/Trips';
import Explore from './components/Explore';
import WorldLandmarks from './components/WorldLandmarks';
import CountryCitySelector from './components/CountryCitySelector';
import CityExplorer from './components/CityExplorer';

interface City {
  name: string;
  lat: number;
  lng: number;
  population: number;
  admin_name: string;
}

interface Country {
  code: string;
  name: string;
  flag: string;
}

function App() {
  const [currentView, setCurrentView] = useState('hero');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const handleGetStarted = () => {
    setCurrentView('country-selector');
  };

  const handlePlanRoute = () => {
    setCurrentView('plan');
  };

  const handleCitySelect = (city: City, country: Country) => {
    setSelectedCity(city);
    setSelectedCountry(country);
    setCurrentView('city-explorer');
  };

  const handleBackToSelector = () => {
    setSelectedCity(null);
    setSelectedCountry(null);
    setCurrentView('country-selector');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'hero':
        return <Hero onGetStarted={handleGetStarted} />;
      case 'country-selector':
        return <CountryCitySelector onCitySelect={handleCitySelect} />;
      case 'city-explorer':
        return selectedCity && selectedCountry ? (
          <CityExplorer 
            city={selectedCity} 
            country={selectedCountry} 
            onBack={handleBackToSelector}
          />
        ) : (
          <CountryCitySelector onCitySelect={handleCitySelect} />
        );
      case 'dashboard':
        return <Dashboard onPlanRoute={handlePlanRoute} />;
      case 'map':
        return <MapView />;
      case 'plan':
        return <PlanRoute />;
      case 'trips':
        return <Trips />;
      case 'explore':
        return <Explore />;
      case 'landmarks':
        return <WorldLandmarks />;
      default:
        return <Hero onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView !== 'hero' && currentView !== 'city-explorer' && (
        <Header currentView={currentView} onViewChange={setCurrentView} />
      )}
      {renderCurrentView()}
    </div>
  );
}

export default App;