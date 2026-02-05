import type {
	MRT_ColumnFiltersState,
	MRT_PaginationState,
	MRT_SortingState,
} from 'mantine-react-table';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useAuthStore } from '@/stores';
import type { TerminalsQueryParams, ListTerminalsResponse } from '../-models';
import { getTerminalsService } from '../-services';

const useQueryTerminals = () => {
	const admin = useAuthStore((state) => state.admin);
	const [pagination, setPagination] = useState<MRT_PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [sorting, setSorting] = useState<MRT_SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);

	const params = useMemo<TerminalsQueryParams>(() => {
		const baseParams: TerminalsQueryParams = {
			page: pagination.pageIndex + 1,
			limit: pagination.pageSize,
		};

		if (admin?.localityId) {
			baseParams.localityId = admin.localityId;
		}

		if (sorting.length > 0) {
			baseParams.sortBy = sorting[0].id as TerminalsQueryParams['sortBy'];
			baseParams.sortOrder = sorting[0].desc ? 'desc' : 'asc';
		}

		for (const filter of columnFilters) {
			if (filter.id === 'name' && typeof filter.value === 'string') {
				baseParams.name = filter.value;
			}
		}

		return baseParams;
	}, [pagination, sorting, columnFilters, admin?.localityId]);

	const { data, isLoading, isError, error } = useQuery<ListTerminalsResponse>({
		queryKey: ['terminals', params],
		queryFn: () => getTerminalsService(params),
		placeholderData: keepPreviousData,
	});

	return {
		data,
		isLoading,
		isError,
		error,
		pagination,
		setPagination,
		sorting,
		setSorting,
		columnFilters,
		setColumnFilters,
	};
};

export { useQueryTerminals };
