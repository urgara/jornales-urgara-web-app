import { useQuery } from '@tanstack/react-query';
import { getSelectProducts } from '@/services';

export function useQuerySelectProducts() {
	const { data, isLoading, error } = useQuery({
		queryKey: ['products', 'select'],
		queryFn: getSelectProducts,
	});

	const getProductName = (productId: string) => {
		return data?.data.find((product) => product.id === productId)?.name ?? '';
	};

	return {
		products: data?.data ?? [],
		isLoading,
		error,
		getProductName,
	};
}
