import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Modal, NumberInput, Select, Stack } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  AgencySelect,
  CompanySelect,
  ProductSelect,
  TerminalSelect,
  WorkerSelect,
  WorkShiftSelect,
} from '@/components';
import { WORKER_CATEGORY_OPTIONS } from '@/models';
import { useAuthStore } from '@/stores';
import { useMutationCreateWorkerAssignment } from '../-hooks';
import {
  type CreateWorkerAssignmentRequest,
  CreateWorkerAssignmentRequestSchema,
} from '../-models';
import { BaseValueSelect, type BaseValueSelection } from './BaseValueSelect';

interface CreateWorkerAssignmentFormProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateWorkerAssignmentForm({ opened, onClose }: CreateWorkerAssignmentFormProps) {
  const admin = useAuthStore((state) => state.admin);
  const { mutate: createWorkerAssignment, isPending } = useMutationCreateWorkerAssignment();
  const [baseValueKey, setBaseValueKey] = useState<string | null>(null);

  const {
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Omit<CreateWorkerAssignmentRequest, 'localityId'>>({
    resolver: zodResolver(CreateWorkerAssignmentRequestSchema.omit({ localityId: true })),
    defaultValues: {
      workerId: '',
      workShiftId: '',
      date: '',
      category: undefined,
      value: { workShiftBaseValueId: '', coefficient: '' },
      additionalPercent: '',
      companyId: '',
      agencyId: '',
      terminalId: '',
      productId: '',
    },
  });

  const onSubmit = (data: Omit<CreateWorkerAssignmentRequest, 'localityId'>) => {
    const submitData: CreateWorkerAssignmentRequest = {
      ...data,
      localityId: admin?.localityId || '',
    };

    if (!data.additionalPercent || data.additionalPercent === '') {
      delete submitData.additionalPercent;
    }

    createWorkerAssignment(submitData, {
      onSuccess: () => {
        reset();
        setBaseValueKey(null);
        onClose();
      },
    });
  };

  const dateValue = watch('date');
  const categoryValue = watch('category');

  const handleBaseValueChange = (selection: BaseValueSelection | null) => {
    if (selection) {
      setValue('value', selection);
      setBaseValueKey(`${selection.workShiftBaseValueId}|${selection.coefficient}`);
    } else {
      setValue('value', { workShiftBaseValueId: '', coefficient: '' });
      setBaseValueKey(null);
    }
  };

  const handleClose = () => {
    reset();
    setBaseValueKey(null);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title='Crear nueva asignación' centered size='md'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Controller
            name='workerId'
            control={control}
            render={({ field }) => (
              <WorkerSelect
                label='Trabajador'
                placeholder='Seleccione un trabajador'
                value={field.value}
                onChange={(value) => field.onChange(value || '')}
                onBlur={field.onBlur}
                error={errors.workerId?.message}
                required
              />
            )}
          />

          <Controller
            name='workShiftId'
            control={control}
            render={({ field }) => (
              <WorkShiftSelect
                label='Turno'
                placeholder='Seleccione un turno'
                value={field.value}
                onChange={(value) => field.onChange(value || '')}
                onBlur={field.onBlur}
                error={errors.workShiftId?.message}
                required
              />
            )}
          />

          <Controller
            name='date'
            control={control}
            render={({ field }) => (
              <DateInput
                label='Fecha'
                placeholder='Seleccione la fecha'
                value={field.value ? new Date(field.value) : null}
                onChange={(value) => {
                  if (value) {
                    const year = value.getFullYear();
                    const month = String(value.getMonth() + 1).padStart(2, '0');
                    const day = String(value.getDate()).padStart(2, '0');
                    field.onChange(`${year}-${month}-${day}`);
                  } else {
                    field.onChange('');
                  }
                }}
                onBlur={field.onBlur}
                error={errors.date?.message}
                required
                valueFormat='DD/MM/YYYY'
              />
            )}
          />

          <Controller
            name='category'
            control={control}
            render={({ field }) => (
              <Select
                label='Categoría'
                placeholder='Seleccione una categoría'
                data={WORKER_CATEGORY_OPTIONS as unknown as { value: string; label: string }[]}
                value={field.value || null}
                onChange={(value) => field.onChange(value || '')}
                onBlur={field.onBlur}
                error={errors.category?.message}
                required
              />
            )}
          />

          <BaseValueSelect
            label='Valor base'
            placeholder='Seleccione un valor base'
            date={dateValue || undefined}
            category={categoryValue || undefined}
            value={baseValueKey}
            onChange={handleBaseValueChange}
            error={
              errors.value?.workShiftBaseValueId?.message || errors.value?.coefficient?.message
            }
            required
          />

          <Controller
            name='companyId'
            control={control}
            render={({ field }) => (
              <CompanySelect
                label='Empresa'
                placeholder='Seleccione una empresa'
                value={field.value}
                onChange={(value) => field.onChange(value || '')}
                onBlur={field.onBlur}
                error={errors.companyId?.message}
                required
              />
            )}
          />

          <Controller
            name='agencyId'
            control={control}
            render={({ field }) => (
              <AgencySelect
                label='Agencia'
                placeholder='Seleccione una agencia'
                value={field.value}
                onChange={(value) => field.onChange(value || '')}
                onBlur={field.onBlur}
                error={errors.agencyId?.message}
                required
              />
            )}
          />

          <Controller
            name='terminalId'
            control={control}
            render={({ field }) => (
              <TerminalSelect
                label='Terminal'
                placeholder='Seleccione un terminal'
                value={field.value}
                onChange={(value) => field.onChange(value || '')}
                onBlur={field.onBlur}
                error={errors.terminalId?.message}
                required
              />
            )}
          />

          <Controller
            name='productId'
            control={control}
            render={({ field }) => (
              <ProductSelect
                label='Producto'
                placeholder='Seleccione un producto'
                value={field.value}
                onChange={(value) => field.onChange(value || '')}
                onBlur={field.onBlur}
                error={errors.productId?.message}
                required
              />
            )}
          />

          <Controller
            name='additionalPercent'
            control={control}
            render={({ field }) => (
              <NumberInput
                label='Premio / Castigo'
                placeholder='Ej: 15,00 o -10,00'
                value={field.value ? Number(field.value) : undefined}
                onChange={(value) => {
                  if (value === '' || value === null || value === undefined) {
                    field.onChange('');
                  } else {
                    field.onChange(String(value));
                  }
                }}
                onBlur={field.onBlur}
                error={errors.additionalPercent?.message}
                decimalSeparator=','
                thousandSeparator='.'
                allowNegative={true}
                decimalScale={2}
                fixedDecimalScale={false}
                styles={{
                  input: {
                    color:
                      field.value && Number(field.value) !== 0
                        ? Number(field.value) > 0
                          ? 'var(--mantine-color-green-9)'
                          : 'var(--mantine-color-red-9)'
                        : undefined,
                    fontWeight: field.value && Number(field.value) !== 0 ? 600 : undefined,
                  },
                }}
              />
            )}
          />

          <Button type='submit' loading={isPending} fullWidth>
            Crear asignación
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
