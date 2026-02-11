import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores';
import { QUERY_KEYS } from '@/utils/query-keys';
import type { CreateWorkShiftBaseValueRequest } from '../-models';
import { createBaseValue } from '../-services';

export const useMutationCreateBaseValue = () => {
  const queryClient = useQueryClient();
  const admin = useAuthStore((store) => store.admin);

  return useMutation({
    mutationFn: (baseValue: CreateWorkShiftBaseValueRequest) =>
      createBaseValue({ ...baseValue, localityId: admin?.localityId ?? undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK_SHIFT_BASE_VALUES] });
      notifications.show({
        title: 'Éxito',
        message: 'Valor base creado correctamente',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Hubo un error al crear el valor base',
        color: 'red',
      });
    },
  });
};
