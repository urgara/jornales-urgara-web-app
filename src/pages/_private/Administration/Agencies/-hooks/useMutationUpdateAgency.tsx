import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { QUERY_KEYS } from '@/utils/query-keys';
import type { UpdateAgencyRequest } from '../-models';
import { updateAgency } from '../-services';

export const useMutationUpdateAgency = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateAgencyRequest }) => updateAgency(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AGENCIES] });
			notifications.show({
				title: 'Éxito',
				message: 'Agencia actualizada correctamente',
				color: 'green',
			});
		},
		onError: () => {
			notifications.show({
				title: 'Error',
				message: 'No se pudo actualizar la agencia',
				color: 'red',
			});
		},
	});
};
