import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils';
import { createLocalityService } from '../-services';

export const useMutationCreateLocality = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLocalityService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOCALITIES] });
      notifications.show({
        title: 'Éxito',
        message: 'Localidad creada correctamente',
        color: 'green',
      });
    },
  });
};
