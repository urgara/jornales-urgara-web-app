import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils';
import type { UpdateLocalityRequest } from '../-models';
import { updateLocalityService } from '../-services';

export const useMutationUpdateLocality = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLocalityRequest }) =>
      updateLocalityService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOCALITIES] });
      notifications.show({
        title: 'Éxito',
        message: 'Localidad actualizada correctamente',
        color: 'green',
      });
    },
  });
};
