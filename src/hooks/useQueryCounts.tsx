import { useQuery } from '@tanstack/react-query';
import {
  getCompaniesCountService,
  getWorkerAssignmentsCountService,
  getWorkersCountService,
} from '@/services';
import { useAuthStore } from '@/stores';
import { QUERY_KEYS } from '@/utils';

export const useQueryCompaniesCount = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMPANIES, 'count'],
    queryFn: () => getCompaniesCountService(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useQueryWorkersCount = () => {
  const admin = useAuthStore((store) => store.admin);

  return useQuery({
    queryKey: [QUERY_KEYS.WORKERS, 'count', admin?.localityId],
    queryFn: () => getWorkersCountService(admin?.localityId || undefined),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!admin?.localityId, // Solo ejecutar si hay localityId
  });
};

export const useQueryWorkerAssignmentsCount = () => {
  const admin = useAuthStore((store) => store.admin);

  return useQuery({
    queryKey: [QUERY_KEYS.WORKER_ASSIGNMENTS, 'count', admin?.localityId],
    queryFn: () => getWorkerAssignmentsCountService(admin?.localityId || undefined),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!admin?.localityId, // Solo ejecutar si hay localityId
  });
};
