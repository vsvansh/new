
import React, { useState, useEffect } from 'react';
import MacosWindow from './MacosWindow';
import MacosDock from './MacosDock';
import Dashboard from './Dashboard';
import Expenses from './Expenses';
import TripPlanning from './TripPlanning';
import { TripProvider } from '@/context/TripContext';
import { CategoriesView } from './CategoriesView';
import { ReportsView } from './ReportsView';
import { AnalyticsView } from './AnalyticsView';
import { SettingsView } from './SettingsView';
import { CollaborateView } from './CollaborateView';
import LandingPage from './LandingPage';
import MovingBackground from './MovingBackground';

export const VacationBudgetTracker = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [hasJoined, setHasJoined] = useState(false);
  const [isDockVisible, setIsDockVisible] = useState(true);
  
  // Check if user has joined before (using localStorage for persistence)
  useEffect(() => {
    // Set dark mode as default
    if (!localStorage.theme) {
      localStorage.theme = 'dark';
      document.documentElement.classList.add('dark');
    }
    
    const joinStatus = localStorage.getItem('tripnest-joined');
    if (joinStatus === 'true') {
      setHasJoined(true);
    }
    
    // Ensure dock visibility is correctly set based on localStorage
    const dockVisibility = localStorage.getItem('dock-visible');
    setIsDockVisible(dockVisibility !== 'false');
    
    // Set up a MutationObserver to watch for class changes
    const dockContainer = document.querySelector('.dock-container');
    if (dockContainer) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            // Update state based on whether the dock has the 'hidden' class
            setIsDockVisible(!dockContainer.classList.contains('hidden'));
          }
        });
      });
      
      observer.observe(dockContainer, { attributes: true });
      
      return () => observer.disconnect();
    }
  }, []);
  
  const handleJoin = () => {
    setHasJoined(true);
    localStorage.setItem('tripnest-joined', 'true');
  };
  
  const handleClose = () => {
    // Force reload the landing page state properly
    setHasJoined(false);
    localStorage.removeItem('tripnest-joined');
    setActiveView('dashboard');
  };
  
  const handleViewChange = (view: string) => {
    if (hasJoined || view === 'contact') {
      setActiveView(view);
    }
  };
  
  const renderActiveView = () => {
    if (!hasJoined) {
      return <LandingPage onJoin={handleJoin} />;
    }
    
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'expenses':
        return <Expenses />;
      case 'categories':
        return <CategoriesView />;
      case 'planning':
        return <TripPlanning />;
      case 'reports':
        return <ReportsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      case 'collaborate':
        return <CollaborateView />;
      default:
        return <Dashboard />;
    }
  };

  const getWindowTitle = () => {
    if (!hasJoined) return "TripNest - Your Vacation Budget Companion";
    return `Travel Budget - ${activeView.charAt(0).toUpperCase() + activeView.slice(1)}`;
  };

  return (
    <TripProvider>
      <div className="min-h-screen flex items-center justify-center p-4 bg-macos-bg dark:bg-zinc-950 relative overflow-hidden">
        {/* Moving gradient background */}
        <MovingBackground />
        
        {/* Dock container positioned with animation classes */}
        <div className={`dock-container fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[60] transition-all duration-300 ${!isDockVisible ? 'hidden' : ''}`}>
          <MacosDock 
            activeView={activeView} 
            setActiveView={handleViewChange}
            hasJoined={hasJoined}
          />
        </div>
        
        <MacosWindow 
          title={getWindowTitle()} 
          className="w-full max-w-7xl h-[80vh]"
          onClose={handleClose}
        >
          <div className="h-full overflow-y-auto pb-16">
            {renderActiveView()}
          </div>
        </MacosWindow>
      </div>
    </TripProvider>
  );
};

export default VacationBudgetTracker;
