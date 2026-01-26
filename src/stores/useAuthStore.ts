import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Admin, AuthContext } from '@/models';

interface AuthState extends AuthContext {
  login: (isAuth: boolean) => void;
  setAdmin: (data: Admin) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuth: false,
      admin: null,
      login: (isAuth) => set({ isAuth }),
      setAdmin: (admin) => set({ admin }),
      logout: () => set({ isAuth: false, admin: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ isAuth: state.isAuth }), // Solo persistir el token
    }
  )
);
