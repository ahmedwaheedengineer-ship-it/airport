
import React from 'react';
import { TravelClass } from '../types';

interface SeatPickerProps {
  selectedClass: TravelClass;
  passengerCount: number;
  selectedSeats: string[];
  onSeatToggle: (seatId: string) => void;
}

export const SeatPicker: React.FC<SeatPickerProps> = ({ selectedClass, passengerCount, selectedSeats, onSeatToggle }) => {
  const rows = selectedClass === TravelClass.FIRST ? 4 : selectedClass === TravelClass.BUSINESS ? 8 : 20;
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];

  const getSeatStatus = (seatId: string) => {
    if (selectedSeats.includes(seatId)) return 'selected';
    // Random mock booked seats
    const pseudoHash = seatId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    if (pseudoHash % 7 === 0) return 'booked';
    return 'available';
  };

  const handleSeatClick = (seatId: string) => {
    const status = getSeatStatus(seatId);
    if (status === 'booked') return;
    if (status === 'available' && selectedSeats.length >= passengerCount) {
      alert(`You can only select ${passengerCount} seats.`);
      return;
    }
    onSeatToggle(seatId);
  };

  return (
    <div className="p-8 glass-card rounded-lg overflow-x-auto">
      <div className="mb-8 text-center">
        <h3 className="text-xl font-serif text-gold-400 mb-2">Select Your Seats</h3>
        <p className="text-xs text-white/50 uppercase tracking-widest">
          {selectedSeats.length} of {passengerCount} Selected
        </p>
      </div>

      <div className="flex justify-center mb-10 space-x-8 text-xs uppercase tracking-widest">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-sm bg-white/10 border border-white/20"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-sm bg-gold-400"></div>
          <span className="text-gold-400">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-sm bg-red-500/50"></div>
          <span className="text-red-400">Occupied</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Plane Front Indicator */}
        <div className="w-full max-w-sm h-12 bg-gold-400/20 rounded-t-[50%] flex items-center justify-center border-t border-gold-400/40">
          <span className="text-[10px] text-gold-400 uppercase tracking-widest">Cockpit</span>
        </div>

        <div className="grid grid-cols-6 gap-3">
          {Array.from({ length: rows }).map((_, r) => (
            <React.Fragment key={r}>
              {cols.map((c, i) => {
                const seatId = `${r + 1}${c}`;
                const status = getSeatStatus(seatId);
                
                return (
                  <button
                    key={seatId}
                    onClick={() => handleSeatClick(seatId)}
                    disabled={status === 'booked'}
                    className={`
                      w-10 h-10 rounded-t-lg transition-all flex items-center justify-center text-[10px]
                      ${status === 'available' ? 'bg-white/5 border border-white/20 hover:border-gold-400' : ''}
                      ${status === 'selected' ? 'bg-gold-400 text-black border-gold-400 scale-110 shadow-lg shadow-gold-400/20' : ''}
                      ${status === 'booked' ? 'bg-white/5 opacity-20 cursor-not-allowed' : ''}
                      ${i === 2 ? 'mr-12' : ''} // Aisle gap
                    `}
                  >
                    {seatId}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
