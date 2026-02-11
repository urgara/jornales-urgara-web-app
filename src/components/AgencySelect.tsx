import { Select, type SelectProps } from '@mantine/core';
import { useQuerySelectAgencies } from '@/hooks';

interface AgencySelectProps extends Omit<SelectProps, 'data'> {}

export function AgencySelect(props: AgencySelectProps) {
  const { data: agencies, isLoading } = useQuerySelectAgencies();

  return (
    <Select
      {...props}
      data={agencies.map((agency) => ({
        value: agency.id,
        label: agency.name,
      }))}
      disabled={isLoading || props.disabled}
      searchable
      clearable
    />
  );
}
