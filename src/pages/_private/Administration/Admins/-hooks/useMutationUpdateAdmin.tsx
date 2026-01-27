import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/query-keys';
import type { UpdateAdminRequest } from '../-models';
import { updateAdmin } from '../-services';

export const useMutationUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdminRequest }) => updateAdmin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
      notifications.show({
        title: 'Éxito',
        message: 'Administrador actualizado correctamente',
        color: 'green',
      });
    },
  });
};
