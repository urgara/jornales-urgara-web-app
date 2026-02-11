import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils';
import type { UpdateWorkerAssignmentRequest } from '../-models';
import { workerAssignmentService } from '../-services';

interface UpdateWorkerAssignmentParams {
  id: string;
  data: UpdateWorkerAssignmentRequest;
}

export function useMutationUpdateWorkerAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateWorkerAssignmentParams) =>
      workerAssignmentService.updateWorkerAssignment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKER_ASSIGNMENTS] });
      notifications.show({
        title: 'Éxito',
        message: 'Asignación actualizada correctamente',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'No se pudo actualizar la asignación',
        color: 'red',
      });
    },
  });
}
