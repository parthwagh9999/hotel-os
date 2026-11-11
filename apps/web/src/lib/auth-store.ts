import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from './api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string | null;
  phone?: string | null;
  hotels?: Array<{
    id: string;
    name: string;
    slug: string;
    status: string;
    memberRole: string;
  }>;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  activeHotelId: string | null;
  setAuth: (user: User, token: string) => void;
  setActiveHotelId: (hotelId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      activeHotelId: null,

      setAuth: (user: User, token: string) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('hotel_os_token', token);
        }
        const activeHotelId =
          user.hotels && user.hotels.length > 0 ? user.hotels[0].id : null;
        set({ user, token, isAuthenticated: true, activeHotelId });
      },

      setActiveHotelId: (hotelId: string) => {
        set({ activeHotelId: hotelId });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('hotel_os_token');
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          activeHotelId: null,
        });
      },
    }),
    {
      name: 'hotel-os-auth',
    }
  )
);

