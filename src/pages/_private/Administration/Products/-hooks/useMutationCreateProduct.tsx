import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { QUERY_KEYS } from '@/utils';
import { createProduct } from '../-services';

export const useMutationCreateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
			notifications.show({
				title: 'Éxito',
				message: 'Producto creado correctamente',
				color: 'green',
			});
		},
		onError: () => {
			notifications.show({
				title: 'Error',
				message: 'No se pudo crear el producto',
				color: 'red',
			});
		},
	});
};
