
import React, { useState, useEffect } from 'react';
import { Layout, WolfLogo } from './components/Layout';
import { BookingFlow } from './components/BookingFlow';
import { AuthModal } from './components/AuthModal';
import { Profile } from './components/Profile';
import { AdminDashboard } from './components/AdminDashboard';
import { User, UserRole } from './types';
import { StorageService } from './services/storage';

const App: React.FC = () => {
  const [view, setView] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    StorageService.init();
    setUser(StorageService.getCurrentUser());
  }, []);

  const handleLogin = (u: User) => {
    StorageService.setCurrentUser(u);
    setUser(u);
    setView('home');
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setUser(null);
    setView('home');
  };

  if (!user) {
    return (
      <div className="min-h-screen animated-bg flex flex-col items-center justify-start pt-10 px-4 overflow-hidden">
        {/* Large watermark background using the new logo silhouette */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <WolfLogo className="w-[150%] h-[150%] rotate-[-15deg] translate-x-[-10%] translate-y-[10%]" />
        </div>
        
        <div className="w-full max-w-md relative z-10 mb-10">
          <div className="text-center mb-8">
            <div className="inline-block mb-6 p-10 glass-card rounded-[2rem] border-gold-400/20 bg-black/40">
              <WolfLogo className="w-32 h-32" />
            </div>
            <h1 className="text-5xl font-serif font-bold tracking-[0.4em] text-white uppercase">
              Prime <span className="text-gold-400">Air</span>
            </h1>
            <p className="text-white/40 text-[9px] uppercase tracking-[0.8em] mt-4 italic font-bold">Sovereign Excellence</p>
          </div>
          <AuthModal onSuccess={handleLogin} />
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case 'home':
        return <BookingFlow user={user} onNavigate={setView} onComplete={() => setView('profile')} />;
      case 'profile':
        return <Profile user={user} />;
      case 'admin':
        return user?.role === UserRole.ADMIN ? <AdminDashboard /> : <div className="text-center py-20 text-red-400">Access Denied</div>;
      default:
        return <BookingFlow user={user} onNavigate={setView} onComplete={() => setView('profile')} />;
    }
  };

  return (
    <Layout user={user} onLogout={handleLogout} onNavigate={setView}>
      <div className="py-12">
        {renderView()}
      </div>
    </Layout>
  );
};

export default App;
