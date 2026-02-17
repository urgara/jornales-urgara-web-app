import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/query-keys';
import type { UpdateShipRequest } from '../-models';
import { updateShip } from '../-services';

export const useMutationUpdateShip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShipRequest }) =>
      updateShip(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SHIPS] });
      notifications.show({
        title: 'Éxito',
        message: 'Barco actualizado correctamente',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'No se pudo actualizar el barco',
        color: 'red',
      });
    },
  });
};
