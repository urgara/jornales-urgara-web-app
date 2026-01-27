import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/query-keys';
import type { CreateAdminRequest } from '../-models';
import { createAdmin } from '../-services';

export const useMutationCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminRequest) => createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
      notifications.show({
        title: 'Éxito',
        message: 'Administrador creado correctamente',
        color: 'green',
      });
    },
  });
};
