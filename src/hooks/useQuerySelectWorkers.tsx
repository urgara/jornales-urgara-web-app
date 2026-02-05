import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getSelectWorkersService } from '@/services';
import { useAuthStore } from '@/stores';
import { QUERY_KEYS } from '@/utils';

export const useQuerySelectWorkers = () => {
	const admin = useAuthStore((store) => store.admin);

	const query = useQuery({
		queryKey: [QUERY_KEYS.WORKERS, 'select', admin?.localityId],
		queryFn: () =>
			getSelectWorkersService(admin?.localityId ? { localityId: admin.localityId } : undefined),
		staleTime: 60 * 60 * 1000, // 60 minutos
		gcTime: 120 * 60 * 1000, // 120 minutos
	});

	const getWorkerFullName = useCallback(
		(id: string) => {
			const worker = query.data?.data?.find((w) => w.id === id);
			return worker ? `${worker.surname}, ${worker.name}` : `Trabajador ${id}`;
		},
		[query.data?.data]
	);

	return {
		...query,
		getWorkerFullName,
	};
};
