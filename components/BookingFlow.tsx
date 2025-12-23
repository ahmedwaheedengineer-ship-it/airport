
import React, { useState } from 'react';
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
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [passengerCount, setPassengerCount] = useState({ adults: 1, children: 0, infants: 0 });
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const totalPassengerCount = passengerCount.adults + passengerCount.children + passengerCount.infants;

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    setStep(2);
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
    setStep(5);
  };

  const allFlights = StorageService.getFlights();
  const originOptions = CITIES.map(city => ({ value: city, label: city }));
  const destinationOptions = CITIES.map(city => ({ value: city, label: city }));

  if (step === 1) {
    const filteredFlights = hasSearched 
      ? allFlights.filter(f => 
          (searchFrom ? f.departureCity.includes(searchFrom) : true) && 
          (searchTo ? f.destinationCity.includes(searchTo) : true)
        )
      : [];

    return (
      <div className="space-y-16 animate-in fade-in duration-1000">
        <section className="relative h-[600px] rounded-[3rem] overflow-hidden group shadow-2xl border border-white/5">
          <div className="absolute inset-0 bg-black">
            <img 
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2000&auto=format&fit=crop" 
              alt="Elite Jet Interior" 
              className="w-full h-full object-cover opacity-60 transition-transform duration-[10s] group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-deep via-transparent to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-16 md:p-24">
            <span className="text-gold-400 font-bold uppercase tracking-[0.5em] text-[10px] mb-4">Sovereign Airspace</span>
            <h2 className="text-6xl md:text-8xl font-serif text-white max-w-4xl mb-8 leading-tight animate-in slide-in-from-bottom-20 duration-1000 delay-200">
              Ascend Into <br />
              <span className="text-gold-400 italic gold-gradient">Pure Silence</span>
            </h2>
            <p className="text-white/50 text-xl font-light tracking-widest max-w-xl border-l-2 border-gold-400/40 pl-8">
              Bespoke travel experiences curated for those who value time and privacy above all else.
            </p>
          </div>
        </section>

        <section className="glass-card p-12 rounded-[3rem] border border-white/10 -mt-32 relative z-30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-end">
            <CustomSelect 
              label="Point of Departure"
              value={searchFrom}
              options={originOptions}
              onChange={setSearchFrom}
              placeholder="Origin Port"
            />
            <CustomSelect 
              label="Final Destination"
              value={searchTo}
              options={destinationOptions}
              onChange={setSearchTo}
              placeholder="Arrival Port"
            />
            <CustomSelect 
              label="Journey Class"
              value={travelClass}
              options={[
                { value: TravelClass.ECONOMY, label: 'Standard Elite' },
                { value: TravelClass.BUSINESS, label: 'Executive Suite' },
                { value: TravelClass.FIRST, label: 'Sovereign First' },
              ]}
              onChange={(val) => setTravelClass(val as TravelClass)}
            />
            <LuxuryButton 
              onClick={() => setHasSearched(true)}
              className="w-full h-[62px]"
            >
              Check Availability
            </LuxuryButton>
          </div>
        </section>

        {hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
            {filteredFlights.map(f => (
              <div key={f.id} className="glass-card p-10 rounded-[2.5rem] flex flex-col h-[480px] group transition-all duration-500 hover:border-gold-400/40 hover:-translate-y-4">
                <div className="flex justify-between items-start mb-10">
                  <span className="text-[10px] text-gold-400 font-bold tracking-[0.5em] uppercase">{f.flightNumber}</span>
                  <div className="text-right">
                    <p className="text-4xl font-serif text-white gold-gradient">${(f.basePrice * CLASS_MULTIPLIERS[travelClass]).toLocaleString()}</p>
                    <p className="text-[8px] text-white/30 uppercase tracking-[0.4em] mt-2">Inclusive Charge</p>
                  </div>
                </div>

                <div className="flex-grow space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-serif text-white">{f.departureCity.split('(')[0]}</p>
                      <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">Departure</p>
                    </div>
                    <div className="w-12 h-px bg-gold-400/30"></div>
                    <div className="text-right">
                      <p className="text-2xl font-serif text-white">{f.destinationCity.split('(')[0]}</p>
                      <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">Arrival</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                    <div>
                      <p className="text-[8px] text-white/20 uppercase tracking-[0.2em] mb-1">Duration</p>
                      <p className="text-xs text-white/80 font-medium">{f.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-white/20 uppercase tracking-[0.2em] mb-1">Date</p>
                      <p className="text-xs text-white/80 font-medium">{f.departureDate}</p>
                    </div>
                  </div>
                </div>

                <LuxuryButton 
                  onClick={() => handleFlightSelect(f)}
                  className="w-full mt-10"
                >
                  Confirm Reservation
                </LuxuryButton>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
        <div className="flex items-center justify-between">
          <button onClick={() => setStep(1)} className="text-white/30 hover:text-gold-400 transition-colors uppercase text-[9px] font-bold tracking-[0.5em]">
            ← Return to Hangar
          </button>
          <h3 className="text-xl font-serif text-white italic">Seat <span className="text-gold-400 not-italic">Configuration</span></h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <SeatPicker 
              selectedClass={travelClass} 
              passengerCount={totalPassengerCount}
              selectedSeats={selectedSeats}
              onSeatToggle={(id) => setSelectedSeats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
            />
          </div>
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-card p-10 rounded-[2.5rem] border border-gold-400/20">
              <h4 className="text-gold-400 uppercase tracking-[0.3em] text-[10px] font-bold mb-8 border-b border-white/5 pb-4">Manifest Info</h4>
              <div className="space-y-8">
                {['Adults', 'Children', 'Infants'].map(type => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-widest text-white/60">{type}</span>
                    <div className="flex items-center space-x-6">
                      <button 
                        onClick={() => setPassengerCount(p => ({...p, [type.toLowerCase()]: Math.max(type === 'Adults' ? 1 : 0, p[type.toLowerCase() as keyof typeof passengerCount] - 1)}))}
                        className="w-8 h-8 rounded-full border border-white/10 hover:border-gold-400 transition-colors"
                      > − </button>
                      <span className="font-serif text-lg">{passengerCount[type.toLowerCase() as keyof typeof passengerCount]}</span>
                      <button 
                        onClick={() => setPassengerCount(p => ({...p, [type.toLowerCase()]: p[type.toLowerCase() as keyof typeof passengerCount] + 1}))}
                        className="w-8 h-8 rounded-full border border-white/10 hover:border-gold-400 transition-colors"
                      > + </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <LuxuryButton 
              disabled={selectedSeats.length !== totalPassengerCount}
              onClick={() => setStep(3)}
              className="w-full"
            >
              Finalize Details
            </LuxuryButton>
          </div>
        </div>
      </div>
    );
  }

  return <div>Step {step} placeholder</div>;
};
