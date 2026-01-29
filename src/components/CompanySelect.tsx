import { Select, type SelectProps } from '@mantine/core';
import { useMemo } from 'react';
import { useQuerySelectCompanies } from '@/hooks';

type CompanySelectProps = Omit<SelectProps, 'data'>;

export const CompanySelect = ({ placeholder, disabled, ...props }: CompanySelectProps) => {
	const { data, isLoading } = useQuerySelectCompanies();

	const companyOptions = useMemo(() => {
		if (!data?.data) return [];

		return data.data.map((company) => ({
			value: company.id.toString(),
			label: company.name,
		}));
	}, [data?.data]);

	return (
		<Select
			placeholder={isLoading ? 'Cargando empresas...' : placeholder || 'Selecciona una empresa'}
			data={companyOptions}
			searchable
			disabled={isLoading || disabled}
			{...props}
		/>
	);
};
