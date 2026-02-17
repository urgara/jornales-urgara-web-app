import { Select, type SelectProps } from '@mantine/core';
import { useQuerySelectShips } from '@/hooks';

type ShipSelectProps = Omit<SelectProps, 'data'>;

export function ShipSelect(props: ShipSelectProps) {
  const { ships, isLoading } = useQuerySelectShips();

  const data = ships.map((ship) => ({
    value: ship.id,
    label: ship.name,
  }));

  return <Select {...props} data={data} disabled={isLoading || props.disabled} />;
}
