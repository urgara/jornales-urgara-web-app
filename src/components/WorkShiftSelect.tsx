import { Select, type SelectProps } from '@mantine/core';
import { useMemo } from 'react';
import { useQuerySelectWorkShifts } from '@/hooks';

type WorkShiftSelectProps = Omit<SelectProps, 'data'>;

const DAY_LABELS: Record<string, string> = {
	M: 'Lun',
	T: 'Mar',
	W: 'Mié',
	Th: 'Jue',
	F: 'Vie',
	S: 'Sáb',
	Su: 'Dom',
};

export const WorkShiftSelect = ({ placeholder, disabled, ...props }: WorkShiftSelectProps) => {
	const { data, isLoading } = useQuerySelectWorkShifts();

	const workShiftOptions = useMemo(() => {
		if (!data?.data) return [];

		return data.data.map((shift) => {
			// Extraer HH:mm del formato ISO "2000-01-01T08:00:00.000Z"
			// Si viene solo la hora (ej: "08:00:00"), tomar los primeros 5 caracteres
			const startTime = shift.startTime.includes('T')
				? shift.startTime.split('T')[1].slice(0, 5)
				: shift.startTime.slice(0, 5);
			const endTime = shift.endTime.includes('T')
				? shift.endTime.split('T')[1].slice(0, 5)
				: shift.endTime.slice(0, 5);

			let label = '';

			// Si tiene descripción, usarla; si no, mostrar los días
			if (shift.description) {
				label = shift.description;
			} else if (shift.days && shift.days.length > 0) {
				const daysLabels = shift.days.map((day) => DAY_LABELS[day] || day).join(', ');
				label = daysLabels;
			} else {
				label = 'Turno';
			}

			// Agregar rango horario
			label += ` - ${startTime} a ${endTime}`;

			return {
				value: shift.id,
				label,
			};
		});
	}, [data?.data]);

	return (
		<Select
			placeholder={isLoading ? 'Cargando turnos...' : placeholder || 'Selecciona un turno'}
			data={workShiftOptions}
			searchable
			disabled={isLoading || disabled}
			{...props}
		/>
	);
};
