import { notifications as mantineNotifications } from '@mantine/notifications';
import type { AxiosError } from 'axios';
import { DYNNAMIX_API, router } from '@/config';
import type { ErrorResponse } from '@/models';
import { ErrorType } from '@/models';
// Import type declarations to ensure axios module augmentation is loaded
import type {} from '@/models/declarations.type';
import { useAuthStore } from '@/stores';
import { LIST_MESSAGE_ERROR_NOTIFICATIONS } from '@/utils';

// Limpiar interceptors existentes para prevenir duplicados durante hot reload
DYNNAMIX_API.interceptors.response.clear();

// Interceptor de respuesta para manejar errores globalmente
DYNNAMIX_API.interceptors.response.use(
  (response) => response,

  (error: AxiosError) => {
    if (error?.response?.data) {
      const errorData = error.response.data as ErrorResponse;
      const customNotifications = error.config?.customNotifications;
      const notifications = LIST_MESSAGE_ERROR_NOTIFICATIONS;

      // Validate error structure
      if (
        errorData &&
        typeof errorData === 'object' &&
        'name' in errorData &&
        'message' in errorData
      ) {
        if (customNotifications) {
          const keys = Object.keys(customNotifications) as ErrorType[];
          keys.forEach((key) => {
            if (typeof customNotifications[key] === 'string') {
              // Es solo un mensaje - actualizar solo el mensaje
              notifications[key] = {
                ...notifications[key],
                message: customNotifications[key] as string,
              };
            } else {
              // Es un objeto - hacer merge completo
              notifications[key] = { ...notifications[key], ...customNotifications[key] };
            }
          });
        }
        if (
          errorData.name === ErrorType.TOKEN_EXPIRED ||
          errorData.name === ErrorType.SECURITY_ALERT
        ) {
          useAuthStore.getState().logout();
          setTimeout(() => {
            router.navigate({ to: '/Login' });
          }, 1500);
        }

        // Mostrar la notificación
        const finalNotification = notifications[errorData.name];
        if (finalNotification) {
          mantineNotifications.show(finalNotification);
        } else {
          // Fallback si no existe notificación por defecto
          mantineNotifications.show({
            title: 'Error',
            message: errorData.message,
            color: 'red',
          });
        }
      } else {
        mantineNotifications.show({
          title: `Error del Servidor`,
          message: 'Ha ocurrido un error inesperado en el servidor',
          color: 'red',
        });
      }
    } else {
      // Error de red o sin respuesta del servidor
      mantineNotifications.show({
        title: 'Error de Conexión',
        message: error.message || 'No se pudo conectar con el servidor',
        color: 'red',
      });
    }

    return Promise.reject(error);
  }
);
