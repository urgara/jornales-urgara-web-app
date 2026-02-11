import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Modal, MultiSelect, NumberInput, Select, Stack } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { WORKER_CATEGORY_OPTIONS } from '@/models';
import { useMutationCreateBaseValue } from '../-hooks';
import {
  type CreateWorkShiftBaseValueRequest,
  CreateWorkShiftBaseValueRequestSchema,
} from '../-models';

interface CreateBaseValueFormProps {
  opened: boolean;
  onClose: () => void;
}

const COEFFICIENT_OPTIONS = [
  { value: '1', label: '1' },
  { value: '1.5', label: '1,5' },
  { value: '2', label: '2' },
  { value: '2.25', label: '2,25' },
];

export function CreateBaseValueForm({ opened, onClose }: CreateBaseValueFormProps) {
  const { mutate: createBaseValue, isPending } = useMutationCreateBaseValue();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateWorkShiftBaseValueRequest>({
    resolver: zodResolver(CreateWorkShiftBaseValueRequestSchema),
    defaultValues: {
      remunerated: '',
      notRemunerated: '',
      startDate: '',
      endDate: '',
      category: 'IDONEO',
      coefficients: COEFFICIENT_OPTIONS.map((o) => o.value),
    },
  });

  const onSubmit = (data: CreateWorkShiftBaseValueRequest) => {
    createBaseValue(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title='Crear valor base' centered size='md'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Controller
            name='remunerated'
            control={control}
            render={({ field }) => (
              <NumberInput
                label='Remunerado'
                placeholder='Ingrese el valor remunerado'
                required
                value={field.value ? Number(field.value) : undefined}
                onChange={(value) => {
                  if (value === '' || value === null || value === undefined) {
                    field.onChange('');
                  } else {
                    field.onChange(String(value));
                  }
                }}
                onBlur={field.onBlur}
                error={errors.remunerated?.message}
                decimalSeparator=','
                thousandSeparator='.'
                decimalScale={2}
                prefix='$'
              />
            )}
          />

          <Controller
            name='notRemunerated'
            control={control}
            render={({ field }) => (
              <NumberInput
                label='No remunerado'
                placeholder='Ingrese el valor no remunerado'
                required
                value={field.value ? Number(field.value) : undefined}
                onChange={(value) => {
                  if (value === '' || value === null || value === undefined) {
                    field.onChange('');
                  } else {
                    field.onChange(String(value));
                  }
                }}
                onBlur={field.onBlur}
                error={errors.notRemunerated?.message}
                decimalSeparator=','
                thousandSeparator='.'
                decimalScale={2}
                prefix='$'
              />
            )}
          />

          <Controller
            name='category'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label='Categoría'
                placeholder='Seleccione la categoría'
                data={WORKER_CATEGORY_OPTIONS}
                required
                error={errors.category?.message}
              />
            )}
          />

          <Controller
            name='startDate'
            control={control}
            render={({ field }) => (
              <DateInput
                label='Fecha de inicio'
                placeholder='Seleccione fecha de inicio'
                required
                valueFormat='DD/MM/YYYY'
                value={field.value ? dayjs(field.value).toDate() : null}
                onChange={(date) => {
                  const d = dayjs(date);
                  field.onChange(d.isValid() ? d.toISOString() : '');
                }}
                error={errors.startDate?.message}
              />
            )}
          />

          <Controller
            name='endDate'
            control={control}
            render={({ field }) => (
              <DateInput
                label='Fecha de fin'
                placeholder='Seleccione fecha de fin'
                required
                valueFormat='DD/MM/YYYY'
                value={field.value ? dayjs(field.value).toDate() : null}
                onChange={(date) => {
                  const d = dayjs(date);
                  field.onChange(d.isValid() ? d.toISOString() : '');
                }}
                error={errors.endDate?.message}
              />
            )}
          />

          <Controller
            name='coefficients'
            control={control}
            render={({ field }) => (
              <MultiSelect
                {...field}
                label='Coeficientes'
                placeholder='Seleccione los coeficientes'
                data={COEFFICIENT_OPTIONS}
                required
                error={errors.coefficients?.message}
              />
            )}
          />

          <Button type='submit' loading={isPending} fullWidth>
            Crear valor base
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
