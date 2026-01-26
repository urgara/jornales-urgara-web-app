import type { NotificationData } from '@mantine/notifications';
import type { ErrorType } from '@/models';

declare module 'axios' {
  interface AxiosRequestConfig {
    customNotifications?: Partial<
      Record<ErrorType, string | Partial<Omit<NotificationData, 'color'>>>
    >;
  }
}
