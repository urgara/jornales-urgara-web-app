import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from 'mantine-react-table';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { QUERY_KEYS } from '@/utils';
import type { AgenciesQueryParams } from '../-models';
import { getAgencies } from '../-services';

export const useQueryAgencies = () => {
	const navigate = useNavigate();
	const searchParams = useSearch({ strict: false });
	const [pagination, setPagination] = useState<MRT_PaginationState>({
		pageIndex: Number(searchParams.page || 1) - 1,
		pageSize: Number(searchParams.limit || 10),
	});

	const [sorting, setSorting] = useState<MRT_SortingState>(() => {
		const sortBy = searchParams.sortBy || 'name';
		const sortOrder = searchParams.sortOrder || 'asc';
		return [{ id: sortBy, desc: sortOrder === 'desc' }];
	});

	const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(() => {
		const filters: MRT_ColumnFiltersState = [];
		if (searchParams.name) {
			filters.push({ id: 'name', value: searchParams.name });
		}
		return filters;
	});

	const filterKeys = ['name'];

	const updateUrl = useCallback(
		(params: Record<string, string | number | undefined>) => {
			navigate({
				to: '.',
				search: (prev: Record<string, unknown>) => {
					const current: Record<string, string> = {};
					for (const key in prev) {
						if (prev[key] !== undefined) {
							current[key] = String(prev[key]);
						}
					}

					for (const key in params) {
						if (params[key] === undefined) {
							delete current[key];
						} else {
							current[key] = String(params[key]);
						}
					}

					return current;
				},
			});
		},
		[navigate]
	);

	// Sincronizar paginación con URL
	const handlePaginationChange = useCallback(
		(updater: ((old: MRT_PaginationState) => MRT_PaginationState) | MRT_PaginationState) => {
			setPagination((old) => {
				const newPagination = typeof updater === 'function' ? updater(old) : updater;
				updateUrl({
					page: newPagination.pageIndex + 1,
					limit: newPagination.pageSize,
				});
				return newPagination;
			});
		},
		[updateUrl]
	);

	// Sincronizar sorting con URL
	const handleSortingChange = useCallback(
		(updater: ((old: MRT_SortingState) => MRT_SortingState) | MRT_SortingState) => {
			setSorting((old) => {
				const newSorting = typeof updater === 'function' ? updater(old) : updater;
				if (newSorting.length > 0) {
					updateUrl({
						sortBy: newSorting[0].id,
						sortOrder: newSorting[0].desc ? 'desc' : 'asc',
					});
				}
				return newSorting;
			});
		},
		[updateUrl]
	);

	// Sincronizar filtros con URL
	const handleColumnFiltersChange = useCallback(
		(updater: ((old: MRT_ColumnFiltersState) => MRT_ColumnFiltersState) | MRT_ColumnFiltersState) => {
			setColumnFilters((old) => {
				const newFilters = typeof updater === 'function' ? updater(old) : updater;

				// Inicializar todos los parámetros como undefined para limpiarlos
				const urlParams: Record<string, string | number | undefined> = {};
				filterKeys.forEach((key) => {
					urlParams[key] = undefined;
				});

				// Agregar solo los filtros con valores
				newFilters.forEach((filter) => {
					if (filter.value && typeof filter.value === 'string') {
						urlParams[filter.id] = filter.value;
					}
				});
				updateUrl(urlParams);

				return newFilters;
			});
		},
		[updateUrl]
	);

	// Construir parámetros para la query
	const queryParams = useMemo<AgenciesQueryParams>(() => {
		const params: AgenciesQueryParams = {
			page: pagination.pageIndex + 1,
			limit: pagination.pageSize,
		};

		if (sorting.length > 0) {
			params.sortBy = sorting[0].id as AgenciesQueryParams['sortBy'];
			params.sortOrder = sorting[0].desc ? 'desc' : 'asc';
		}

		for (const filter of columnFilters) {
			const { id, value } = filter;
			if (value !== undefined && value !== null && value !== '') {
				if (id === 'name') {
					params.name = value as string;
				}
			}
		}

		return params;
	}, [pagination, sorting, columnFilters]);

	const { data, isLoading, isError } = useQuery({
		queryKey: [QUERY_KEYS.AGENCIES, queryParams],
		queryFn: () => getAgencies(queryParams),
		placeholderData: keepPreviousData,
	});

	return {
		data,
		isLoading,
		isError,
		pagination,
		sorting,
		columnFilters,
		setPagination: handlePaginationChange,
		setSorting: handleSortingChange,
		setColumnFilters: handleColumnFiltersChange,
	};
};
