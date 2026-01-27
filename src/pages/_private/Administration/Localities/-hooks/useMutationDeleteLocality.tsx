import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils';
import { deleteLocalityService } from '../-services';

export const useMutationDeleteLocality = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLocalityService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOCALITIES] });
      notifications.show({
        title: 'Éxito',
        message: 'Localidad eliminada correctamente',
        color: 'green',
      });
    },
  });
};
