import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getSelectLocalitiesService } from '@/services';
import { QUERY_KEYS } from '@/utils';

export const useQuerySelectLocalities = () => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.LOCALITIES, 'select'],
    queryFn: () => getSelectLocalitiesService(),
    staleTime: 60 * 60 * 1000, // 60 minutos - las localidades no cambian frecuentemente
    gcTime: 120 * 60 * 1000, // 120 minutos
  });

  const getLocalityName = useCallback(
    (id: number) => {
      const locality = query.data?.data?.find((l) => l.id === id);
      return locality ? locality.name : `Localidad ${id}`;
    },
    [query.data?.data]
  );

  return {
    ...query,
    getLocalityName,
  };
};
