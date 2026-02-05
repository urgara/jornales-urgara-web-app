import { Select, type SelectProps } from '@mantine/core';
import { useQuerySelectProducts } from '@/hooks';

type ProductSelectProps = Omit<SelectProps, 'data'>;

export function ProductSelect(props: ProductSelectProps) {
	const { products, isLoading } = useQuerySelectProducts();

	const data = products.map((product) => ({
		value: product.id,
		label: product.name,
	}));

	return <Select {...props} data={data} disabled={isLoading || props.disabled} />;
}
