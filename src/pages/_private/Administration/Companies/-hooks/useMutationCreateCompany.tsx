import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/query-keys';
import type { CreateCompanyRequest } from '../-models';
import { createCompany } from '../-services';

export const useMutationCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (company: CreateCompanyRequest) => createCompany(company),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANIES] });
      notifications.show({
        title: 'Éxito',
        message: 'Empresa creada correctamente',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Hubo un error al crear la empresa',
        color: 'red',
      });
    },
  });
};
