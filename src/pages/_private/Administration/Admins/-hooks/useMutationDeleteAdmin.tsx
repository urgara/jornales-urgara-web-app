import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/query-keys';
import { deleteAdmin } from '../-services';

export const useMutationDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
      notifications.show({
        title: 'Éxito',
        message: 'Administrador eliminado correctamente',
        color: 'green',
      });
    },
  });
};
