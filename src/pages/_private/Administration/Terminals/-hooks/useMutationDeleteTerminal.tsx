import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useAuthStore } from '@/stores';
import { deleteTerminal } from '../-services';

export function useMutationDeleteTerminal() {
	const queryClient = useQueryClient();
	const admin = useAuthStore((state) => state.admin);

	return useMutation({
		mutationFn: ({ id, localityId }: { id: string; localityId?: string }) => {
			// Solo pasar localityId si el admin no tiene localidad (ADMIN sin localidad)
			const localityIdToSend = !admin?.localityId && localityId ? localityId : undefined;
			return deleteTerminal(id, localityIdToSend);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['terminals'] });
			notifications.show({
				title: 'Terminal eliminado',
				message: 'El terminal ha sido eliminado exitosamente',
				color: 'green',
			});
		},
		onError: () => {
			notifications.show({
				title: 'Error',
				message: 'Hubo un error al eliminar el terminal',
				color: 'red',
			});
		},
	});
}
