import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import type {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
} from 'mantine-react-table';
import { useCallback, useMemo, useState } from 'react';
import { QUERY_KEYS } from '@/utils';
import type { LocalitiesQueryParams, LocalitySortBy } from '../-models';
import { getLocalitiesService } from '../-services';

export const useQueryLocalities = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/_private/Administration/Localities' });

  // Estados para la tabla
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: (search.page || 1) - 1,
    pageSize: search.limit || 10,
  });

  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);

  // Actualizar URL cuando cambian los estados
  const updateUrl = useCallback(
    (params: Partial<LocalitiesQueryParams>) => {
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
      const newFilters: { id: LocalitySortBy; value: unknown }[] =
        typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters) : updaterOrValue;

      setColumnFilters(newFilters);

      // Lista de todas las propiedades de filtro posibles
      const filterKeys = ['name', 'province', 'isActive'];

      // Inicializar todos los parámetros como undefined para limpiarlos
      const urlParams: Record<string, string | undefined> = {};
      filterKeys.forEach((key) => {
        urlParams[key] = undefined;
      });

      // Agregar solo los filtros con valores
      newFilters.forEach((filter) => {
        if (filter.value !== undefined && filter.value !== null) {
          if (typeof filter.value === 'string') {
            urlParams[filter.id] = filter.value;
          } else if (typeof filter.value === 'boolean') {
            urlParams[filter.id] = filter.value ? 'true' : 'false';
          }
        }
      });
      updateUrl(urlParams);
    },
    [columnFilters, updateUrl]
  );

  // Construir parámetros para la query
  const queryParams = useMemo(() => {
    const params: LocalitiesQueryParams = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };

    if (sorting?.[0]) {
      params.sortBy = sorting[0].id as LocalitySortBy;
      params.sortOrder = sorting[0].desc ? 'desc' : 'asc';
    }

    columnFilters.forEach((filter) => {
      if (filter.value !== undefined && filter.value !== null) {
        const key = filter.id as keyof LocalitiesQueryParams;
        if (key === 'name' || key === 'province') {
          if (typeof filter.value === 'string') {
            params[key] = filter.value;
          }
        } else if (key === 'isActive') {
          // Si seleccionó "true" → solo activos
          if (filter.value === 'true') {
            params.isActive = 'true';
          }
          // Si seleccionó "false" → solo inactivos
          else if (filter.value === 'false') {
            params.isActive = 'false';
          }
          // Si seleccionó "all" o no hay valor, no enviamos el parámetro (trae todo)
        }
      }
    });

    return params;
  }, [pagination, sorting, columnFilters]);

  // Query de datos
  const queryResult = useQuery({
    queryKey: [QUERY_KEYS.LOCALITIES, queryParams],
    queryFn: () => getLocalitiesService(queryParams),
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
