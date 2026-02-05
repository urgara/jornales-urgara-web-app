import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import type { MRT_ColumnFiltersState, MRT_PaginationState } from 'mantine-react-table';
import { useCallback, useMemo, useState } from 'react';
import { QUERY_KEYS } from '@/utils';
import type { CompaniesQueryParams, CompanySortBy } from '../-models';
import { getCompanies } from '../-services';

export const useQueryCompanies = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/_private/Administration/Companies' });

  // Estados para la tabla
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: (search.page || 1) - 1,
    pageSize: search.limit || 10,
  });

  const [sorting, setSorting] = useState(
    search.sortBy
      ? [{ id: search.sortBy, desc: search.sortOrder === 'desc' }]
      : [{ id: 'name', desc: false }]
  );

  // Filtros iniciales desde la URL
  const initialColumnFilters: MRT_ColumnFiltersState = [
    { id: 'name', value: search.name },
    { id: 'cuit', value: search.cuit },
    { id: 'legalEntityId', value: search.legalEntityId },
  ];

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(initialColumnFilters);

  // Actualizar URL cuando cambian los estados
  const updateUrl = useCallback(
    (params: Partial<CompaniesQueryParams>) => {
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
      const newFilters: { id: CompanySortBy; value: unknown }[] =
        typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters) : updaterOrValue;

      setColumnFilters(newFilters);

      // Lista de todas las propiedades de filtro posibles
      const filterKeys = ['name', 'cuit', 'legalEntityId'];

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
    },
    [columnFilters, updateUrl]
  );

  // Construir parámetros para la query
  const queryParams = useMemo(() => {
    const params: CompaniesQueryParams = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };

    if (sorting[0]) {
      params.sortBy = sorting[0].id as CompanySortBy;
      params.sortOrder = sorting[0].desc ? 'desc' : 'asc';
    }

    columnFilters.forEach((filter) => {
      if (filter.value) {
        const key = filter.id as keyof CompaniesQueryParams;
        if (key === 'name' && typeof filter.value === 'string') {
          params.name = filter.value;
        } else if (key === 'cuit' && typeof filter.value === 'string') {
          params.cuit = filter.value;
        } else if (key === 'legalEntityId' && typeof filter.value === 'number') {
          params.legalEntityId = filter.value;
        }
      }
    });

    return params;
  }, [pagination, sorting, columnFilters]);

  // Query de datos
  const queryResult = useQuery({
    queryKey: [QUERY_KEYS.COMPANIES, queryParams],
    queryFn: () => getCompanies(queryParams),
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
