import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import type { MRT_ColumnFiltersState, MRT_PaginationState } from 'mantine-react-table';
import { useCallback, useMemo, useState } from 'react';
import { useAuthStore } from '@/stores';
import { QUERY_KEYS } from '@/utils';
import type { WorkShiftSortBy, WorkShiftsQueryParams } from '../-models';
import { getWorkShifts } from '../-services';

export const useQueryWorkShifts = () => {
  const admin = useAuthStore((store) => store.admin);
  const navigate = useNavigate();
  const search = useSearch({ from: '/_private/WorkerManagement/WorkShift/List' });

  // Estados para la tabla
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: (search.page || 1) - 1,
    pageSize: search.limit || 10,
  });

  const [sorting, setSorting] = useState(
    search.sortBy
      ? [{ id: search.sortBy, desc: search.sortOrder === 'desc' }]
      : [{ id: 'description', desc: false }]
  );

  // Filtros iniciales desde la URL
  const initialColumnFilters: MRT_ColumnFiltersState = [
    { id: 'description', value: search.description },
  ];

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(initialColumnFilters);

  // Actualizar URL cuando cambian los estados
  const updateUrl = useCallback(
    (params: Partial<WorkShiftsQueryParams>) => {
      navigate({
        to: '.',
        search: (prev) => ({ ...prev, ...params }),
      });
    },
    [navigate]
  );

  // Handlers para actualizar estado y URL
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
      const newFilters: { id: WorkShiftSortBy; value: unknown }[] =
        typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters) : updaterOrValue;

      setColumnFilters(newFilters);

      // Lista de todas las propiedades de filtro posibles
      const filterKeys = ['description'];

      // Inicializar todos los parámetros como undefined para limpiarlos
      const urlParams: Record<string, string | undefined> = {};
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
    },
    [columnFilters, updateUrl]
  );

  // Construir parámetros para la query
  const queryParams = useMemo(() => {
    const params: WorkShiftsQueryParams = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };

    // Agregar localityId si el admin tiene una localidad asignada
    if (admin?.localityId) {
      params.localityId = admin.localityId;
    }

    if (sorting[0]) {
      params.sortBy = sorting[0].id as WorkShiftSortBy;
      params.sortOrder = sorting[0].desc ? 'desc' : 'asc';
    }

    columnFilters.forEach((filter) => {
      if (filter.value && typeof filter.value === 'string') {
        const key = filter.id as keyof WorkShiftsQueryParams;
        if (key === 'description') {
          params.description = filter.value;
        }
      }
    });

    return params;
  }, [pagination, sorting, columnFilters, admin?.localityId]);

  // Query de datos
  const queryResult = useQuery({
    queryKey: [QUERY_KEYS.WORK_SHIFTS, queryParams],
    queryFn: () => getWorkShifts(queryParams),
  });

  return {
    ...queryResult,
    // Estados de la tabla
    pagination,
    sorting,
    columnFilters,
    // Handlers
    setPagination: handlePaginationChange,
    setSorting: handleSortingChange,
    setColumnFilters: handleColumnFiltersChange,
  };
};
