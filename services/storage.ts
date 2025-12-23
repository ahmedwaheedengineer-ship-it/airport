
import { User, Flight, Booking, Aircraft } from '../types';
import { INITIAL_FLIGHTS, AIRCRAFTS } from '../constants';

const KEYS = {
  USERS: 'aura_users',
  CURRENT_USER: 'aura_current_user',
  FLIGHTS: 'aura_flights',
  BOOKINGS: 'aura_bookings',
  AIRCRAFTS: 'aura_aircrafts'
};

export const StorageService = {
  init: () => {
    if (!localStorage.getItem(KEYS.FLIGHTS)) {
      localStorage.setItem(KEYS.FLIGHTS, JSON.stringify(INITIAL_FLIGHTS));
    }
    if (!localStorage.getItem(KEYS.AIRCRAFTS)) {
      localStorage.setItem(KEYS.AIRCRAFTS, JSON.stringify(AIRCRAFTS));
    }
    if (!localStorage.getItem(KEYS.USERS)) {
      // Default admin
      localStorage.setItem(KEYS.USERS, JSON.stringify([{
        id: 'admin1',
        email: 'admin@aura.com',
        password: 'admin',
        name: 'Aura Admin',
        role: 'admin'
      }]));
    }
    if (!localStorage.getItem(KEYS.BOOKINGS)) {
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify([]));
    }
  },

  getUsers: (): User[] => JSON.parse(localStorage.getItem(KEYS.USERS) || '[]'),
  
  saveUser: (user: User) => {
    const users = StorageService.getUsers();
    users.push(user);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    else localStorage.removeItem(KEYS.CURRENT_USER);
  },

  getFlights: (): Flight[] => JSON.parse(localStorage.getItem(KEYS.FLIGHTS) || '[]'),
  
  updateFlights: (flights: Flight[]) => {
    localStorage.setItem(KEYS.FLIGHTS, JSON.stringify(flights));
  },

  getBookings: (): Booking[] => JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || '[]'),
  
  saveBooking: (booking: Booking) => {
    const bookings = StorageService.getBookings();
    bookings.push(booking);
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  cancelBooking: (bookingId: string) => {
    const bookings = StorageService.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings[index].status = 'Cancelled';
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
    }
  },

  getAircrafts: (): Aircraft[] => JSON.parse(localStorage.getItem(KEYS.AIRCRAFTS) || '[]')
};
