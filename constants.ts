
import { Aircraft, Flight, TravelClass, ExtraService } from './types';

export const AIRCRAFTS: Aircraft[] = [
  { id: 'A1', model: 'A380-800', manufacturer: 'Airbus', capacity: 525 },
  { id: 'A2', model: '787-9 Dreamliner', manufacturer: 'Boeing', capacity: 296 },
  { id: 'A3', model: 'A350-1000', manufacturer: 'Airbus', capacity: 366 },
];

export const CITIES = [
  'London (LHR)', 'New York (JFK)', 'Dubai (DXB)', 'Singapore (SIN)', 
  'Tokyo (HND)', 'Paris (CDG)', 'Sydney (SYD)', 'Los Angeles (LAX)',
  'Hong Kong (HKG)', 'Frankfurt (FRA)'
];

export const INITIAL_FLIGHTS: Flight[] = [
  {
    id: 'F1',
    flightNumber: 'AU101',
    departureCity: 'London (LHR)',
    destinationCity: 'New York (JFK)',
    departureDate: '2024-10-25',
    aircraftId: 'A1',
    basePrice: 850,
    duration: '7h 45m',
    isDirect: true,
    seatsAvailable: 450
  },
  {
    id: 'F2',
    flightNumber: 'AU202',
    departureCity: 'Dubai (DXB)',
    destinationCity: 'Singapore (SIN)',
    departureDate: '2024-10-26',
    aircraftId: 'A2',
    basePrice: 1200,
    duration: '7h 15m',
    isDirect: true,
    seatsAvailable: 280
  },
  {
    id: 'F3',
    flightNumber: 'AU303',
    departureCity: 'Tokyo (HND)',
    destinationCity: 'Sydney (SYD)',
    departureDate: '2024-10-27',
    aircraftId: 'A3',
    basePrice: 1500,
    duration: '9h 30m',
    isDirect: false,
    transitCities: ['Singapore (SIN)'],
    seatsAvailable: 340
  }
];

export const EXTRAS: ExtraService[] = [
  { id: 'E1', name: 'Premium Meal', price: 45, description: 'Gourmet 3-course dinner with fine wine.' },
  { id: 'E2', name: 'High-Speed Wi-Fi', price: 25, description: 'Unlimited streaming during flight.' },
  { id: 'E3', name: 'Priority Boarding', price: 30, description: 'Skip the queues and board first.' },
  { id: 'E4', name: 'Travel Insurance', price: 60, description: 'Full coverage for cancellations and health.' },
  { id: 'E5', name: 'Extra Baggage (+23kg)', price: 75, description: 'One additional piece of checked luggage.' }
];

export const CLASS_MULTIPLIERS = {
  [TravelClass.ECONOMY]: 1,
  [TravelClass.BUSINESS]: 2.5,
  [TravelClass.FIRST]: 5
};
