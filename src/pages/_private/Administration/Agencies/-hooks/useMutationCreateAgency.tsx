import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { QUERY_KEYS } from '@/utils';
import { createAgency } from '../-services';

export const useMutationCreateAgency = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createAgency,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AGENCIES] });
			notifications.show({
				title: 'Éxito',
				message: 'Agencia creada correctamente',
				color: 'green',
			});
		},
		onError: () => {
			notifications.show({
				title: 'Error',
				message: 'No se pudo crear la agencia',
				color: 'red',
			});
		},
	});
};
