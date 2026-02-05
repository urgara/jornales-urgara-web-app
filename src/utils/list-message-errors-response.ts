import type { NotificationData } from '@mantine/notifications';
import { ErrorType } from '@/models';

export const LIST_MESSAGE_ERROR_NOTIFICATIONS: Record<ErrorType, NotificationData> = {
  [ErrorType.BAD_REQUEST]: {
    title: 'Solicitud Incorrecta',
    message: 'Los datos enviados no son válidos. Revisa la información e intenta nuevamente.',
    color: 'orange',
    autoClose: 5000,
  },

  [ErrorType.NOT_FOUND]: {
    title: 'Recurso No Encontrado',
    message: 'El elemento solicitado no existe o ha sido eliminado.',
    color: 'yellow',
    autoClose: 4000,
  },

  [ErrorType.UNAUTHORIZED]: {
    title: 'Acceso No Autorizado',
    message: 'Debes iniciar sesión para acceder a este recurso.',
    color: 'red',
    autoClose: 6000,
  },

  [ErrorType.FORBIDDEN]: {
    title: 'Sin Permisos',
    message: 'No tienes los permisos necesarios para realizar esta acción.',
    color: 'red',
    autoClose: 5000,
  },

  [ErrorType.DUPLICATE_ERROR]: {
    title: 'Elemento Duplicado',
    message: 'Ya existe un elemento con estos datos. Usa información diferente.',
    color: 'orange',
    autoClose: 5000,
  },

  [ErrorType.DATABASE_ERROR]: {
    title: 'Error de Base de Datos',
    message: 'Error interno del servidor. Contacta al administrador si persiste.',
    color: 'red',
    autoClose: 7000,
  },

  [ErrorType.RESOURCE_CONFLICT]: {
    title: 'Conflicto de Recurso',
    message: 'Este recurso está siendo modificado por otro usuario. Intenta nuevamente.',
    color: 'orange',
    autoClose: 6000,
  },

  [ErrorType.VALIDATION_ERROR]: {
    title: 'Error de Validación',
    message: 'Los datos proporcionados no cumplen con los requisitos necesarios.',
    color: 'orange',
    autoClose: 5000,
  },

  [ErrorType.INTERNAL_SERVER_ERROR]: {
    title: 'Error del Servidor',
    message: 'Ha ocurrido un error interno. Intenta nuevamente en unos minutos.',
    color: 'red',
    autoClose: 6000,
  },

  [ErrorType.SERVICE_UNAVAILABLE]: {
    title: 'Servicio No Disponible',
    message: 'El servicio está temporalmente no disponible. Intenta más tarde.',
    color: 'grape',
    autoClose: 7000,
  },

  [ErrorType.TOKEN_EXPIRED]: {
    title: 'Sesión Expirada',
    message: 'Tu sesión ha expirado. Serás redirigido al inicio de sesión.',
    color: 'red',
    autoClose: 8000,
  },

  [ErrorType.SECURITY_ALERT]: {
    title: 'Alerta de Seguridad',
    message: 'Se ha detectado actividad sospechosa. Tu cuenta ha sido protegida temporalmente.',
    color: 'red',
    autoClose: 8000,
  },

  [ErrorType.LOCALITY_ID_REQUIRED]: {
    title: 'Localidad Requerida',
    message: 'Debes especificar una localidad para acceder a este recurso.',
    color: 'orange',
    autoClose: 5000,
  },
};
