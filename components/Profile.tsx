
import React, { useState } from 'react';
import { User, Booking, Flight } from '../types';
import { StorageService } from '../services/storage';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [bookings, setBookings] = useState<Booking[]>(StorageService.getBookings().filter(b => b.userId === user.id));
  const flights = StorageService.getFlights();

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this booking? This action is irreversible.')) {
      StorageService.cancelBooking(id);
      setBookings(StorageService.getBookings().filter(b => b.userId === user.id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <header className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h2 className="text-4xl font-serif text-white">Your <span className="text-gold-400">Journeys</span></h2>
          <p className="text-white/40 text-sm uppercase tracking-widest mt-1">Manage your luxury travel history</p>
        </div>
        <div className="text-right">
          <p className="text-gold-400 font-bold uppercase text-xs tracking-widest">{user.name}</p>
          <p className="text-white/40 text-xs">{user.email}</p>
        </div>
      </header>

      {bookings.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-lg">
          <p className="text-white/50 mb-6">You have no active or past bookings.</p>
          <button className="btn-gold text-black px-8 py-3 rounded-sm font-bold uppercase text-xs tracking-widest">
            Book Your First Flight
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(b => {
            const flight = flights.find(f => f.id === b.flightId);
            return (
              <div key={b.id} className="glass-card p-8 rounded-lg border border-white/5 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-grow">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-tighter ${b.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {b.status}
                    </span>
                    <span className="text-white/30 text-xs font-mono">{b.id}</span>
                  </div>
                  
                  <div className="flex items-center space-x-12">
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Route</p>
                      <p className="text-xl font-serif">{flight?.departureCity} → {flight?.destinationCity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Date</p>
                      <p className="text-lg">{flight?.departureDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Class</p>
                      <p className="text-lg text-gold-400">{b.class}</p>
                    </div>
                  </div>
                </div>

                <div className="md:border-l border-white/10 md:pl-8 text-right flex flex-col items-end">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Total Paid</p>
                  <p className="text-2xl font-bold mb-4">${b.totalPrice}</p>
                  <div className="flex space-x-3">
                    {b.status === 'Confirmed' && (
                      <button 
                        onClick={() => handleCancel(b.id)}
                        className="text-red-400 text-xs uppercase hover:underline"
                      >
                        Cancel Booking
                      </button>
                    )}
                    <button className="text-gold-400 text-xs uppercase hover:underline">Download Receipt</button>
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
