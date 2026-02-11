import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/query-keys';
import type { UpdateProductRequest } from '../-models';
import { updateProduct } from '../-services';

export const useMutationUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      notifications.show({
        title: 'Éxito',
        message: 'Producto actualizado correctamente',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'No se pudo actualizar el producto',
        color: 'red',
      });
    },
  });
};
