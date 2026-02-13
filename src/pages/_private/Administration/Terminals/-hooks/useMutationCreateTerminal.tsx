import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores';
import type { CreateTerminalRequest } from '../-models';
import { createTerminal } from '../-services';

export function useMutationCreateTerminal() {
  const queryClient = useQueryClient();
  const admin = useAuthStore((state) => state.admin);

  return useMutation({
    mutationFn: (data: CreateTerminalRequest) =>
      createTerminal({ ...data, localityId: admin?.localityId ?? undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terminals'] });
      notifications.show({
        title: 'Terminal creado',
        message: 'El terminal ha sido creado exitosamente',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Hubo un error al crear el terminal',
        color: 'red',
      });
    },
  });
}
