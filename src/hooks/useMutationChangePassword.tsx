import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import type { ChangePasswordRequest } from '@/models';
import { changePasswordService } from '@/services';

export function useMutationChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePasswordService(data),
    onSuccess: () => {
      notifications.show({
        title: 'Éxito',
        message: 'Contraseña actualizada correctamente',
        color: 'green',
      });
    },
  });
}
