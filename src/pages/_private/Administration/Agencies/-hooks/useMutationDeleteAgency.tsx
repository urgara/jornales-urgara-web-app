import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/query-keys';
import { deleteAgency } from '../-services';

export const useMutationDeleteAgency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAgency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AGENCIES] });
      notifications.show({
        title: 'Éxito',
        message: 'Agencia eliminada correctamente',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'No se pudo eliminar la agencia',
        color: 'red',
      });
    },
  });
};
