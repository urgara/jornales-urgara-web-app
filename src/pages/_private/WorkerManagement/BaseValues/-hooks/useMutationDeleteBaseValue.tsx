import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores';
import { QUERY_KEYS } from '@/utils/query-keys';
import { deleteBaseValue } from '../-services';

export const useMutationDeleteBaseValue = () => {
  const queryClient = useQueryClient();
  const admin = useAuthStore((state) => state.admin);

  return useMutation({
    mutationFn: (id: string) => deleteBaseValue(id, admin?.localityId ?? undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK_SHIFT_BASE_VALUES] });
      notifications.show({
        title: 'Éxito',
        message: 'Valor base eliminado correctamente',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Hubo un error al eliminar el valor base',
        color: 'red',
      });
    },
  });
};
