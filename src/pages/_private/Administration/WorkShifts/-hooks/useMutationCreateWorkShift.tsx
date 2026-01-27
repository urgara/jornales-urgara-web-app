import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { QUERY_KEYS } from '@/utils/query-keys';
import type { CreateWorkShiftRequest } from '../-models';
import { createWorkShift } from '../-services';

export const useMutationCreateWorkShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workShift: CreateWorkShiftRequest) => createWorkShift(workShift),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK_SHIFTS] });
      notifications.show({
        title: 'Éxito',
        message: 'Turno creado correctamente',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Hubo un error al crear el turno',
        color: 'red',
      });
    },
  });
};
