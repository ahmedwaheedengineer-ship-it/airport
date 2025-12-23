
import React, { useState } from 'react';
import { User, Booking, Flight } from '../types';
import { StorageService } from '../services/storage';
import { LuxuryButton } from './LuxuryButton';
import { GlowButton } from './GlowButton';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [bookings, setBookings] = useState<Booking[]>(StorageService.getBookings().filter(b => b.userId === user.id));
  const flights = StorageService.getFlights();

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to PERMANENTLY delete this journey record? This action cannot be undone.')) {
      StorageService.cancelBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in duration-700 pb-32">
      <header className="flex justify-between items-end border-b border-white/10 pb-12">
        <div>
          <h2 className="text-6xl font-serif text-white">Your <span className="text-gold-400 font-bold tracking-tight">Sky Logs</span></h2>
          <p className="text-white/30 text-sm uppercase tracking-[0.5em] mt-4 font-bold italic">Official Airline Reservation Registry</p>
        </div>
        <div className="text-right">
          <p className="text-gold-400 font-bold uppercase text-lg tracking-[0.4em] mb-2">{user.name}</p>
          <p className="text-white/20 text-xs tracking-[0.5em] uppercase">Status: Elite Sovereign</p>
        </div>
      </header>

      {bookings.length === 0 ? (
        <div className="text-center py-48 glass-card rounded-[4rem] border-dashed border-white/10">
          <p className="text-white/20 mb-12 uppercase tracking-[0.8em] text-sm italic font-bold">No active flight records identified.</p>
          <LuxuryButton onClick={() => window.location.reload()}>
            Initiate First Journey
          </LuxuryButton>
        </div>
      ) : (
        <div className="space-y-12">
          {bookings.map(b => {
            const flight = flights.find(f => f.id === b.flightId);
            return (
              <div key={b.id} className="glass-card rounded-[3rem] border border-white/5 hover:border-gold-400/20 transition-all duration-500 overflow-hidden ticket-grid group">
                <div className="glare-overlay"></div>
                
                <div className="relative z-10 p-16 flex flex-col justify-between">
                  <div className="flex items-center space-x-8 mb-12">
                    <span className="px-6 py-2 rounded-full text-[10px] uppercase font-bold tracking-[0.5em] bg-gold-400/10 text-gold-400 border border-gold-400/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                      Sovereign Reservation
                    </span>
                    <span className="text-white/10 text-[10px] font-mono tracking-widest uppercase">Registry Index: {b.id}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="space-y-4">
                      <p className="text-[10px] text-white/30 uppercase tracking-[0.5em] font-bold italic">Route Connection</p>
                      <div className="flex items-center space-x-6">
                        <p className="text-3xl font-serif text-white tracking-tight">{flight?.departureCity.split('(')[0] || 'Origin'}</p>
                        <span className="text-gold-400 text-xl font-bold animate-pulse">✈</span> 
                        <p className="text-3xl font-serif text-white tracking-tight">{flight?.destinationCity.split('(')[0] || 'Arrival'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[10px] text-white/30 uppercase tracking-[0.5em] font-bold italic">Departure Schedule</p>
                      <p className="text-2xl text-white/90 font-bold tracking-[0.2em] uppercase">{flight?.departureDate || 'N/A'}</p>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[10px] text-white/30 uppercase tracking-[0.5em] font-bold italic">Class Allocation</p>
                      <p className="text-2xl text-gold-400 font-bold italic tracking-[0.3em] uppercase">{b.class}</p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 bg-white/[0.02] border-l border-dashed border-white/20 p-16 flex flex-col items-center justify-center text-center group-hover:bg-white/[0.05] transition-colors">
                  <div className="absolute top-0 left-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-luxury-deep border border-white/10"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 -translate-x-1/2 translate-y-1/2 rounded-full bg-luxury-deep border border-white/10"></div>
                  
                  <p className="text-[11px] text-white/30 uppercase tracking-[0.6em] mb-4 font-bold italic">Journey Value</p>
                  <p className="text-5xl font-serif text-white gold-gradient mb-12 tracking-tighter">${b.totalPrice.toLocaleString()}</p>
                  
                  <div className="flex flex-col space-y-6 w-full max-w-[200px]">
                    <GlowButton variant="blue" className="w-full h-12">
                      Digital Receipt
                    </GlowButton>
                    <GlowButton variant="red" onClick={() => handleCancel(b.id)} className="w-full h-12">
                      Purge Record
                    </GlowButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
