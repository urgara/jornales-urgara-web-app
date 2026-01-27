import { Select, type SelectProps } from '@mantine/core';
import { useMemo } from 'react';
import { useQuerySelectLocalities } from '@/hooks';

type LocalitySelectProps = Omit<SelectProps, 'data'>;

export const LocalitySelect = ({ placeholder, disabled, ...props }: LocalitySelectProps) => {
  const { data, isLoading } = useQuerySelectLocalities();

  const localityOptions = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((locality) => ({
      value: locality.id.toString(),
      label: locality.name,
    }));
  }, [data?.data]);

  return (
    <Select
      placeholder={
        isLoading ? 'Cargando localidades...' : placeholder || 'Selecciona una localidad'
      }
      data={localityOptions}
      searchable
      disabled={isLoading || disabled}
      {...props}
    />
  );
};
