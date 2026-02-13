import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores';
import { QUERY_KEYS } from '@/utils/query-keys';
import { deleteWorkShift } from '../-services';

export const useMutationDeleteWorkShift = () => {
  const queryClient = useQueryClient();
  const admin = useAuthStore((state) => state.admin);

  return useMutation({
    mutationFn: (id: string) => deleteWorkShift(id, admin?.localityId ?? undefined),
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
