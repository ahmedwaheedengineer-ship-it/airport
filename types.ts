
export enum TravelClass {
  ECONOMY = 'Economy',
  BUSINESS = 'Business',
  FIRST = 'First Class'
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface Aircraft {
  id: string;
  model: string;
  manufacturer: string;
  capacity: number;
}

export interface Flight {
  id: string;
  flightNumber: string;
  departureCity: string;
  destinationCity: string;
  departureDate: string;
  returnDate?: string;
  aircraftId: string;
  basePrice: number;
  duration: string;
  isDirect: boolean;
  transitCities?: string[];
  seatsAvailable: number;
}

export interface Seat {
  id: string;
  row: number;
  col: string;
  type: 'Window' | 'Aisle' | 'Middle';
  class: TravelClass;
  isBooked: boolean;
  priceModifier: number;
}

export interface Passenger {
  fullName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  type: 'Adult' | 'Child' | 'Infant';
}

export interface ExtraService {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  passengers: Passenger[];
  selectedSeats: string[];
  extras: string[];
  totalPrice: number;
  status: 'Confirmed' | 'Cancelled';
  bookingDate: string;
  class: TravelClass;
}

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
}
