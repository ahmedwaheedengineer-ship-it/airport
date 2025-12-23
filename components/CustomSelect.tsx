
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
    <div className="space-y-4 relative w-full" ref={containerRef} style={{ zIndex: isOpen ? 1000 : 10 }}>
      <label className="text-[11px] text-white/50 uppercase tracking-[0.4em] font-bold ml-1 italic block">
        {label}
      </label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full bg-white/5 border p-6 rounded-2xl text-white cursor-pointer transition-all duration-300 flex justify-between items-center
          ${isOpen ? 'border-gold-400 ring-2 ring-gold-400/10 bg-white/10' : 'border-white/10 hover:border-gold-400/40 hover:bg-white/10'}
        `}
      >
        <span className={selectedOption ? 'text-white font-bold tracking-widest' : 'text-white/20 italic font-medium'}>
          {selectedOption ? selectedOption.label : placeholder || 'Inquire Port'}
        </span>
        <svg 
          className={`w-4 h-4 text-gold-400 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-4 bg-[#0a0c10] rounded-2xl border border-gold-400/40 overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,1)] animate-in fade-in zoom-in-95 duration-300" style={{ zIndex: 10001 }}>
          <div className="max-h-72 overflow-y-auto custom-scrollbar py-3">
            {normalizedOptions.length > 0 ? normalizedOptions.map((opt) => (
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
                  px-8 py-5 text-[12px] uppercase tracking-widest transition-all flex items-center justify-between
                  ${opt.isOffline 
                    ? 'opacity-30 cursor-not-allowed grayscale' 
                    : (opt.value === value ? 'bg-gold-400/20 text-gold-400 font-bold cursor-pointer' : 'text-white/60 hover:bg-white/5 hover:text-white cursor-pointer')
                  }
                `}
              >
                <div className="flex items-center space-x-4 truncate">
                  <span className="truncate">{opt.label}</span>
                  {opt.isOffline && (
                    <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded-sm uppercase tracking-widest font-bold">Maintenance</span>
                  )}
                </div>
                {opt.value === value && !opt.isOffline && (
                  <div className="w-2 h-2 rounded-full bg-gold-400 shadow-[0_0_12px_#d4af37] flex-shrink-0"></div>
                )}
              </div>
            )) : (
              <div className="p-8 text-center text-white/20 uppercase text-[10px] italic tracking-widest">No active ports detected</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
