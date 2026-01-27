import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import type { MRT_ColumnFiltersState, MRT_PaginationState } from 'mantine-react-table';
import { useCallback, useMemo, useState } from 'react';
import { QUERY_KEYS } from '@/utils';
import type { AdminSortBy, AdminsQueryParams } from '../-models';
import { getAdminsService } from '../-services';

export const useQueryAdmins = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/_private/Administration/Admins' });

  // Estados para la tabla
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: (search.page || 1) - 1,
    pageSize: search.limit || 10,
  });

  const [sorting, setSorting] = useState(
    search.sortBy
      ? [{ id: search.sortBy, desc: search.sortOrder === 'desc' }]
      : [{ id: 'createdAt', desc: true }]
  );
  // Filtros iniciales desde la URL
  const initialColumnFilters: MRT_ColumnFiltersState = [
    { id: 'name', value: search.name },
    { id: 'surname', value: search.surname },
    { id: 'dni', value: search.dni },
    { id: 'role', value: search.role },
  ];

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(initialColumnFilters);

  // Actualizar URL cuando cambian los estados
  const updateUrl = useCallback(
    (params: Partial<AdminsQueryParams>) => {
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
      const newFilters: { id: AdminSortBy; value: unknown }[] =
        typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters) : updaterOrValue;

      setColumnFilters(newFilters);

      // Lista de todas las propiedades de filtro posibles
      const filterKeys = ['name', 'surname', 'dni', 'role'];

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
    const params: AdminsQueryParams = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };

    if (sorting[0]) {
      params.sortBy = sorting[0].id as AdminSortBy;
      params.sortOrder = sorting[0].desc ? 'desc' : 'asc';
    }

    columnFilters.forEach((filter) => {
      if (filter.value && typeof filter.value === 'string') {
        const key = filter.id as keyof AdminsQueryParams;
        if (key === 'name' || key === 'surname' || key === 'dni' || key === 'role') {
          params[key] = filter.value;
        }
      }
    });

    return params;
  }, [pagination, sorting, columnFilters]);

  // Query de datos
  const queryResult = useQuery({
    queryKey: [QUERY_KEYS.ADMINS, queryParams],
    queryFn: () => getAdminsService(queryParams),
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
