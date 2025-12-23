
import React, { useRef, useEffect } from 'react';
import { User, UserRole } from '../types';
import { LuxuryButton } from './LuxuryButton';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

/**
 * Sovereign Aura Logo:
 * A high-luxury, abstract animated crest.
 * Features a "breathing" golden core, orbital light rings, and a floating aero-mark.
 */
export const WolfLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      {/* Soft Gold Aura Gradient */}
      <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f5edd4" stopOpacity="0.6" />
        <stop offset="60%" stopColor="#d4af37" stopOpacity="0.2" />
        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
      </radialGradient>

      {/* Deep Gold Stroke Gradient */}
      <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#bd962b" />
        <stop offset="50%" stopColor="#f5edd4" />
        <stop offset="100%" stopColor="#845c1f" />
      </linearGradient>

      {/* Filter for subtle bloom */}
      <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Primary Aura Pulse */}
    <circle cx="50" cy="50" r="45" fill="url(#auraGlow)">
      <animate 
        attributeName="r" 
        values="42;48;42" 
        dur="4s" 
        repeatCount="indefinite" 
        calcMode="spline" 
        keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" 
      />
      <animate 
        attributeName="opacity" 
        values="0.4;0.8;0.4" 
        dur="4s" 
        repeatCount="indefinite" 
      />
    </circle>

    {/* Orbital Rings - Counter-rotating for complexity */}
    <g filter="url(#glowFilter)">
      {/* Fast Outer Shimmer Ring */}
      <circle 
        cx="50" cy="50" r="40" 
        stroke="url(#goldStroke)" 
        strokeWidth="0.5" 
        strokeDasharray="2 15" 
        opacity="0.5"
      >
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          from="0 50 50" 
          to="360 50 50" 
          dur="10s" 
          repeatCount="indefinite" 
        />
      </circle>

      {/* Slow Inner Stable Ring */}
      <circle 
        cx="50" cy="50" r="36" 
        stroke="url(#goldStroke)" 
        strokeWidth="0.25" 
        strokeDasharray="40 20" 
        opacity="0.3"
      >
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          from="360 50 50" 
          to="0 50 50" 
          dur="25s" 
          repeatCount="indefinite" 
        />
      </circle>
    </g>

    {/* Central Aero Mark - The Sovereign Wing */}
    <g transform="translate(50, 50)">
      <path 
        d="M-22 12 L0 -24 L22 12" 
        stroke="url(#goldStroke)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <animate 
          attributeName="d" 
          values="M-22 12 L0 -24 L22 12; M-24 10 L0 -26 L24 10; M-22 12 L0 -24 L22 12" 
          dur="4s" 
          repeatCount="indefinite"
          calcMode="spline" 
          keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
        />
      </path>
      
      {/* Floating Accent */}
      <path 
        d="M-10 16 L0 6 L10 16" 
        stroke="#f5edd4" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        opacity="0.5"
      >
        <animate 
          attributeName="opacity" 
          values="0.2;0.7;0.2" 
          dur="2s" 
          repeatCount="indefinite" 
        />
      </path>

      {/* The Core Spark */}
      <circle cx="0" cy="-24" r="2" fill="#fff">
        <animate 
          attributeName="opacity" 
          values="0.4;1;0.4" 
          dur="1.5s" 
          repeatCount="indefinite" 
        />
        <animate 
          attributeName="r" 
          values="1.5;2.5;1.5" 
          dur="1.5s" 
          repeatCount="indefinite" 
        />
      </circle>
    </g>
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
            <div className="flex items-center justify-center p-1.5 border border-gold-400/30 rounded-full bg-black/60 shadow-lg shadow-gold-400/20">
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
                Trips
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
