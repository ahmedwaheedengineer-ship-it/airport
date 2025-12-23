
import React, { useState, useEffect } from 'react';
import { Flight, Booking, User } from '../types';
import { StorageService } from '../services/storage';
import { CITIES } from '../constants';
import { CustomSelect } from './CustomSelect';
import { LuxuryButton } from './LuxuryButton';
import { GlowButton } from './GlowButton';
import { TisepseButton } from './TisepseButton';

export const AdminDashboard: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>(StorageService.getFlights());
  const [bookings, setBookings] = useState<Booking[]>(StorageService.getBookings());
  const [activeTab, setActiveTab] = useState<'flights' | 'bookings'>('flights');
  
  const aircrafts = StorageService.getAircrafts();
  const users = StorageService.getUsers();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);

  const [formFlight, setFormFlight] = useState<Partial<Flight>>({
    flightNumber: '',
    departureCity: CITIES[0],
    destinationCity: CITIES[1],
    departureDate: new Date().toISOString().split('T')[0],
    basePrice: 500,
    duration: '5h 30m',
    isDirect: true,
    aircraftId: aircrafts[0].id
  });

  useEffect(() => {
    setFlights(StorageService.getFlights());
    setBookings(StorageService.getBookings());
  }, [activeTab]);

  const handleSaveFlight = () => {
    if (!formFlight.departureDate || !formFlight.flightNumber || !formFlight.departureCity || !formFlight.destinationCity) {
      alert('Required details are missing.');
      return;
    }
    
    const currentFlights = StorageService.getFlights();
    let updated;
    if (editingFlight) {
      updated = currentFlights.map(f => f.id === editingFlight.id ? { ...f, ...formFlight } : f);
    } else {
      const flight: Flight = {
        ...formFlight as Flight,
        id: 'F-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
        seatsAvailable: aircrafts.find(a => a.id === formFlight.aircraftId)?.capacity || 300
      };
      updated = [...currentFlights, flight];
    }
    
    StorageService.updateFlights(updated);
    setFlights(updated);
    setIsAdding(false);
    setEditingFlight(null);
  };

  const startEdit = (flight: Flight) => {
    setEditingFlight(flight);
    setFormFlight(flight);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteFlight = (id: string) => {
    if (confirm('Permanently delete this flight trip? This action cannot be reversed.')) {
      const currentFlights = StorageService.getFlights();
      const updated = currentFlights.filter(f => f.id !== id);
      StorageService.updateFlights(updated);
      setFlights(updated);
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to PERMANENTLY delete this booking task?')) {
      StorageService.cancelBooking(bookingId);
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    }
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-serif text-white">Admin <span className="text-gold-400 font-bold">Command</span></h2>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] mt-2">Prime Air Global Operations</p>
        </div>
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-2xl">
          <button 
            onClick={() => setActiveTab('flights')}
            className={`px-8 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'flights' ? 'bg-gold-400 text-black' : 'text-white/60 hover:text-white'}`}
          >
            Manage Routes
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-8 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'bookings' ? 'bg-gold-400 text-black' : 'text-white/60 hover:text-white'}`}
          >
            Global Bookings
          </button>
        </div>
      </header>

      {activeTab === 'flights' ? (
        <div className="space-y-10">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-2xl font-serif text-white">Flight <span className="text-gold-400">Inventory</span></h3>
            {!isAdding && (
              <TisepseButton onClick={() => { setIsAdding(true); setEditingFlight(null); }}>
                Launch New Route
              </TisepseButton>
            )}
          </div>

          {isAdding && (
            <div className="glass-card p-10 rounded-3xl border border-gold-400/40 animate-in slide-in-from-top-10 shadow-2xl relative z-40">
              <div className="absolute top-0 right-0 p-4">
                <button onClick={() => setIsAdding(false)} className="text-white/30 hover:text-white">✕</button>
              </div>
              <h4 className="text-gold-400 font-bold uppercase text-[11px] tracking-[0.3em] mb-8 border-b border-white/10 pb-4">
                {editingFlight ? `Modify Trip: ${editingFlight.flightNumber}` : 'Initialize New Global Route'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-white/50 font-bold">Flight Number</label>
                  <input className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm focus:border-gold-400 outline-none text-white" value={formFlight.flightNumber || ''} onChange={e => setFormFlight({...formFlight, flightNumber: e.target.value.toUpperCase()})} />
                </div>
                
                <CustomSelect 
                  label="Departure Port"
                  value={formFlight.departureCity || ''}
                  options={CITIES}
                  onChange={val => setFormFlight({...formFlight, departureCity: val})}
                />
                
                <CustomSelect 
                  label="Destination Port"
                  value={formFlight.destinationCity || ''}
                  options={CITIES}
                  onChange={val => setFormFlight({...formFlight, destinationCity: val})}
                />
              </div>

              <div className="flex justify-end space-x-8 mt-12 pt-8 border-t border-white/10 items-center">
                <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white text-[10px] uppercase font-bold tracking-[0.3em]">Discard Changes</button>
                <LuxuryButton onClick={handleSaveFlight}>
                  {editingFlight ? 'Apply Changes' : 'Confirm & Launch'}
                </LuxuryButton>
              </div>
            </div>
          )}

          <div className="glass-card rounded-3xl overflow-hidden border border-white/5 relative z-10">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-6 text-[10px] text-white/40 uppercase font-bold tracking-[0.3em]">Ref</th>
                  <th className="p-6 text-[10px] text-white/40 uppercase font-bold tracking-[0.3em]">Route</th>
                  <th className="p-6 text-[10px] text-white/40 uppercase font-bold tracking-[0.3em] text-right">Price</th>
                  <th className="p-6 text-[10px] text-white/40 uppercase font-bold tracking-[0.3em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {flights.map(f => (
                  <tr key={f.id} className="hover:bg-white/5 transition-all">
                    <td className="p-6 font-mono text-gold-400 text-xs font-bold">{f.flightNumber}</td>
                    <td className="p-6">
                      <span className="text-sm font-medium">{f.departureCity.split('(')[0]} → {f.destinationCity.split('(')[0]}</span>
                    </td>
                    <td className="p-6 text-right">
                      <span className="text-xl font-serif text-white">${f.basePrice}</span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end space-x-4">
                        <GlowButton variant="blue" onClick={() => startEdit(f)}>Edit</GlowButton>
                        <GlowButton variant="red" onClick={() => handleDeleteFlight(f.id)}>Delete</GlowButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-6 text-[10px] text-white/40 uppercase font-bold tracking-[0.3em]">Booking ID</th>
                  <th className="p-6 text-[10px] text-white/40 uppercase font-bold tracking-[0.3em]">Customer</th>
                  <th className="p-6 text-[10px] text-white/40 uppercase font-bold tracking-[0.3em] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td className="p-6 font-mono text-gold-400 text-xs">{b.id}</td>
                    <td className="p-6">{users.find(u => u.id === b.userId)?.name}</td>
                    <td className="p-6 text-right">
                      <GlowButton variant="red" onClick={() => handleCancelBooking(b.id)}>Delete</GlowButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
