import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getSelectCompaniesService } from '@/services';
import { QUERY_KEYS } from '@/utils';

export const useQuerySelectCompanies = () => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.COMPANIES, 'select'],
    queryFn: () => getSelectCompaniesService(),
    staleTime: 60 * 60 * 1000, // 60 minutos - las empresas no cambian frecuentemente
    gcTime: 120 * 60 * 1000, // 120 minutos
  });

  const getCompanyName = useCallback(
    (id: string) => {
      const company = query.data?.data?.find((c) => c.id === id);
      return company ? company.name : `Empresa ${id}`;
    },
    [query.data?.data]
  );

  return {
    ...query,
    getCompanyName,
  };
};
