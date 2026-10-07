import React, { useState, useEffect } from 'react';
import { HouseProvider, useHouse } from './context/HouseContext';
import { BackgroundWatermark } from './components/layout/BackgroundWatermark';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { unlockAudioContext } from './utils/helpers';

// Pages
import { DashboardView } from './pages/DashboardView';
import { ContestantsView } from './pages/ContestantsView';
import { LeaderboardView } from './pages/LeaderboardView';
import { TasksView } from './pages/TasksView';
import { NominationsView } from './pages/NominationsView';
import { CaptaincyView } from './pages/CaptaincyView';
import { AnnouncementsView } from './pages/AnnouncementsView';
import { EvictionView } from './pages/EvictionView';

const AppContent: React.FC = () => {
  const { activeTab } = useHouse();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global browser audio unlock on first user click/touch
  useEffect(() => {
    const handleUnlock = () => {
      unlockAudioContext();
    };
    window.addEventListener('click', handleUnlock);
    window.addEventListener('keydown', handleUnlock);
    window.addEventListener('touchstart', handleUnlock);
    return () => {
      window.removeEventListener('click', handleUnlock);
      window.removeEventListener('keydown', handleUnlock);
      window.removeEventListener('touchstart', handleUnlock);
    };
  }, []);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'contestants':
        return <ContestantsView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'tasks':
        return <TasksView />;
      case 'nominations':
        return <NominationsView />;
      case 'captaincy':
        return <CaptaincyView />;
      case 'announcements':
        return <AnnouncementsView />;
      case 'eviction':
        return <EvictionView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07080b] text-neutral-100 flex flex-col font-sans overflow-x-hidden">
      {/* Big Boss Dramatic Watermark and Ambient Glow */}
      <BackgroundWatermark />

      {/* Main Application Shell */}
      <div className="relative z-10 flex flex-1 min-h-screen">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content Area with margin for Desktop Sidebar */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          {/* Top Sticky Header */}
          <Header onToggleSidebar={() => setIsSidebarOpen(true)} />

          {/* Main Viewport Container */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
            {renderActiveView()}
          </main>
        </div>
      </div>

      {/* Floating System Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <HouseProvider>
      <AppContent />
    </HouseProvider>
  );
}
