import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import type { MRT_ColumnFiltersState, MRT_PaginationState } from 'mantine-react-table';
import { useCallback, useMemo, useState } from 'react';
import { useAuthStore } from '@/stores';
import { QUERY_KEYS } from '@/utils';
import type { WorkShiftBaseValueSortBy, WorkShiftBaseValuesQueryParams } from '../-models';
import { getBaseValues } from '../-services';

export const useQueryBaseValues = () => {
  const admin = useAuthStore((store) => store.admin);
  const navigate = useNavigate();
  const search = useSearch({ from: '/_private/WorkerManagement/BaseValues/List' });

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: (search.page || 1) - 1,
    pageSize: search.limit || 10,
  });

  const [sorting, setSorting] = useState(
    search.sortBy
      ? [{ id: search.sortBy, desc: search.sortOrder === 'desc' }]
      : [{ id: 'startDate', desc: true }]
  );

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);

  const updateUrl = useCallback(
    (params: Partial<WorkShiftBaseValuesQueryParams>) => {
      navigate({
        to: '.',
        search: (prev) => ({ ...prev, ...params }),
      });
    },
    [navigate]
  );

  const handlePaginationChange = useCallback(
    (updaterOrValue: unknown) => {
      const newPagination =
        typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue;

      setPagination(newPagination);
      updateUrl({
        page: newPagination.pageIndex + 1,
        limit: newPagination.pageSize,
      });
    },
    [pagination, updateUrl]
  );

  const handleSortingChange = useCallback(
    (updaterOrValue: unknown) => {
      const newSorting =
        typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;

      setSorting(newSorting);
      updateUrl({
        sortBy: newSorting[0]?.id || undefined,
        sortOrder: newSorting[0]?.desc ? 'desc' : 'asc',
      });
    },
    [sorting, updateUrl]
  );

  const handleColumnFiltersChange = useCallback(
    (updaterOrValue: unknown) => {
      const newFilters: { id: WorkShiftBaseValueSortBy; value: unknown }[] =
        typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters) : updaterOrValue;

      setColumnFilters(newFilters);
    },
    [columnFilters]
  );

  const queryParams = useMemo(() => {
    const params: WorkShiftBaseValuesQueryParams = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };

    if (admin?.localityId) {
      params.localityId = admin.localityId;
    }

    if (sorting[0]) {
      params.sortBy = sorting[0].id as WorkShiftBaseValueSortBy;
      params.sortOrder = sorting[0].desc ? 'desc' : 'asc';
    }

    return params;
  }, [pagination, sorting, admin?.localityId]);

  const queryResult = useQuery({
    queryKey: [QUERY_KEYS.WORK_SHIFT_BASE_VALUES, queryParams],
    queryFn: () => getBaseValues(queryParams),
  });

  return {
    ...queryResult,
    pagination,
    sorting,
    columnFilters,
    setPagination: handlePaginationChange,
    setSorting: handleSortingChange,
    setColumnFilters: handleColumnFiltersChange,
  };
};
