import { useQuery } from '@tanstack/react-query';
import { getSelectShips } from '@/services';

export function useQuerySelectShips() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['ships', 'select'],
    queryFn: getSelectShips,
  });

  const getShipName = (shipId: string) => {
    return data?.data.find((ship) => ship.id === shipId)?.name ?? '';
  };

  return {
    ships: data?.data ?? [],
    isLoading,
    error,
    getShipName,
  };
}
