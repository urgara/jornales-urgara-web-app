import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils';
import { workerAssignmentService } from '../-services';

interface CloseWorkerAssignmentParams {
  id: string;
  localityId: string;
}

export function useMutationCloseWorkerAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, localityId }: CloseWorkerAssignmentParams) =>
      workerAssignmentService.updateWorkerAssignment(id, { isClosed: true, localityId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKER_ASSIGNMENTS] });
      notifications.show({
        title: 'Éxito',
        message: 'Asignación cerrada correctamente',
        color: 'green',
      });
    },
  });
}
