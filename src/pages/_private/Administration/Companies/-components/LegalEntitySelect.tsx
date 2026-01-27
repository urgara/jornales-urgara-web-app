import type { SelectProps } from '@mantine/core';
import { Select } from '@mantine/core';
import { useMemo } from 'react';
import { useQuerySelectLegalEntities } from '../-hooks';

type LegalEntitySelectProps = Omit<SelectProps, 'data'>;

export const LegalEntitySelect = ({ placeholder, disabled, ...props }: LegalEntitySelectProps) => {
  const { data, isLoading } = useQuerySelectLegalEntities();

  const legalEntityOptions = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((legalEntity) => ({
      value: legalEntity.id.toString(),
      label: `${legalEntity.abbreviation} - ${legalEntity.description}`,
    }));
  }, [data?.data]);

  return (
    <Select
      placeholder={
        isLoading ? 'Cargando entidades legales...' : placeholder || 'Selecciona una entidad legal'
      }
      data={legalEntityOptions}
      searchable
      disabled={isLoading || disabled}
      {...props}
    />
  );
};
