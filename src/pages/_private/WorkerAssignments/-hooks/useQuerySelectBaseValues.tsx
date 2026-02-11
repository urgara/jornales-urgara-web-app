import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores';
import { QUERY_KEYS } from '@/utils';
import { getSelectBaseValuesService } from '../-services';

interface UseQuerySelectBaseValuesParams {
  date?: string;
  category?: string;
}

export const useQuerySelectBaseValues = ({ date, category }: UseQuerySelectBaseValuesParams) => {
  const admin = useAuthStore((store) => store.admin);

  return useQuery({
    queryKey: [QUERY_KEYS.WORK_SHIFT_BASE_VALUES, 'select', date, category, admin?.localityId],
    queryFn: () =>
      getSelectBaseValuesService({
        date: date!,
        category: category!,
        ...(admin?.localityId ? { localityId: admin.localityId } : {}),
      }),
    enabled: !!date && !!category,
    staleTime: 60 * 60 * 1000,
    gcTime: 120 * 60 * 1000,
  });
};
