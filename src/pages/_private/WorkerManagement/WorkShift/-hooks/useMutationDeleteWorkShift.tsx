import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/query-keys';
import { deleteWorkShift } from '../-services';

export const useMutationDeleteWorkShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWorkShift(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK_SHIFTS] });
      notifications.show({
        title: 'Éxito',
        message: 'Turno eliminado correctamente',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Hubo un error al eliminar el turno',
        color: 'red',
      });
    },
  });
};
