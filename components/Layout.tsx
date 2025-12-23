
import React, { useRef, useEffect } from 'react';
import { User, UserRole } from '../types';
import { LuxuryButton } from './LuxuryButton';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

const WolfLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Wolf Head Outline */}
    <path d="M50 5L78 28L94 72L50 95L6 72L22 28L50 5Z" fill="#000" stroke="#d4af37" strokeWidth="1.5" />
    {/* Inner White Contrast */}
    <path d="M50 12L74 32L88 68L50 88L12 68L26 32L50 12Z" fill="white" />
    {/* Interior Landscape Silhouette */}
    <path d="M12 68L35 52L50 68L65 52L88 68L50 88L12 68Z" fill="#000" />
    <path d="M40 58L45 52L50 58L55 52L60 58" stroke="#000" strokeWidth="2" strokeLinejoin="round" /> {/* Peaks */}
    {/* Figure Silhouette */}
    <path d="M49 58C49 58 48 64 48 68C48 68 50 68 50 68C50 64 51 58 51 58" fill="#000" />
    <circle cx="50" cy="56" r="1.5" fill="#000" />
    {/* Flying Birds */}
    <path d="M68 45L71 42L74 45" stroke="#000" strokeWidth="0.8" />
    <path d="M78 38L80 36L82 38" stroke="#000" strokeWidth="0.8" />
  </svg>
);

const Magnetic: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      const dist = Math.sqrt(x * x + y * y);
      if (dist < 120) {
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      } else {
        el.style.transform = `translate(0px, 0px)`;
      }
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);
  return <div ref={ref} className={`magnetic ${className}`} onClick={onClick}>{children}</div>;
};

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate }) => {
  return (
    <div className="min-h-screen animated-bg flex flex-col">
      <nav className="sticky top-0 z-50 glass-card py-5 px-8 mb-10 border-b border-gold-400/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Magnetic className="flex items-center space-x-5 cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            <div className="flex items-center justify-center p-1.5 border border-gold-400/30 rounded-xl bg-black/40">
              <WolfLogo className="w-14 h-14" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold tracking-[0.3em] text-white uppercase leading-none">
                Prime <span className="text-gold-400">Air</span>
              </h1>
              <p className="text-[8px] text-white/30 uppercase tracking-[0.7em] mt-2 font-bold">Sovereign Travel</p>
            </div>
          </Magnetic>

          <div className="flex items-center space-x-12">
            <Magnetic>
              <button 
                onClick={() => onNavigate('home')}
                className="text-white/60 hover:text-white transition-all uppercase text-[10px] tracking-[0.4em] font-bold"
              >
                The Fleet
              </button>
            </Magnetic>
            
            {user && (
              <Magnetic>
                <button 
                  onClick={() => onNavigate('profile')}
                  className="text-white/60 hover:text-white transition-all uppercase text-[10px] tracking-[0.4em] font-bold"
                >
                  Reservations
                </button>
              </Magnetic>
            )}

            {user?.role === UserRole.ADMIN && (
              <Magnetic>
                <button 
                  onClick={() => onNavigate('admin')}
                  className="text-gold-400/60 hover:text-gold-400 transition-all uppercase text-[10px] tracking-[0.4em] font-bold underline underline-offset-8"
                >
                  Command
                </button>
              </Magnetic>
            )}

            <div className="h-5 w-px bg-white/10"></div>

            {user ? (
              <div className="flex items-center space-x-8">
                <div className="text-right hidden sm:block">
                  <p className="text-[11px] text-gold-400 font-bold uppercase tracking-widest">{user.name}</p>
                </div>
                <LuxuryButton onClick={onLogout}>
                  Exit
                </LuxuryButton>
              </div>
            ) : (
              <LuxuryButton onClick={() => onNavigate('auth')}>
                Inquire
              </LuxuryButton>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto w-full px-8 pb-24">
        {children}
      </main>

      <footer className="glass-card py-20 px-8 border-t border-white/5 mt-auto bg-black/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-2">
            <div className="flex items-center space-x-5 mb-8">
              <WolfLogo className="w-12 h-12" />
              <h2 className="text-3xl font-serif font-bold text-white uppercase tracking-[0.2em]">Prime Air</h2>
            </div>
            <p className="text-white/40 leading-relaxed max-w-md text-sm font-light tracking-wide">
              Transcending the traditional airline experience. We offer sovereign control 
              over your time and environment through bespoke aviation logistics and 
              unparalleled luxury service.
            </p>
          </div>
          <div>
            <h3 className="text-gold-400 font-bold uppercase text-[10px] mb-8 tracking-[0.5em]">Service Area</h3>
            <ul className="space-y-5 text-white/30 text-[11px] uppercase tracking-widest font-semibold">
              <li><a href="#" className="hover:text-gold-400 transition-colors">Global Logistics</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Jet Leasing</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">VIP Protection</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gold-400 font-bold uppercase text-[10px] mb-8 tracking-[0.5em]">Inquiries</h3>
            <ul className="space-y-5 text-white/30 text-[11px] uppercase tracking-widest font-semibold">
              <li><a href="#" className="hover:text-gold-400 transition-colors">Contact Center</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Privacy Charter</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Carrier Status</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 text-white/20 text-[9px] uppercase tracking-[0.5em]">
          <span>© 2025 PRIME AIR GLOBAL.</span>
          <div className="flex space-x-8">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Security Encrypted</span>
            <span>24/7 Priority Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
