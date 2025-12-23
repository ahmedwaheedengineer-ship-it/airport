
import React from 'react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storage';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate }) => {
  return (
    <div className="min-h-screen animated-bg flex flex-col">
      <nav className="sticky top-0 z-50 glass-card py-4 px-6 mb-8 border-b border-gold-400/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 border-2 border-gold-400 rounded-full flex items-center justify-center">
              <span className="text-gold-400 font-serif font-bold text-xl italic">A</span>
            </div>
            <h1 className="text-2xl font-serif font-bold tracking-widest text-white uppercase">
              Aura <span className="text-gold-400">Airways</span>
            </h1>
          </div>

          <div className="flex items-center space-x-8">
            <button 
              onClick={() => onNavigate('home')}
              className="text-white/80 hover:text-gold-400 transition-colors uppercase text-sm tracking-wider font-medium"
            >
              Search Flights
            </button>
            
            {user && (
              <button 
                onClick={() => onNavigate('profile')}
                className="text-white/80 hover:text-gold-400 transition-colors uppercase text-sm tracking-wider font-medium"
              >
                My Bookings
              </button>
            )}

            {user?.role === UserRole.ADMIN && (
              <button 
                onClick={() => onNavigate('admin')}
                className="text-gold-300 hover:text-gold-400 transition-colors uppercase text-sm tracking-wider font-bold"
              >
                Admin Panel
              </button>
            )}

            {user ? (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-white/10">
                <div className="text-right">
                  <p className="text-xs text-white/50 uppercase">Welcome</p>
                  <p className="text-sm font-semibold text-gold-400">{user.name}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 border border-gold-400/30 rounded-sm text-xs uppercase tracking-widest hover:bg-gold-400 hover:text-black transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('auth')}
                className="px-6 py-2 btn-gold text-black text-xs uppercase tracking-widest font-bold rounded-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 pb-20">
        {children}
      </main>

      <footer className="glass-card py-10 px-6 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-serif font-bold text-gold-400 mb-4 uppercase tracking-widest">Aura Airways</h2>
            <p className="text-white/60 leading-relaxed max-w-sm">
              Defining the gold standard in aviation. Experience unparalleled luxury,
              privacy, and precision in every journey you take with us.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold uppercase text-sm mb-4 tracking-widest">Company</h3>
            <ul className="space-y-2 text-white/50 text-sm">
              <li><a href="#" className="hover:text-gold-400">About Us</a></li>
              <li><a href="#" className="hover:text-gold-400">Our Fleet</a></li>
              <li><a href="#" className="hover:text-gold-400">Contact</a></li>
              <li><a href="#" className="hover:text-gold-400">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold uppercase text-sm mb-4 tracking-widest">Support</h3>
            <ul className="space-y-2 text-white/50 text-sm">
              <li><a href="#" className="hover:text-gold-400">Check-in</a></li>
              <li><a href="#" className="hover:text-gold-400">Baggage</a></li>
              <li><a href="#" className="hover:text-gold-400">Manage Booking</a></li>
              <li><a href="#" className="hover:text-gold-400">FAQs</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 text-center text-white/30 text-xs">
          © 2024 Aura Airways. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
