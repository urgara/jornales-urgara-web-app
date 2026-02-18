import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QUERY } from '@/config';
import type { Admin, AuthContext, SelectLocality } from '@/models';

interface AuthState extends AuthContext {
  login: (isAuth: boolean) => void;
  setAdmin: (data: Admin) => void;
  updateAdminLocality: (localityId: string, locality?: SelectLocality) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuth: false,
      admin: null,
      login: (isAuth) => set({ isAuth }),
      setAdmin: (admin) => set({ admin }),
      updateAdminLocality: (localityId, locality) =>
        set((state) => {
          if (!state.admin) return { admin: null };
          if (!locality) return { admin: { ...state.admin, localityId } };
          return {
            admin: {
              ...state.admin,
              localityId,
              Locality: {
                id: locality.id,
                name: locality.name,
                isCalculateJc: locality.isCalculateJc,
                province: state.admin.Locality?.province ?? '',
                createdAt: state.admin.Locality?.createdAt ?? '',
                deletedAt: state.admin.Locality?.deletedAt,
              },
            },
          };
        }),
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
