import React, { useState } from 'react';
import { Flight, TravelClass, Passenger, ExtraService, Booking, User } from '../types';
import { StorageService } from '../services/storage';
import { EXTRAS, CLASS_MULTIPLIERS } from '../constants';
import { SeatPicker } from './SeatPicker';

interface BookingFlowProps {
  user: User | null;
  onNavigate: (view: string) => void;
  onComplete: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ user, onNavigate, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [travelClass, setTravelClass] = useState<TravelClass>(TravelClass.ECONOMY);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [passengerCount, setPassengerCount] = useState({ adults: 1, children: 0, infants: 0 });
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  
  const totalPassengerCount = passengerCount.adults + passengerCount.children + passengerCount.infants;

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    setStep(2);
    // Initialize passengers array
    const newPass: Passenger[] = Array(totalPassengerCount).fill(null).map(() => ({
      fullName: '', passportNumber: '', nationality: '', dateOfBirth: '', email: '', phone: '', type: 'Adult'
    }));
    setPassengers(newPass);
  };

  const calculateTotal = () => {
    if (!selectedFlight) return 0;
    const base = selectedFlight.basePrice * CLASS_MULTIPLIERS[travelClass] * totalPassengerCount;
    const extrasTotal = selectedExtras.reduce((acc, id) => {
      const extra = EXTRAS.find(e => e.id === id);
      return acc + (extra?.price || 0);
    }, 0);
    return base + (extrasTotal * totalPassengerCount);
  };

  const handleFinalBooking = () => {
    if (!selectedFlight || !user) return;
    
    const booking: Booking = {
      id: 'BK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: user.id,
      flightId: selectedFlight.id,
      passengers,
      selectedSeats,
      extras: selectedExtras,
      totalPrice: calculateTotal(),
      status: 'Confirmed',
      bookingDate: new Date().toISOString(),
      class: travelClass
    };

    StorageService.saveBooking(booking);
    setStep(5); // Confirmation
  };

  // Step 1: Flight Search & List
  if (step === 1) {
    const flights = StorageService.getFlights();
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="text-center">
          <h2 className="text-5xl font-serif text-white mb-4">Discover Your <span className="text-gold-400">Destination</span></h2>
          <p className="text-white/50 uppercase tracking-widest text-sm">Select a curated luxury route</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {flights.map(f => (
            <div key={f.id} className="glass-card p-6 rounded-lg border border-white/5 hover:border-gold-400/50 transition-all group flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs text-gold-400 font-bold tracking-widest uppercase">{f.flightNumber}</p>
                  <p className="text-lg font-serif">{f.departureCity}</p>
                  <p className="text-white/40 text-sm">to</p>
                  <p className="text-lg font-serif">{f.destinationCity}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">${f.basePrice}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Starting from</p>
                </div>
              </div>

              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Date</span>
                  <span>{f.departureDate}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Duration</span>
                  <span>{f.duration}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Type</span>
                  <span>{f.isDirect ? 'Direct' : 'Transit'}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 flex gap-2">
                <select 
                  className="bg-white/5 border border-white/20 p-2 rounded-sm text-xs uppercase text-gold-300"
                  onChange={(e) => setTravelClass(e.target.value as TravelClass)}
                >
                  <option value={TravelClass.ECONOMY}>Economy</option>
                  <option value={TravelClass.BUSINESS}>Business</option>
                  <option value={TravelClass.FIRST}>First Class</option>
                </select>
                <button 
                  onClick={() => handleFlightSelect(f)}
                  className="flex-grow btn-gold text-black uppercase tracking-widest text-xs font-bold py-3 rounded-sm"
                >
                  Select Flight
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Seat Selection & Passenger Count
  if (step === 2) {
    return (
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <button onClick={() => setStep(1)} className="text-white/50 hover:text-gold-400 transition-colors uppercase text-xs tracking-widest flex items-center">
            ← Back to Results
          </button>
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`w-2 h-2 rounded-full ${s === 2 ? 'bg-gold-400' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <SeatPicker 
              selectedClass={travelClass} 
              passengerCount={totalPassengerCount}
              selectedSeats={selectedSeats}
              onSeatToggle={(id) => {
                setSelectedSeats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
              }}
            />
          </div>
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-lg">
              <h3 className="text-gold-400 uppercase tracking-widest text-sm mb-6 border-b border-white/10 pb-2">Travelers</h3>
              <div className="space-y-4">
                {['Adults', 'Children', 'Infants'].map(type => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm">{type}</span>
                    <div className="flex items-center space-x-3">
                      <button 
                        // Fix: use 'passengerCount' instead of 'p' for keyof typeof to resolve the correct type for dynamic property access
                        onClick={() => setPassengerCount(p => ({...p, [type.toLowerCase()]: Math.max(type === 'Adults' ? 1 : 0, p[type.toLowerCase() as keyof typeof passengerCount] - 1)}))}
                        className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold-400 hover:text-black transition-all"
                      > - </button>
                      <span className="w-4 text-center">{passengerCount[type.toLowerCase() as keyof typeof passengerCount]}</span>
                      <button 
                        // Fix: use 'passengerCount' instead of 'p' for keyof typeof to resolve the correct type for dynamic property access
                        onClick={() => setPassengerCount(p => ({...p, [type.toLowerCase()]: p[type.toLowerCase() as keyof typeof passengerCount] + 1}))}
                        className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold-400 hover:text-black transition-all"
                      > + </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              disabled={selectedSeats.length !== totalPassengerCount}
              onClick={() => setStep(3)}
              className="w-full py-4 btn-gold text-black font-bold uppercase tracking-widest text-sm rounded-sm disabled:opacity-30"
            >
              Continue to Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Passenger Details & Extras
  if (step === 3) {
    return (
      <div className="max-w-4xl mx-auto space-y-12">
        <button onClick={() => setStep(2)} className="text-white/50 hover:text-gold-400 transition-colors uppercase text-xs tracking-widest">
          ← Back to Seats
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h3 className="text-2xl font-serif text-white">Passenger <span className="text-gold-400">Information</span></h3>
            {passengers.map((p, idx) => (
              <div key={idx} className="glass-card p-6 rounded-lg space-y-4">
                <h4 className="text-gold-400 text-xs uppercase tracking-widest font-bold">Passenger {idx + 1}</h4>
                <div className="space-y-4">
                  <input 
                    placeholder="Full Name (as per Passport)"
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-sm"
                    value={p.fullName}
                    onChange={(e) => {
                      const n = [...passengers];
                      n[idx].fullName = e.target.value;
                      setPassengers(n);
                    }}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      placeholder="Passport Number"
                      className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-sm"
                      value={p.passportNumber}
                      onChange={(e) => {
                        const n = [...passengers];
                        n[idx].passportNumber = e.target.value;
                        setPassengers(n);
                      }}
                    />
                    <input 
                      placeholder="Nationality"
                      className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-sm"
                      value={p.nationality}
                      onChange={(e) => {
                        const n = [...passengers];
                        n[idx].nationality = e.target.value;
                        setPassengers(n);
                      }}
                    />
                  </div>
                  <input 
                    type="date"
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-sm"
                    value={p.dateOfBirth}
                    onChange={(e) => {
                      const n = [...passengers];
                      n[idx].dateOfBirth = e.target.value;
                      setPassengers(n);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-serif text-white">Exclusive <span className="text-gold-400">Add-ons</span></h3>
            <div className="space-y-4">
              {EXTRAS.map(extra => (
                <div 
                  key={extra.id} 
                  onClick={() => setSelectedExtras(prev => prev.includes(extra.id) ? prev.filter(x => x !== extra.id) : [...prev, extra.id])}
                  className={`glass-card p-4 rounded-lg flex justify-between items-center cursor-pointer border transition-all ${selectedExtras.includes(extra.id) ? 'border-gold-400 bg-gold-400/5' : 'border-white/5'}`}
                >
                  <div>
                    <p className="font-semibold text-white">{extra.name}</p>
                    <p className="text-xs text-white/40">{extra.description}</p>
                  </div>
                  <div className="text-gold-400 font-bold">+${extra.price}</div>
                </div>
              ))}
            </div>

            <div className="glass-card p-6 rounded-lg bg-gold-400/5 border-gold-400/30">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/60">Flight Total</span>
                <span className="text-xl font-bold">${calculateTotal()}</span>
              </div>
              <button 
                onClick={() => setStep(4)}
                className="w-full py-4 btn-gold text-black font-bold uppercase tracking-widest text-sm rounded-sm"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Checkout
  if (step === 4) {
    return (
      <div className="max-w-2xl mx-auto space-y-10">
        <button onClick={() => setStep(3)} className="text-white/50 hover:text-gold-400 transition-colors uppercase text-xs tracking-widest">
          ← Back to Services
        </button>

        <div className="glass-card p-10 rounded-lg space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-serif text-gold-400 mb-2">Secure Checkout</h3>
            <p className="text-white/40 text-xs uppercase tracking-widest">Encrypted Luxury Transaction</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-white/50 tracking-widest ml-1">Cardholder Name</label>
              <input className="w-full bg-white/5 border border-white/10 p-4 rounded-sm" placeholder="JAMES R. CARTER" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-white/50 tracking-widest ml-1">Card Number</label>
              <input className="w-full bg-white/5 border border-white/10 p-4 rounded-sm" placeholder="•••• •••• •••• ••••" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-white/50 tracking-widest ml-1">Expiry Date</label>
                <input className="w-full bg-white/5 border border-white/10 p-4 rounded-sm" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-white/50 tracking-widest ml-1">CVV</label>
                <input className="w-full bg-white/5 border border-white/10 p-4 rounded-sm" placeholder="•••" />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 space-y-4">
             <div className="flex justify-between text-white/60">
               <span>Subtotal</span>
               <span>${calculateTotal()}</span>
             </div>
             <div className="flex justify-between text-white/60">
               <span>Taxes & Fees</span>
               <span>$142.50</span>
             </div>
             <div className="flex justify-between items-center text-white pt-2 border-t border-white/5">
               <span className="text-xl font-serif">Grand Total</span>
               <span className="text-2xl font-bold text-gold-400">${calculateTotal() + 142.50}</span>
             </div>
          </div>

          <button 
            onClick={handleFinalBooking}
            className="w-full py-5 btn-gold text-black font-bold uppercase tracking-widest text-sm rounded-sm"
          >
            Authorize Payment
          </button>
        </div>
      </div>
    );
  }

  // Step 5: Confirmation / E-Ticket
  if (step === 5) {
    return (
      <div className="max-w-4xl mx-auto py-10 animate-in zoom-in duration-500">
        <div className="glass-card p-12 rounded-lg text-center border-t-8 border-gold-400">
          <div className="w-20 h-20 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-4xl font-serif text-white mb-4">Reservation <span className="text-gold-400">Confirmed</span></h2>
          <p className="text-white/60 mb-12">An electronic ticket has been sent to your registered email address.</p>

          <div className="bg-white/5 border border-white/10 p-10 rounded-lg text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-gold-400/20 font-serif text-7xl select-none uppercase">Ticket</div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Passenger</p>
                <p className="font-semibold">{passengers[0].fullName}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Flight</p>
                <p className="font-semibold">{selectedFlight?.flightNumber}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Class</p>
                <p className="font-semibold text-gold-400">{travelClass}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Seat(s)</p>
                <p className="font-semibold">{selectedSeats.join(', ')}</p>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Departure</p>
                <p className="text-xl font-serif">{selectedFlight?.departureCity}</p>
                <p className="text-sm text-white/60">{selectedFlight?.departureDate} | 14:00</p>
              </div>
              <div className="flex-grow border-b-2 border-dashed border-white/20 mx-8 mb-4 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-400">✈</div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Destination</p>
                <p className="text-xl font-serif">{selectedFlight?.destinationCity}</p>
                <p className="text-sm text-white/60">Estimated Landing | 21:45</p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
              <div className="bg-white p-2 rounded-sm w-32 h-32 flex items-center justify-center">
                <div className="w-28 h-28 bg-black"></div> {/* Mock QR */}
              </div>
              <div className="text-right">
                <p className="text-xs text-white/40 font-mono tracking-widest">AURA-AUTH-RES-98231</p>
              </div>
            </div>
          </div>

          <div className="mt-12 space-x-6">
            <button 
              onClick={onComplete}
              className="px-10 py-4 btn-gold text-black font-bold uppercase tracking-widest text-xs rounded-sm"
            >
              Back to Home
            </button>
            <button className="px-10 py-4 border border-gold-400 text-gold-400 font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-gold-400/10 transition-all">
              Print E-Ticket
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};