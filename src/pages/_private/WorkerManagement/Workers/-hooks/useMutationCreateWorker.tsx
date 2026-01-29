import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { QUERY_KEYS } from '@/utils';
import type { CreateWorkerRequest } from '../-models';
import { workerService } from '../-services';

export function useMutationCreateWorker() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (worker: CreateWorkerRequest) => workerService.createWorker(worker),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKERS] });
			notifications.show({
				title: 'Éxito',
				message: 'Trabajador creado correctamente',
				color: 'green',
			});
		},
		onError: () => {
			notifications.show({
				title: 'Error',
				message: 'No se pudo crear el trabajador',
				color: 'red',
			});
		},
	});
}
