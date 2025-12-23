
import React, { useState, useEffect } from 'react';
import { Flight, TravelClass, Passenger, Booking, User } from '../types';
import { StorageService } from '../services/storage';
import { EXTRAS, CLASS_MULTIPLIERS, CITIES } from '../constants';
import { SeatPicker } from './SeatPicker';
import { CustomSelect } from './CustomSelect';
import { LuxuryButton } from './LuxuryButton';

interface BookingFlowProps {
  user: User | null;
  onNavigate: (view: string) => void;
  onComplete: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ user, onNavigate, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [travelClass, setTravelClass] = useState<TravelClass>(TravelClass.ECONOMY);
  const [passengerCount, setPassengerCount] = useState({ adults: 1, children: 0, infants: 0 });
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const totalPassengerCount = passengerCount.adults + passengerCount.children + passengerCount.infants;

  // FIX: Sync passengers array whenever the total count changes
  useEffect(() => {
    setPassengers(prev => {
      if (prev.length === totalPassengerCount) return prev;
      if (prev.length > totalPassengerCount) return prev.slice(0, totalPassengerCount);
      
      const diff = totalPassengerCount - prev.length;
      const extra: Passenger[] = Array(diff).fill(null).map(() => ({
        fullName: '', passportNumber: '', nationality: '', dateOfBirth: '', email: '', phone: '', type: 'Adult'
      }));
      return [...prev, ...extra];
    });

    // Reset seats if count changes to avoid mismatch
    setSelectedSeats([]);
  }, [totalPassengerCount]);

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    setStep(2);
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
    onComplete();
  };

  const allFlights = StorageService.getFlights();

  const availableOrigins = new Set(allFlights.map(f => f.departureCity));
  const originOptions = CITIES.map(city => ({ 
    value: city, 
    label: city,
    isOffline: !availableOrigins.has(city)
  }));

  const availableDestinations = new Set(
    allFlights
      .filter(f => searchFrom ? f.departureCity === searchFrom : true)
      .map(f => f.destinationCity)
  );
  const destinationOptions = CITIES.map(city => ({ 
    value: city, 
    label: city,
    isOffline: !availableDestinations.has(city)
  }));

  if (step === 1) {
    const filteredFlights = hasSearched 
      ? allFlights.filter(f => 
          (searchFrom ? f.departureCity.includes(searchFrom) : true) && 
          (searchTo ? f.destinationCity.includes(searchTo) : true)
        )
      : [];

    return (
      <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
        <section className="relative h-[650px] rounded-[3rem] overflow-hidden group shadow-2xl border border-white/5">
          <div className="absolute inset-0 bg-[#050608]">
            <img 
              src="https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2000&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-50 grayscale transition-transform duration-[20s] group-hover:scale-110"
              alt="Background"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-60"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-deep via-transparent to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-16 md:p-28">
            <span className="text-gold-400 font-bold uppercase tracking-[0.5em] text-[10px] mb-6">Sovereign Air Logistics</span>
            <h2 className="text-7xl md:text-9xl font-serif text-white max-w-5xl mb-10 leading-none">
              Sovereign <br />
              <span className="text-gold-400 italic gold-gradient">Excellence.</span>
            </h2>
          </div>
        </section>

        <section className="glass-card p-12 rounded-[3.5rem] border border-white/10 -mt-36 relative z-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-end">
            <CustomSelect 
              label="Departure Port"
              value={searchFrom}
              options={originOptions}
              onChange={(val) => {
                setSearchFrom(val);
                setSearchTo('');
              }}
              placeholder="Select Port"
            />
            <CustomSelect 
              label="Arrival Port"
              value={searchTo}
              options={destinationOptions}
              onChange={setSearchTo}
              placeholder="Select Port"
            />
            <CustomSelect 
              label="Service Class"
              value={travelClass}
              options={[
                { value: TravelClass.ECONOMY, label: 'Prime Standard' },
                { value: TravelClass.BUSINESS, label: 'Prime Executive' },
                { value: TravelClass.FIRST, label: 'Prime First' },
              ]}
              onChange={(val) => setTravelClass(val as TravelClass)}
            />
            <LuxuryButton onClick={() => setHasSearched(true)} className="w-full h-[66px]">
              Check Routes
            </LuxuryButton>
          </div>
        </section>

        {hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
            {filteredFlights.length > 0 ? filteredFlights.map(f => (
              <div key={f.id} className="glass-card rounded-[3rem] p-12 h-[520px] flex flex-col group hover:border-gold-400/40 transition-all duration-500 hover:-translate-y-4">
                <div className="glare-overlay"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-12">
                    <div className="bg-gold-400/10 px-4 py-1 rounded-full border border-gold-400/20">
                      <span className="text-[10px] text-gold-400 font-bold tracking-[0.4em] uppercase">{f.flightNumber}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-serif text-white gold-gradient">${(f.basePrice * CLASS_MULTIPLIERS[travelClass]).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex-grow space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="text-center w-full">
                        <p className="text-3xl font-serif text-white tracking-tight">{f.departureCity.split('(')[0]}</p>
                      </div>
                      <div className="px-6">
                        <div className="w-16 h-px bg-gold-400/40 relative">
                           <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold-400"></div>
                        </div>
                      </div>
                      <div className="text-center w-full">
                        <p className="text-3xl font-serif text-white tracking-tight">{f.destinationCity.split('(')[0]}</p>
                      </div>
                    </div>
                  </div>

                  <LuxuryButton onClick={() => handleFlightSelect(f)} className="w-full mt-12">
                    Confirm Selection
                  </LuxuryButton>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-32 text-center glass-card rounded-[3rem] border-dashed border-white/10">
                <p className="text-white/20 uppercase tracking-[0.6em] text-sm italic">No flights currently scheduled.</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Step 2+: Seat and Manifest selection
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center justify-between">
        <button onClick={() => setStep(1)} className="text-white/30 hover:text-gold-400 transition-colors uppercase text-[10px] font-bold tracking-[0.5em]">
          ← Back to Flight Search
        </button>
        <h3 className="text-2xl font-serif text-white italic">Cabin <span className="text-gold-400 not-italic font-bold">Layout</span></h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8">
          <SeatPicker 
            selectedClass={travelClass} 
            passengerCount={totalPassengerCount}
            selectedSeats={selectedSeats}
            onSeatToggle={(id) => setSelectedSeats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
          />
        </div>
        <div className="lg:col-span-4 space-y-10">
          <div className="glass-card p-12 rounded-[3rem] border border-gold-400/20">
             <div className="glare-overlay"></div>
             <div className="relative z-10">
              <h4 className="text-gold-400 uppercase tracking-[0.4em] text-[11px] font-bold mb-10 border-b border-white/5 pb-6">Manifest Config</h4>
              <div className="space-y-10">
                {['Adults', 'Children', 'Infants'].map(type => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-[12px] uppercase tracking-widest text-white/60 font-bold">{type}</span>
                    <div className="flex items-center space-x-8">
                      <button 
                        onClick={() => setPassengerCount(p => ({...p, [type.toLowerCase()]: Math.max(type === 'Adults' ? 1 : 0, p[type.toLowerCase() as keyof typeof passengerCount] - 1)}))}
                        className="w-10 h-10 rounded-full border border-white/10 hover:border-gold-400 transition-colors text-white/40"
                      > − </button>
                      <span className="font-serif text-2xl w-6 text-center">{passengerCount[type.toLowerCase() as keyof typeof passengerCount]}</span>
                      <button 
                        onClick={() => setPassengerCount(p => ({...p, [type.toLowerCase()]: p[type.toLowerCase() as keyof typeof passengerCount] + 1}))}
                        className="w-10 h-10 rounded-full border border-white/10 hover:border-gold-400 transition-colors text-white/40"
                      > + </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <LuxuryButton 
            disabled={selectedSeats.length !== totalPassengerCount}
            onClick={handleFinalBooking}
            className="w-full h-[70px]"
          >
            Confirm & Reserve
          </LuxuryButton>
        </div>
      </div>
    </div>
  );
};
