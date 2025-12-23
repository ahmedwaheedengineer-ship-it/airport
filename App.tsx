
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
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

  const renderView = () => {
    switch (view) {
      case 'home':
        return <BookingFlow user={user} onNavigate={setView} onComplete={() => setView('profile')} />;
      case 'auth':
        return <AuthModal onSuccess={handleLogin} />;
      case 'profile':
        return user ? <Profile user={user} /> : <AuthModal onSuccess={handleLogin} />;
      case 'admin':
        return user?.role === UserRole.ADMIN ? <AdminDashboard /> : <div className="text-center py-20 text-red-400">Access Denied</div>;
      default:
        return <BookingFlow user={user} onNavigate={setView} onComplete={() => setView('profile')} />;
    }
  };

  return (
    <Layout user={user} onLogout={handleLogout} onNavigate={setView}>
      <div className="py-8">
        {renderView()}
      </div>
    </Layout>
  );
};

export default App;
