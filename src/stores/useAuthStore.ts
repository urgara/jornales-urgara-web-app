import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QUERY } from '@/config';
import type { Admin, AuthContext } from '@/models';

interface AuthState extends AuthContext {
  login: (isAuth: boolean) => void;
  setAdmin: (data: Admin) => void;
  updateAdminLocality: (localityId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuth: false,
      admin: null,
      login: (isAuth) => set({ isAuth }),
      setAdmin: (admin) => set({ admin }),
      updateAdminLocality: (localityId) =>
        set((state) => ({
          admin: state.admin ? { ...state.admin, localityId } : null,
        })),
      logout: () => {
        set({ isAuth: false, admin: null });
        QUERY.clear();
        sessionStorage.clear();
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ isAuth: state.isAuth }), // Solo persistir el token
    }
  )
);
