import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { QUERY_KEYS } from '@/utils/query-keys';
import type { UpdateCompanyRequest } from '../-models';
import { updateCompany } from '../-services';

export const useMutationUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, company }: { id: string; company: UpdateCompanyRequest }) =>
      updateCompany(id, company),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANIES] });
      notifications.show({
        title: 'Éxito',
        message: 'Empresa actualizada correctamente',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Hubo un error al actualizar la empresa',
        color: 'red',
      });
    },
  });
};
