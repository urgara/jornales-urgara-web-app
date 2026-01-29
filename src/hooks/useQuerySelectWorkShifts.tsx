import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getSelectWorkShiftsService } from '@/services';
import { QUERY_KEYS } from '@/utils';

const DAY_LABELS: Record<string, string> = {
	M: 'Lun',
	T: 'Mar',
	W: 'Mié',
	Th: 'Jue',
	F: 'Vie',
	S: 'Sáb',
	Su: 'Dom',
};

export const useQuerySelectWorkShifts = () => {
	const query = useQuery({
		queryKey: [QUERY_KEYS.WORK_SHIFTS, 'select'],
		queryFn: () => getSelectWorkShiftsService(),
		staleTime: 60 * 60 * 1000, // 60 minutos
		gcTime: 120 * 60 * 1000, // 120 minutos
	});

	const getWorkShiftDescription = useCallback(
		(id: string) => {
			const workShift = query.data?.data?.find((ws) => ws.id === id);
			if (!workShift) return `Turno ${id}`;

			// Extraer HH:mm del formato ISO "2000-01-01T08:00:00.000Z"
			// Si viene solo la hora (ej: "08:00:00"), tomar los primeros 5 caracteres
			const startTime = workShift.startTime.includes('T')
				? workShift.startTime.split('T')[1].slice(0, 5)
				: workShift.startTime.slice(0, 5);
			const endTime = workShift.endTime.includes('T')
				? workShift.endTime.split('T')[1].slice(0, 5)
				: workShift.endTime.slice(0, 5);

			let label = '';

			// Si tiene descripción, usarla; si no, mostrar los días
			if (workShift.description) {
				label = workShift.description;
			} else if (workShift.days && workShift.days.length > 0) {
				const daysLabels = workShift.days.map((day) => DAY_LABELS[day] || day).join(', ');
				label = daysLabels;
			} else {
				label = 'Turno';
			}

			// Agregar rango horario
			label += ` - ${startTime} a ${endTime}`;

			return label;
		},
		[query.data?.data]
	);

	return {
		...query,
		getWorkShiftDescription,
	};
};
