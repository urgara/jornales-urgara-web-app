import { DYNNAMIX_API } from '@/config';
import type { ChangePasswordRequest } from '@/models';

export async function changePasswordService(data: ChangePasswordRequest) {
  await DYNNAMIX_API.post('auth/change-password', data, {
    customNotifications: {
      UNAUTHORIZED: 'La contraseña actual es incorrecta',
    },
  });
}
