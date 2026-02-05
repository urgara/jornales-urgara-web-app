import { notifications } from '@mantine/notifications';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { ZodError } from 'zod';

// Los errores de API ya los maneja el interceptor
function showNotifications(error: Error, context?: { service: string; key?: unknown }) {
  if (error instanceof ZodError) {
    console.error('Validation Error:', {
      service: context?.service,
      key: context?.key,
      error: error.message,
      issues: error.issues,
    });
    notifications.show({
      title: 'Error de Validación de Datos',
      message:
        'Los datos recibidos del servidor no tienen el formato esperado. Por favor contacte a los desarrolladores.',
      color: 'orange',
    });
  } else if (!('response' in error)) {
    // Errores de sistema/red/código (no-API, no-Zod)
    console.error('System Error:', {
      service: context?.service,
      key: context?.key,
      error: error.message,
      stack: error.stack,
    });
    notifications.show({
      title: 'Error Interno de la aplicacion web',
      message: 'Vuelva a intentarlo mas tarde o contacte a los desarrolladores.',
      color: 'red',
    });
  }
}

const QUERY = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, _query) => {
      showNotifications(error);
    },
  }),

  mutationCache: new MutationCache({
    onError: (error) => {
      showNotifications(error);
    },
  }),

  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)
      networkMode: 'online',
    },
    mutations: {
      retry: false,
      networkMode: 'online',
    },
  },
});

export { QUERY };
