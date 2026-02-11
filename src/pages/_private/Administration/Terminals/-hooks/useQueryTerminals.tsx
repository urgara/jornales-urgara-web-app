import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import type {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
} from 'mantine-react-table';
import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/stores';
import type { TerminalsQueryParams } from '../-models';
import { getTerminals } from '../-services';

export function useQueryTerminals() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false });
  const admin = useAuthStore((state) => state.admin);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: searchParams.page ? Number(searchParams.page) - 1 : 0,
    pageSize: searchParams.limit ? Number(searchParams.limit) : 10,
  });

  const [sorting, setSorting] = useState<MRT_SortingState>(
    searchParams.sortBy && searchParams.sortOrder
      ? [{ id: searchParams.sortBy as string, desc: searchParams.sortOrder === 'desc' }]
      : []
  );

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);

  useEffect(() => {
    const newSearchParams: Record<string, string> = {
      page: String(pagination.pageIndex + 1),
      limit: String(pagination.pageSize),
    };

    if (sorting.length > 0) {
      newSearchParams.sortBy = sorting[0].id;
      newSearchParams.sortOrder = sorting[0].desc ? 'desc' : 'asc';
    }

    columnFilters.forEach((filter) => {
      if (filter.value) {
        newSearchParams[filter.id] = String(filter.value);
      }
    });

    navigate({
      to: '.',
      search: () => newSearchParams,
      replace: true,
    });
  }, [pagination, sorting, columnFilters, navigate]);

  const queryParams = useMemo<TerminalsQueryParams>(() => {
    const params: TerminalsQueryParams = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };

    if (sorting.length > 0) {
      params.sortBy = sorting[0].id as TerminalsQueryParams['sortBy'];
      params.sortOrder = sorting[0].desc ? 'desc' : 'asc';
    }

    columnFilters.forEach((filter) => {
      if (filter.value) {
        params[filter.id as keyof TerminalsQueryParams] = filter.value as never;
      }
    });

    if (admin?.localityId) {
      params.localityId = admin.localityId;
    }

    return params;
  }, [pagination, sorting, columnFilters, admin?.localityId]);

  const { data, isLoading } = useQuery({
    queryKey: ['terminals', queryParams],
    queryFn: () => getTerminals(queryParams),
    enabled: !!admin?.localityId,
  });

  return {
    data,
    isLoading,
    pagination,
    sorting,
    columnFilters,
    setPagination,
    setSorting,
    setColumnFilters,
  };
}
