import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import type {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
} from 'mantine-react-table';
import { useCallback, useMemo, useState } from 'react';
import { QUERY_KEYS } from '@/utils';
import type { ProductsQueryParams } from '../-models';
import { getProducts } from '../-services';

export const useQueryProducts = () => {
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
    if (searchParams.isActive !== undefined) {
      filters.push({ id: 'isActive', value: searchParams.isActive === 'true' });
    }
    return filters;
  });

  const filterKeys = ['name', 'isActive'];

  const updateUrl = useCallback(
    (params: Record<string, string | number | boolean | undefined>) => {
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

  const handleColumnFiltersChange = useCallback(
    (
      updater: ((old: MRT_ColumnFiltersState) => MRT_ColumnFiltersState) | MRT_ColumnFiltersState
    ) => {
      setColumnFilters((old) => {
        const newFilters = typeof updater === 'function' ? updater(old) : updater;

        const urlParams: Record<string, string | number | boolean | undefined> = {};
        filterKeys.forEach((key) => {
          urlParams[key] = undefined;
        });

        newFilters.forEach((filter) => {
          if (filter.value !== undefined && filter.value !== null && filter.value !== '') {
            if (filter.id === 'name' && typeof filter.value === 'string') {
              urlParams[filter.id] = filter.value;
            } else if (filter.id === 'isActive' && typeof filter.value === 'boolean') {
              urlParams[filter.id] = filter.value;
            }
          }
        });
        updateUrl(urlParams);

        return newFilters;
      });
    },
    [updateUrl]
  );

  const queryParams = useMemo<ProductsQueryParams>(() => {
    const params: ProductsQueryParams = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };

    if (sorting.length > 0) {
      params.sortBy = sorting[0].id as ProductsQueryParams['sortBy'];
      params.sortOrder = sorting[0].desc ? 'desc' : 'asc';
    }

    for (const filter of columnFilters) {
      const { id, value } = filter;
      if (value !== undefined && value !== null && value !== '') {
        if (id === 'name') {
          params.name = value as string;
        } else if (id === 'isActive') {
          params.isActive = value as boolean;
        }
      }
    }

    return params;
  }, [pagination, sorting, columnFilters]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, queryParams],
    queryFn: () => getProducts(queryParams),
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
