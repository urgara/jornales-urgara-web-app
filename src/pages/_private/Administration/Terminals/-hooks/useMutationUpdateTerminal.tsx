import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores';
import type { UpdateTerminalRequest } from '../-models';
import { updateTerminal } from '../-services';

export function useMutationUpdateTerminal() {
  const queryClient = useQueryClient();
  const admin = useAuthStore((state) => state.admin);

  return useMutation({
    mutationFn: ({
      id,
      data,
      localityId,
    }: {
      id: string;
      data: UpdateTerminalRequest;
      localityId?: string;
    }) => {
      // Solo pasar localityId si el admin no tiene localidad (ADMIN sin localidad)
      const localityIdToSend = !admin?.localityId && localityId ? localityId : undefined;
      return updateTerminal(id, data, localityIdToSend);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terminals'] });
      notifications.show({
        title: 'Terminal actualizado',
        message: 'El terminal ha sido actualizado exitosamente',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Hubo un error al actualizar el terminal',
        color: 'red',
      });
    },
  });
}
