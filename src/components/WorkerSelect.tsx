import { Select, type SelectProps } from '@mantine/core';
import { useMemo } from 'react';
import { useQuerySelectWorkers } from '@/hooks';

type WorkerSelectProps = Omit<SelectProps, 'data'>;

export const WorkerSelect = ({ placeholder, disabled, ...props }: WorkerSelectProps) => {
	const { data, isLoading } = useQuerySelectWorkers();

	const workerOptions = useMemo(() => {
		if (!data?.data) return [];

		return data.data.map((worker) => ({
			value: worker.id,
			label: `${worker.surname}, ${worker.name} - DNI: ${worker.dni}`,
		}));
	}, [data?.data]);

	return (
		<Select
			placeholder={
				isLoading ? 'Cargando trabajadores...' : placeholder || 'Selecciona un trabajador'
			}
			data={workerOptions}
			searchable
			disabled={isLoading || disabled}
			{...props}
		/>
	);
};
