import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { SelectAgency } from '@/services';
import { getSelectAgencies } from '@/services';
import { QUERY_KEYS } from '@/utils';

export const useQuerySelectAgencies = () => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.AGENCIES, 'select'],
    queryFn: getSelectAgencies,
  });

  const agenciesData = useMemo<SelectAgency[]>(() => {
    if (!query.data?.data) return [];
    return query.data.data;
  }, [query.data]);

  const getAgencyName = (id: string) => {
    const agency = query.data?.data?.find((a) => a.id === id);
    return agency?.name || id;
  };

  return {
    ...query,
    data: agenciesData,
    getAgencyName,
  };
};
