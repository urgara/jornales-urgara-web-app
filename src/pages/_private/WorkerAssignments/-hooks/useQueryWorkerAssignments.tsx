import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
} from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { useAuthStore } from '@/stores';
import { QUERY_KEYS } from '@/utils';
import type { WorkerAssignmentsQueryParams } from '../-models';
import { workerAssignmentService } from '../-services';

export function useQueryWorkerAssignments() {
  const admin = useAuthStore((store) => store.admin);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<MRT_SortingState>([{ id: 'id', desc: true }]);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);

  const queryParams = useMemo<WorkerAssignmentsQueryParams>(() => {
    const params: WorkerAssignmentsQueryParams = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };

    if (admin?.localityId) {
      params.localityId = admin.localityId;
    }

    if (sorting.length > 0) {
      params.sortBy = sorting[0].id as WorkerAssignmentsQueryParams['sortBy'];
      params.sortOrder = sorting[0].desc ? 'desc' : 'asc';
    }

    for (const filter of columnFilters) {
      const { id, value } = filter;
      if (value !== undefined && value !== null && value !== '') {
        if (id === 'workShiftId') {
          params.workShiftId = value as string;
        } else if (id === 'companyId') {
          params.companyId = value as string;
        } else if (id === 'companyRole') {
          params.companyRole = value as string;
        } else if (id === 'terminalId') {
          params.terminalId = value as string;
        } else if (id === 'productId') {
          params.productId = value as string;
        } else if (id === 'shipId') {
          params.shipId = value as string;
        } else if (id === 'date') {
          const dateRange = value as [string, string];
          if (dateRange[0]) {
            params.dateFrom = dateRange[0];
          }
          if (dateRange[1]) {
            params.dateTo = dateRange[1];
          }
        }
      }
    }

    return params;
  }, [pagination, sorting, columnFilters, admin?.localityId]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.WORKER_ASSIGNMENTS, queryParams],
    queryFn: () => workerAssignmentService.getWorkerAssignments(queryParams),
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
