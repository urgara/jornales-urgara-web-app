import { Select, type SelectProps } from '@mantine/core';
import { useMemo } from 'react';
import { useQuerySelectBaseValues } from '../-hooks';

const SEPARATOR = '|';

export interface BaseValueSelection {
  workShiftBaseValueId: string;
  coefficient: string;
}

type BaseValueSelectProps = Omit<SelectProps, 'data' | 'onChange'> & {
  date?: string;
  category?: string;
  onChange?: (value: BaseValueSelection | null) => void;
};

export function BaseValueSelect({
  date,
  category,
  disabled,
  onChange,
  value,
  ...props
}: BaseValueSelectProps) {
  const { data, isLoading } = useQuerySelectBaseValues({ date, category });

  const options = useMemo(() => {
    if (!data?.data) return [];
    return data.data.flatMap((baseValue) =>
      baseValue.workShiftCalculatedValues.map((cv) => ({
        value: `${cv.workShiftBaseValueId}${SEPARATOR}${cv.coefficient}`,
        label: `Coef: ${cv.coefficient} - Bruto: $${cv.gross} / Neto: $${cv.net}`,
      }))
    );
  }, [data?.data]);

  const handleChange = (selected: string | null) => {
    if (!selected) {
      onChange?.(null);
      return;
    }
    const [workShiftBaseValueId, coefficient] = selected.split(SEPARATOR);
    onChange?.({ workShiftBaseValueId, coefficient });
  };

  return (
    <Select
      {...props}
      value={value}
      data={options}
      onChange={handleChange}
      disabled={isLoading || disabled || !date || !category}
      placeholder={isLoading ? 'Cargando...' : props.placeholder}
    />
  );
}
