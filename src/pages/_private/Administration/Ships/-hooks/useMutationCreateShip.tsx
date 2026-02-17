import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils';
import { createShip } from '../-services';

export const useMutationCreateShip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SHIPS] });
      notifications.show({
        title: 'Éxito',
        message: 'Barco creado correctamente',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'No se pudo crear el barco',
        color: 'red',
      });
    },
  });
};
