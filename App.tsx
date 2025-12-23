
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { BookingFlow } from './components/BookingFlow';
import { AuthModal } from './components/AuthModal';
import { Profile } from './components/Profile';
import { AdminDashboard } from './components/AdminDashboard';
import { User, UserRole } from './types';
import { StorageService } from './services/storage';

const WolfLogo: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 5L75 25L95 70L50 95L5 70L25 25L50 5Z" fill="#000" stroke="#d4af37" strokeWidth="1" />
    <path d="M50 15L70 30L85 65L50 85L15 65L30 30L50 15Z" fill="white" />
    <path d="M15 65L35 50L50 65L65 50L85 65L50 85L15 65Z" fill="#000" />
    <circle cx="50" cy="35" r="5" fill="#d4af37" opacity="0.3" />
    <path d="M48 45L52 45L51 55L49 55Z" fill="#000" />
    <path d="M60 40L65 35L70 40" stroke="#000" strokeWidth="0.5" />
  </svg>
);

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
      <div className="min-h-screen animated-bg flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <WolfLogo className="w-[120%] h-[120%] absolute -top-1/4 -left-1/4 rotate-12" />
        </div>
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-8 p-6 glass-card rounded-full border-gold-400/20">
              <WolfLogo className="w-24 h-24" />
            </div>
            <h1 className="text-5xl font-serif font-bold tracking-[0.4em] text-white uppercase">
              Prime <span className="text-gold-400">Air</span>
            </h1>
            <p className="text-white/40 text-[9px] uppercase tracking-[0.8em] mt-6 italic">Sovereign Excellence</p>
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
