
import { Aircraft, Flight, TravelClass, ExtraService } from './types';

export const AIRCRAFTS: Aircraft[] = [
  { id: 'A1', model: 'A380-800', manufacturer: 'Airbus', capacity: 525 },
  { id: 'A2', model: '787-9 Dreamliner', manufacturer: 'Boeing', capacity: 296 },
  { id: 'A3', model: 'A350-1000', manufacturer: 'Airbus', capacity: 366 },
];

export const CITIES = [
  'London (LHR)', 'New York (JFK)', 'Dubai (DXB)', 'Singapore (SIN)', 
  'Tokyo (HND)', 'Paris (CDG)', 'Sydney (SYD)', 'Los Angeles (LAX)',
  'Hong Kong (HKG)', 'Frankfurt (FRA)', 'Rome (FCO)', 'Istanbul (IST)'
];

export const INITIAL_FLIGHTS: Flight[] = [
  { id: 'F1', flightNumber: 'PR101', departureCity: 'London (LHR)', destinationCity: 'New York (JFK)', departureDate: '2024-11-15', aircraftId: 'A1', basePrice: 850, duration: '7h 45m', isDirect: true, seatsAvailable: 450 },
  { id: 'F2', flightNumber: 'PR202', departureCity: 'Dubai (DXB)', destinationCity: 'Singapore (SIN)', departureDate: '2024-11-16', aircraftId: 'A2', basePrice: 1200, duration: '7h 15m', isDirect: true, seatsAvailable: 280 },
  { id: 'F3', flightNumber: 'PR303', departureCity: 'Tokyo (HND)', destinationCity: 'Sydney (SYD)', departureDate: '2024-11-17', aircraftId: 'A3', basePrice: 1500, duration: '9h 30m', isDirect: false, transitCities: ['Singapore (SIN)'], seatsAvailable: 340 },
  { id: 'F4', flightNumber: 'PR404', departureCity: 'Paris (CDG)', destinationCity: 'Los Angeles (LAX)', departureDate: '2024-11-18', aircraftId: 'A1', basePrice: 1100, duration: '11h 20m', isDirect: true, seatsAvailable: 500 },
  { id: 'F5', flightNumber: 'PR505', departureCity: 'Frankfurt (FRA)', destinationCity: 'Hong Kong (HKG)', departureDate: '2024-11-19', aircraftId: 'A3', basePrice: 950, duration: '11h 45m', isDirect: true, seatsAvailable: 320 },
  { id: 'F6', flightNumber: 'PR606', departureCity: 'New York (JFK)', destinationCity: 'London (LHR)', departureDate: '2024-11-20', aircraftId: 'A2', basePrice: 780, duration: '6h 50m', isDirect: true, seatsAvailable: 290 },
  { id: 'F7', flightNumber: 'PR707', departureCity: 'Rome (FCO)', destinationCity: 'Tokyo (HND)', departureDate: '2024-11-21', aircraftId: 'A3', basePrice: 1350, duration: '13h 10m', isDirect: false, transitCities: ['Dubai (DXB)'], seatsAvailable: 310 },
  { id: 'F8', flightNumber: 'PR808', departureCity: 'Istanbul (IST)', destinationCity: 'Paris (CDG)', departureDate: '2024-11-22', aircraftId: 'A2', basePrice: 450, duration: '3h 45m', isDirect: true, seatsAvailable: 250 },
  { id: 'F9', flightNumber: 'PR909', departureCity: 'Sydney (SYD)', destinationCity: 'Singapore (SIN)', departureDate: '2024-11-23', aircraftId: 'A1', basePrice: 650, duration: '8h 20m', isDirect: true, seatsAvailable: 480 },
  { id: 'F10', flightNumber: 'PR010', departureCity: 'Singapore (SIN)', destinationCity: 'Dubai (DXB)', departureDate: '2024-11-24', aircraftId: 'A2', basePrice: 890, duration: '7h 40m', isDirect: true, seatsAvailable: 270 }
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
