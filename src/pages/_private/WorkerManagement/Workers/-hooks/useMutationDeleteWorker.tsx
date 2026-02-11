import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils';
import { workerService } from '../-services';

export function useMutationDeleteWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workerService.deleteWorker(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKERS] });
      notifications.show({
        title: 'Éxito',
        message: 'Trabajador eliminado correctamente',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'No se pudo eliminar el trabajador',
        color: 'red',
      });
    },
  });
}
