import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { QUERY_KEYS } from '@/utils';
import type { CreateWorkerAssignmentRequest } from '../-models';
import { workerAssignmentService } from '../-services';

export function useMutationCreateWorkerAssignment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (workerAssignment: CreateWorkerAssignmentRequest) =>
			workerAssignmentService.createWorkerAssignment(workerAssignment),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKER_ASSIGNMENTS] });
			notifications.show({
				title: 'Éxito',
				message: 'Asignación creada correctamente',
				color: 'green',
			});
		},
		onError: () => {
			notifications.show({
				title: 'Error',
				message: 'No se pudo crear la asignación',
				color: 'red',
			});
		},
	});
}
