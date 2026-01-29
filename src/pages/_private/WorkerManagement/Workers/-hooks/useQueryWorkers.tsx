import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { QUERY_KEYS } from '@/utils';
import type { WorkersQueryParams } from '../-models';
import { workerService } from '../-services';

export function useQueryWorkers() {
	const [pagination, setPagination] = useState<MRT_PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	const [sorting, setSorting] = useState<MRT_SortingState>([{ id: 'createdAt', desc: true }]);
	const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);

	const queryParams = useMemo<WorkersQueryParams>(() => {
		const params: WorkersQueryParams = {
			page: pagination.pageIndex + 1,
			limit: pagination.pageSize,
		};

		if (sorting.length > 0) {
			params.sortBy = sorting[0].id as WorkersQueryParams['sortBy'];
			params.sortOrder = sorting[0].desc ? 'desc' : 'asc';
		}

		for (const filter of columnFilters) {
			const { id, value } = filter;
			if (value !== undefined && value !== null && value !== '') {
				if (id === 'name') {
					params.name = value as string;
				} else if (id === 'surname') {
					params.surname = value as string;
				} else if (id === 'dni') {
					params.dni = value as string;
				} else if (id === 'companyId') {
					params.companyId = Number(value);
				} else if (id === 'localityId') {
					params.localityId = Number(value);
				}
			}
		}

		return params;
	}, [pagination, sorting, columnFilters]);

	const { data, isLoading, isError } = useQuery({
		queryKey: [QUERY_KEYS.WORKERS, queryParams],
		queryFn: () => workerService.getWorkers(queryParams),
		placeholderData: keepPreviousData,
	});

	return {
		data,
		isLoading,
		isError,
		pagination,
		sorting,
		columnFilters,
		setPagination,
		setSorting,
		setColumnFilters,
	};
}
