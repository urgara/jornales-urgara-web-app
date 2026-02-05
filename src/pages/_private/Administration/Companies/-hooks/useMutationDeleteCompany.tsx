import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { QUERY_KEYS } from '@/utils/query-keys';
import { deleteCompany } from '../-services';

export const useMutationDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANIES] });
      notifications.show({
        title: 'Éxito',
        message: 'Empresa eliminada correctamente',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Hubo un error al eliminar la empresa',
        color: 'red',
      });
    },
  });
};
