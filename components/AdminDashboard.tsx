
import React, { useState, useEffect } from 'react';
import { Flight, Booking, User } from '../types';
import { StorageService } from '../services/storage';
import { CITIES } from '../constants';
import { CustomSelect } from './CustomSelect';
import { LuxuryButton } from './LuxuryButton';
import { GlowButton } from './GlowButton';

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

  // Re-sync with Storage whenever tab switches
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
      console.log(`System: Purging Flight ID ${id}`);
      // 1. Storage Removal
      const currentFlights = StorageService.getFlights();
      const updated = currentFlights.filter(f => f.id !== id);
      StorageService.updateFlights(updated);
      
      // 2. UI Purge
      setFlights(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to PERMANENTLY delete this booking task?')) {
      console.log(`System: Purging Booking ID ${bookingId}`);
      // 1. Storage Removal
      StorageService.cancelBooking(bookingId);
      
      // 2. UI Purge
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
            className={`px-8 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'flights' ? 'bg-gold-400 text-black shadow-lg shadow-gold-400/20' : 'text-white/60 hover:text-white'}`}
          >
            Manage Routes
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-8 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'bookings' ? 'bg-gold-400 text-black shadow-lg shadow-gold-400/20' : 'text-white/60 hover:text-white'}`}
          >
            Global Bookings
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', val: `$${bookings.reduce((acc, b) => acc + b.totalPrice, 0).toLocaleString()}` },
          { label: 'Scheduled Trips', val: flights.length },
          { label: 'Active Passengers', val: bookings.reduce((acc, b) => acc + b.passengers.length, 0) },
          { label: 'Registered Clients', val: users.length }
        ].map(stat => (
          <div key={stat.label} className="glass-card p-6 rounded-2xl border-l-4 border-l-gold-400 group hover:bg-white/10 transition-colors">
            <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] mb-2 font-bold">{stat.label}</p>
            <p className="text-3xl font-serif text-gold-400 group-hover:scale-105 transition-transform">{stat.val}</p>
          </div>
        ))}
      </div>

      {activeTab === 'flights' ? (
        <div className="space-y-10">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-2xl font-serif text-white">Flight <span className="text-gold-400">Inventory</span></h3>
            {!isAdding && (
              <LuxuryButton onClick={() => { setIsAdding(true); setEditingFlight(null); }}>
                Launch New Route
              </LuxuryButton>
            )}
          </div>

          {isAdding && (
            <div className="glass-card p-10 rounded-3xl border border-gold-400/40 animate-in slide-in-from-top-10 shadow-2xl relative z-30">
              <div className="absolute top-0 right-0 p-4">
                <button onClick={() => setIsAdding(false)} className="text-white/30 hover:text-white">✕</button>
              </div>
              <h4 className="text-gold-400 font-bold uppercase text-[11px] tracking-[0.3em] mb-8 border-b border-white/10 pb-4">
                {editingFlight ? `Modify Trip: ${editingFlight.flightNumber}` : 'Initialize New Global Route'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-white/50 italic font-bold">Flight Number</label>
                  <input className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm focus:border-gold-400 outline-none text-white" placeholder="e.g. PR-999" value={formFlight.flightNumber || ''} onChange={e => setFormFlight({...formFlight, flightNumber: e.target.value.toUpperCase()})} />
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
                
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-white/50 italic font-bold">Flight Date</label>
                  <input type="date" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm focus:border-gold-400 outline-none text-white" value={formFlight.departureDate} onChange={e => setFormFlight({...formFlight, departureDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-white/50 italic font-bold">Base Price (USD)</label>
                  <input type="number" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm focus:border-gold-400 outline-none text-white" value={formFlight.basePrice} onChange={e => setFormFlight({...formFlight, basePrice: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-white/50 italic font-bold">Duration</label>
                  <input className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm focus:border-gold-400 outline-none text-white" placeholder="e.g. 7h 45m" value={formFlight.duration} onChange={e => setFormFlight({...formFlight, duration: e.target.value})} />
                </div>

                <CustomSelect 
                  label="Aircraft Fleet"
                  value={formFlight.aircraftId || ''}
                  options={aircrafts.map(a => ({ value: a.id, label: `${a.model} (${a.capacity} seats)` }))}
                  onChange={val => setFormFlight({...formFlight, aircraftId: val})}
                />

                <div className="space-y-2 flex items-end pb-4">
                  <label className="flex items-center space-x-4 cursor-pointer group">
                    <input type="checkbox" className="w-6 h-6 rounded-md accent-gold-400 cursor-pointer" checked={formFlight.isDirect} onChange={e => setFormFlight({...formFlight, isDirect: e.target.checked})} />
                    <span className="text-xs uppercase tracking-[0.2em] text-white/70 group-hover:text-gold-400 transition-colors">Direct Flight Service</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-8 mt-12 pt-8 border-t border-white/10 items-center">
                <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white text-[10px] uppercase font-bold tracking-[0.3em] transition-all">Discard Changes</button>
                <LuxuryButton onClick={handleSaveFlight}>
                  {editingFlight ? 'Apply Changes' : 'Confirm & Launch'}
                </LuxuryButton>
              </div>
            </div>
          )}

          <div className="glass-card rounded-3xl overflow-hidden border border-white/5 shadow-inner z-10 relative">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-6 text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Ref</th>
                  <th className="p-6 text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Route & Date</th>
                  <th className="p-6 text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Specs</th>
                  <th className="p-6 text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold text-right">Base Price</th>
                  <th className="p-6 text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {flights.map(f => (
                  <tr key={f.id} className="hover:bg-white/5 transition-all group">
                    <td className="p-6">
                      <p className="font-mono text-gold-400 text-xs font-bold">{f.flightNumber}</p>
                      <p className="text-[9px] text-white/30 uppercase mt-1 tracking-tighter">{f.id}</p>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{f.departureCity.split('(')[0]}</span>
                        <span className="text-gold-400 opacity-50">→</span>
                        <span className="text-sm font-medium">{f.destinationCity.split('(')[0]}</span>
                      </div>
                      <p className="text-[10px] text-white/50 mt-1 uppercase tracking-widest">{f.departureDate}</p>
                    </td>
                    <td className="p-6">
                      <div className="space-y-1">
                        <p className="text-[10px] text-white/80"><span className="text-white/40">Dur:</span> {f.duration}</p>
                        <p className="text-[10px] text-white/80"><span className="text-white/40">Status:</span> {f.isDirect ? 'Direct' : 'Connecting'}</p>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <span className="text-xl font-serif text-white">${f.basePrice}</span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end space-x-4 items-center">
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
        <div className="space-y-10 animate-in fade-in">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-2xl font-serif text-white">Global <span className="text-gold-400">Registry</span></h3>
          </div>
          <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-6 text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Booking ID</th>
                  <th className="p-6 text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Customer</th>
                  <th className="p-6 text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Trip Details</th>
                  <th className="p-6 text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold text-right">Revenue</th>
                  <th className="p-6 text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold text-center">Status</th>
                  <th className="p-6 text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map(b => {
                  const flight = flights.find(f => f.id === b.flightId);
                  const user = users.find(u => u.id === b.userId);
                  return (
                    <tr key={b.id} className="hover:bg-white/5 transition-all">
                      <td className="p-6 font-mono text-gold-400 text-xs font-bold">{b.id}</td>
                      <td className="p-6">
                        <p className="text-sm font-bold text-white">{user?.name}</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-tighter mt-0.5">{user?.email}</p>
                      </td>
                      <td className="p-6">
                        <p className="text-xs text-white/80">
                          {flight ? `${flight.departureCity.split(' ')[0]} → ${flight.destinationCity.split(' ')[0]}` : 'Trip Removed'}
                        </p>
                        <p className="text-[9px] text-gold-400/60 uppercase tracking-widest mt-1">{b.class} Class</p>
                      </td>
                      <td className="p-6 text-right">
                        <p className="text-lg font-serif text-white">${b.totalPrice.toLocaleString()}</p>
                      </td>
                      <td className="p-6 text-center">
                        <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20">
                          Confirmed
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <GlowButton variant="red" onClick={() => handleCancelBooking(b.id)}>
                          Delete
                        </GlowButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
