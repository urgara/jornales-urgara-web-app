import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { QUERY_KEYS } from '@/utils/query-keys';
import { getSelectLegalEntities } from '../-services';

export const useQuerySelectLegalEntities = () => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.LEGAL_ENTITIES, 'select'],
    queryFn: () => getSelectLegalEntities(),
    staleTime: 60 * 60 * 1000, // 60 minutes
    gcTime: 120 * 60 * 1000, // 120 minutes
  });

  const getLegalEntityName = useCallback(
    (id: number) => {
      const legalEntity = query.data?.data?.find((le) => le.id === id);
      return legalEntity
        ? `${legalEntity.abbreviation} - ${legalEntity.description}`
        : `Entidad Legal ${id}`;
    },
    [query.data?.data]
  );

  return {
    ...query,
    getLegalEntityName,
  };
};
