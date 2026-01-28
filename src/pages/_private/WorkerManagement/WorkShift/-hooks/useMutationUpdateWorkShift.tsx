import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { QUERY_KEYS } from '@/utils/query-keys';
import type { UpdateWorkShiftRequest } from '../-models';
import { updateWorkShift } from '../-services';

export const useMutationUpdateWorkShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, workShift }: { id: string; workShift: UpdateWorkShiftRequest }) =>
      updateWorkShift(id, workShift),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK_SHIFTS] });
      notifications.show({
        title: 'Éxito',
        message: 'Turno actualizado correctamente',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Hubo un error al actualizar el turno',
        color: 'red',
      });
    },
  });
};
