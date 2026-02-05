import { queryOptions } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { QUERY } from '@/config';
import { chekAdminService } from '@/services/chek-admin.service';
import { useAuthStore } from '@/stores';

// Query options para obtener datos del admin
export const adminQueryOptions = queryOptions({
  queryKey: ['admin'],
  queryFn: chekAdminService,
  staleTime: 5 * 60 * 1000, // 5 minutos
  retry: false, // No reintentar en caso de error de auth
});

export const Route = createFileRoute('/_private')({
  beforeLoad: async ({ context }) => {
    // Primera verificación: está autenticado?
    if (!context.isAuth) {
      throw redirect({ to: '/Login' });
    }

    // Segunda verificación: fetch admin solo si no hay datos en el store
    const currentAdmin = useAuthStore.getState().admin;

    if (!currentAdmin) {
      try {
        const adminData = await QUERY.ensureQueryData(adminQueryOptions);

        if (!adminData?.data) {
          useAuthStore.getState().logout();
          throw redirect({ to: '/Login' });
        }

        // Actualizar el store con los datos del admin
        useAuthStore.getState().setAdmin(adminData.data);
      } catch {
        useAuthStore.getState().logout();
        throw redirect({ to: '/Login' });
      }
    }
  },
});
