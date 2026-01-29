import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { QUERY_KEYS } from '@/utils';
import type { ListWorkersResponse, UpdateWorkerRequest } from '../-models';
import { workerService } from '../-services';

export function useMutationUpdateWorker() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateWorkerRequest }) =>
			workerService.updateWorker(id, data),
		onMutate: async ({ id, data }) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.WORKERS] });

			// Actualizar optimisticamente en todos los caches de WORKERS
			queryClient.getQueryCache().getAll().forEach((query) => {
				if (Array.isArray(query.queryKey) && query.queryKey[0] === QUERY_KEYS.WORKERS) {
					queryClient.setQueryData<ListWorkersResponse>(query.queryKey, (oldData) => {
						if (!oldData?.data) return oldData;
						return {
							...oldData,
							data: oldData.data.map((worker) =>
								worker.id === id ? { ...worker, ...data } : worker
							),
						};
					});
				}
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKERS] });
			notifications.show({
				title: 'Éxito',
				message: 'Trabajador actualizado correctamente',
				color: 'green',
			});
		},
		onError: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKERS] });
			notifications.show({
				title: 'Error',
				message: 'No se pudo actualizar el trabajador',
				color: 'red',
			});
		},
	});
}
