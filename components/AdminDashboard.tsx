
import React, { useState } from 'react';
import { Flight, Booking, Aircraft } from '../types';
import { StorageService } from '../services/storage';
import { CITIES } from '../constants';

export const AdminDashboard: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>(StorageService.getFlights());
  const [bookings] = useState<Booking[]>(StorageService.getBookings());
  const aircrafts = StorageService.getAircrafts();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newFlight, setNewFlight] = useState<Partial<Flight>>({
    departureCity: CITIES[0],
    destinationCity: CITIES[1],
    departureDate: '',
    basePrice: 500,
    duration: '6h',
    isDirect: true,
    aircraftId: aircrafts[0].id
  });

  const handleAddFlight = () => {
    if (!newFlight.departureDate || !newFlight.flightNumber) return;
    const flight: Flight = {
      ...newFlight as Flight,
      id: 'F-' + Math.random().toString(36).substr(2, 5),
      seatsAvailable: aircrafts.find(a => a.id === newFlight.aircraftId)?.capacity || 300
    };
    const updated = [...flights, flight];
    StorageService.updateFlights(updated);
    setFlights(updated);
    setIsAdding(false);
  };

  return (
    <div className="space-y-12 pb-20">
      <header>
        <h2 className="text-4xl font-serif text-white">Command <span className="text-gold-400">Center</span></h2>
        <p className="text-white/40 text-sm uppercase tracking-widest mt-1">Global Aviation Management Dashboard</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Active Flights', val: flights.length },
          { label: 'Total Reservations', val: bookings.length },
          { label: 'Revenue Generated', val: `$${bookings.reduce((acc, b) => acc + b.totalPrice, 0).toLocaleString()}` }
        ].map(stat => (
          <div key={stat.label} className="glass-card p-6 rounded-lg text-center">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-gold-400">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-serif">Manage Flights</h3>
          <button 
            onClick={() => setIsAdding(true)}
            className="btn-gold text-black px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-widest"
          >
            Add New Flight
          </button>
        </div>

        {isAdding && (
          <div className="glass-card p-8 rounded-lg border border-gold-400/30">
            <h4 className="text-gold-400 font-bold uppercase text-xs mb-6">New Flight Schedule</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase">Flight Number</label>
                <input className="w-full bg-white/5 border border-white/10 p-2 text-sm" placeholder="e.g. AU999" onChange={e => setNewFlight({...newFlight, flightNumber: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase">From</label>
                <select className="w-full bg-white/5 border border-white/10 p-2 text-sm" onChange={e => setNewFlight({...newFlight, departureCity: e.target.value})}>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase">To</label>
                <select className="w-full bg-white/5 border border-white/10 p-2 text-sm" onChange={e => setNewFlight({...newFlight, destinationCity: e.target.value})}>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase">Date</label>
                <input type="date" className="w-full bg-white/5 border border-white/10 p-2 text-sm" onChange={e => setNewFlight({...newFlight, departureDate: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase">Base Price ($)</label>
                <input type="number" className="w-full bg-white/5 border border-white/10 p-2 text-sm" onChange={e => setNewFlight({...newFlight, basePrice: parseInt(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase">Aircraft</label>
                <select className="w-full bg-white/5 border border-white/10 p-2 text-sm" onChange={e => setNewFlight({...newFlight, aircraftId: e.target.value})}>
                  {aircrafts.map(a => <option key={a.id} value={a.id}>{a.model}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white uppercase text-xs font-bold">Cancel</button>
              <button onClick={handleAddFlight} className="btn-gold text-black px-8 py-3 rounded-sm font-bold uppercase text-xs tracking-widest">Confirm Schedule</button>
            </div>
          </div>
        )}

        <div className="glass-card rounded-lg overflow-hidden border border-white/5">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/10 border-b border-white/10">
                <th className="p-4 text-[10px] text-white/40 uppercase">Flight</th>
                <th className="p-4 text-[10px] text-white/40 uppercase">Route</th>
                <th className="p-4 text-[10px] text-white/40 uppercase">Date</th>
                <th className="p-4 text-[10px] text-white/40 uppercase">Price</th>
                <th className="p-4 text-[10px] text-white/40 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {flights.map(f => (
                <tr key={f.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-gold-400">{f.flightNumber}</td>
                  <td className="p-4 text-sm">{f.departureCity} → {f.destinationCity}</td>
                  <td className="p-4 text-sm">{f.departureDate}</td>
                  <td className="p-4 text-sm font-bold">${f.basePrice}</td>
                  <td className="p-4">
                    <button className="text-gold-400 text-[10px] uppercase font-bold hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
