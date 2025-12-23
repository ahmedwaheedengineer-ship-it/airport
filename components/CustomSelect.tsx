
import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
  isOffline?: boolean;
}

interface CustomSelectProps {
  label: string;
  value: string;
  options: (string | Option)[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizedOptions = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-3 relative w-full" ref={containerRef} style={{ zIndex: isOpen ? 1000 : 1 }}>
      <label className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold ml-1 italic block">
        {label}
      </label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full bg-white/5 border p-5 rounded-2xl text-white cursor-pointer transition-all duration-300 flex justify-between items-center
          ${isOpen ? 'border-gold-400 ring-1 ring-gold-400/20 bg-white/10' : 'border-white/10 hover:border-white/30 hover:bg-white/10'}
        `}
      >
        <span className={selectedOption ? 'text-white font-medium' : 'text-white/30 italic font-light'}>
          {selectedOption ? selectedOption.label : placeholder || 'Select option'}
        </span>
        <svg 
          className={`w-4 h-4 text-gold-400 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-3 bg-[#0f1115] rounded-2xl border border-gold-400/30 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-200" style={{ zIndex: 10000 }}>
          <div className="max-h-64 overflow-y-auto custom-scrollbar py-2">
            {normalizedOptions.map((opt) => (
              <div
                key={opt.value}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!opt.isOffline) {
                    onChange(opt.value);
                    setIsOpen(false);
                  }
                }}
                className={`
                  px-6 py-4 text-sm transition-all flex items-center justify-between
                  ${opt.isOffline 
                    ? 'opacity-30 cursor-not-allowed grayscale' 
                    : (opt.value === value ? 'bg-gold-400/20 text-gold-400 font-bold cursor-pointer' : 'text-white/80 hover:bg-white/10 hover:text-white cursor-pointer')
                  }
                `}
              >
                <div className="flex items-center space-x-3 truncate">
                  <span className="truncate">{opt.label}</span>
                  {opt.isOffline && (
                    <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded-sm uppercase tracking-widest font-bold">Offline</span>
                  )}
                </div>
                {opt.value === value && !opt.isOffline && (
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400 shadow-[0_0_8px_#d4af37] flex-shrink-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
