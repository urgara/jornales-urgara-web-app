import { notifications } from '@mantine/notifications';
import type { ErrorResponse, ValidationErrorResponse } from '@/models';
import { ErrorType } from '@/models';

export const useNotifications = () => {
  const showSuccess = (message: string, title?: string) => {
    notifications.show({
      title: title || 'Success',
      message,
      color: 'green',
    });
  };

  const showError = (error: unknown, title?: string) => {
    let message = 'An unexpected error occurred';
    const errorTitle = title || 'Error';

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    notifications.show({
      title: errorTitle,
      message,
      color: 'red',
    });
  };

  const showApiError = (errorData: ErrorResponse | ValidationErrorResponse) => {
    let message = errorData.message;
    let title = 'Error';

    // Handle validation errors specially
    if (errorData.name === ErrorType.VALIDATION_ERROR && 'errors' in errorData) {
      const validationErrors = Object.values(errorData.errors).flat();
      message = validationErrors.join(', ');
      title = 'Validation Error';
    }

    // Customize titles based on error type
    switch (errorData.name) {
      case ErrorType.UNAUTHORIZED:
        title = 'Authentication Required';
        break;
      case ErrorType.FORBIDDEN:
        title = 'Access Denied';
        break;
      case ErrorType.NOT_FOUND:
        title = 'Not Found';
        break;
      case ErrorType.TOKEN_EXPIRED:
        title = 'Session Expired';
        break;
      case ErrorType.SECURITY_ALERT:
        title = 'Security Alert';
        break;
      default:
        title = 'Error';
    }

    notifications.show({
      title,
      message,
      color: 'red',
    });
  };

  return {
    showSuccess,
    showError,
    showApiError,
  };
};
