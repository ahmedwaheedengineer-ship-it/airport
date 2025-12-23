
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
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <header className="flex justify-between items-end border-b border-white/10 pb-10">
        <div>
          <h2 className="text-5xl font-serif text-white">Your <span className="text-gold-400 font-bold tracking-tight">Journeys</span></h2>
          <p className="text-white/40 text-sm uppercase tracking-[0.3em] mt-3 font-medium">Manage your elite travel records</p>
        </div>
        <div className="text-right">
          <p className="text-gold-400 font-bold uppercase text-sm tracking-[0.3em] mb-1">{user.name}</p>
          <p className="text-white/30 text-xs tracking-widest">{user.email}</p>
        </div>
      </header>

      {bookings.length === 0 ? (
        <div className="text-center py-32 glass-card rounded-[3rem] border-dashed border-white/20">
          <p className="text-white/30 mb-12 uppercase tracking-[0.5em] text-[11px] font-bold italic">No active journey records found.</p>
          <LuxuryButton onClick={() => window.location.reload()}>
            Book Your First Journey
          </LuxuryButton>
        </div>
      ) : (
        <div className="space-y-10">
          {bookings.map(b => {
            const flight = flights.find(f => f.id === b.flightId);
            return (
              <div key={b.id} className="glass-card rounded-[2.5rem] border border-white/5 hover:border-gold-400/20 transition-all duration-500 overflow-hidden ticket-grid group">
                <div className="p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-5 mb-8">
                      <span className="px-5 py-2 rounded-full text-[10px] uppercase font-bold tracking-[0.3em] bg-gold-400/10 text-gold-400 border border-gold-400/20">
                        Confirmed Journey
                      </span>
                      <span className="text-white/20 text-[10px] font-mono tracking-tighter uppercase">ID: {b.id}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                      <div className="space-y-3">
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-bold italic">Route</p>
                        <p className="text-2xl font-serif text-white tracking-wide">
                          {flight?.departureCity.split('(')[0] || 'Origin'} 
                          <span className="text-gold-400 px-3">→</span> 
                          {flight?.destinationCity.split('(')[0] || 'Destination'}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-bold italic">Departure</p>
                        <p className="text-xl text-white/90 font-medium tracking-widest uppercase">{flight?.departureDate || 'N/A'}</p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-bold italic">Cabin</p>
                        <p className="text-xl text-gold-400 font-bold italic tracking-widest">{b.class}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border-l border-white/10 p-12 flex flex-col items-center justify-center text-center group-hover:bg-white/10 transition-colors">
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] mb-2 font-bold italic">Value</p>
                  <p className="text-4xl font-serif text-white gold-gradient mb-10 tracking-tighter">${b.totalPrice.toLocaleString()}</p>
                  <div className="flex flex-col space-y-4 w-full px-4">
                    <GlowButton variant="blue" className="w-full">
                      Receipt
                    </GlowButton>
                    <GlowButton variant="red" onClick={() => handleCancel(b.id)} className="w-full">
                      Delete
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
