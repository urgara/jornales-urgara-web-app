import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  CompanySelect,
  ProductSelect,
  ShipSelect,
  TerminalSelect,
  WorkerSelect,
  WorkShiftSelect,
} from '@/components';
import { WORKER_CATEGORY_OPTIONS } from '@/models';
import { useAuthStore } from '@/stores';
import { useMutationCreateWorkerAssignment } from '../-hooks';
import {
  COMPANY_ROLE_OPTIONS,
  type CreateWorkerAssignmentRequest,
  CreateWorkerAssignmentRequestSchema,
} from '../-models';
import { BaseValueSelect, type BaseValueSelection } from './BaseValueSelect';

interface CreateWorkerAssignmentFormProps {
  opened: boolean;
  onClose: () => void;
}

type FormData = Omit<CreateWorkerAssignmentRequest, 'localityId'>;

export function CreateWorkerAssignmentForm({ opened, onClose }: CreateWorkerAssignmentFormProps) {
  const admin = useAuthStore((state) => state.admin);
  const { mutate: createWorkerAssignment, isPending } = useMutationCreateWorkerAssignment();
  const [baseValueKeys, setBaseValueKeys] = useState<Record<number, string | null>>({});

  const {
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(CreateWorkerAssignmentRequestSchema.omit({ localityId: true })),
    defaultValues: {
      workShiftId: '',
      date: '',
      companyId: '',
      companyRole: undefined,
      terminalId: '',
      productId: '',
      shipId: '',
      jc: false,
      workers: [
        {
          workerId: '',
          category: undefined,
          value: { workShiftBaseValueId: '', coefficient: '' },
          additionalPercent: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'workers',
  });

  const dateValue = watch('date');

  const onSubmit = (data: FormData) => {
    const submitData: CreateWorkerAssignmentRequest = {
      ...data,
      localityId: admin?.localityId || '',
    };

    for (const worker of submitData.workers) {
      if (!worker.additionalPercent || worker.additionalPercent === '') {
        delete worker.additionalPercent;
      }
    }

    createWorkerAssignment(submitData, {
      onSuccess: () => {
        reset();
        setBaseValueKeys({});
        onClose();
      },
    });
  };

  const handleBaseValueChange = (index: number, selection: BaseValueSelection | null) => {
    if (selection) {
      setValue(`workers.${index}.value`, selection);
      setBaseValueKeys((prev) => ({
        ...prev,
        [index]: `${selection.workShiftBaseValueId}|${selection.coefficient}`,
      }));
    } else {
      setValue(`workers.${index}.value`, { workShiftBaseValueId: '', coefficient: '' });
      setBaseValueKeys((prev) => ({ ...prev, [index]: null }));
    }
  };

  const handleClose = () => {
    reset();
    setBaseValueKeys({});
    onClose();
  };

  const handleAddWorker = () => {
    append({
      workerId: '',
      category: undefined as unknown as 'IDONEO' | 'PERITO',
      value: { workShiftBaseValueId: '', coefficient: '' },
      additionalPercent: '',
    });
  };

  const isCalculateJc = admin?.Locality?.isCalculateJc === true;

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title='Crear nueva asignación'
      centered
      size='lg'
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
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
            name='companyRole'
            control={control}
            render={({ field }) => (
              <Select
                label='Rol empresa'
                placeholder='Seleccione un rol'
                data={COMPANY_ROLE_OPTIONS as unknown as { value: string; label: string }[]}
                value={field.value || null}
                onChange={(value) => field.onChange(value || '')}
                onBlur={field.onBlur}
                error={errors.companyRole?.message}
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
            name='shipId'
            control={control}
            render={({ field }) => (
              <ShipSelect
                label='Barco'
                placeholder='Seleccione un barco'
                value={field.value}
                onChange={(value) => field.onChange(value || '')}
                onBlur={field.onBlur}
                error={errors.shipId?.message}
                required
              />
            )}
          />

          {isCalculateJc && (
            <Controller
              name='jc'
              control={control}
              render={({ field }) => (
                <Switch
                  label='Jornal caído'
                  checked={field.value || false}
                  onChange={(event) => field.onChange(event.currentTarget.checked)}
                />
              )}
            />
          )}

          <Divider my='xs' />
          <Group justify='space-between'>
            <Title order={4}>Trabajadores</Title>
            <Button
              variant='light'
              size='xs'
              leftSection={<IconPlus size={14} />}
              onClick={handleAddWorker}
            >
              Agregar trabajador
            </Button>
          </Group>

          {errors.workers?.root?.message && (
            <Text c='red' size='sm'>
              {errors.workers.root.message}
            </Text>
          )}

          {fields.map((field, index) => {
            const categoryValue = watch(`workers.${index}.category`);
            return (
              <Stack key={field.id} gap='xs' style={{ border: '1px solid var(--mantine-color-dark-4)', borderRadius: 8, padding: 12 }}>
                <Group justify='space-between'>
                  <Text size='sm' fw={500}>
                    Trabajador {index + 1}
                  </Text>
                  {fields.length > 1 && (
                    <ActionIcon
                      variant='subtle'
                      color='red'
                      size='sm'
                      onClick={() => {
                        remove(index);
                        setBaseValueKeys((prev) => {
                          const next = { ...prev };
                          delete next[index];
                          return next;
                        });
                      }}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  )}
                </Group>

                <Controller
                  name={`workers.${index}.workerId`}
                  control={control}
                  render={({ field: workerField }) => (
                    <WorkerSelect
                      label='Trabajador'
                      placeholder='Seleccione un trabajador'
                      value={workerField.value}
                      onChange={(value) => workerField.onChange(value || '')}
                      onBlur={workerField.onBlur}
                      error={errors.workers?.[index]?.workerId?.message}
                      required
                    />
                  )}
                />

                <Controller
                  name={`workers.${index}.category`}
                  control={control}
                  render={({ field: catField }) => (
                    <Select
                      label='Categoría'
                      placeholder='Seleccione una categoría'
                      data={
                        WORKER_CATEGORY_OPTIONS as unknown as { value: string; label: string }[]
                      }
                      value={catField.value || null}
                      onChange={(value) => catField.onChange(value || '')}
                      onBlur={catField.onBlur}
                      error={errors.workers?.[index]?.category?.message}
                      required
                    />
                  )}
                />

                <BaseValueSelect
                  label='Valor base'
                  placeholder='Seleccione un valor base'
                  date={dateValue || undefined}
                  category={categoryValue || undefined}
                  value={baseValueKeys[index] ?? null}
                  onChange={(selection) => handleBaseValueChange(index, selection)}
                  error={
                    errors.workers?.[index]?.value?.workShiftBaseValueId?.message ||
                    errors.workers?.[index]?.value?.coefficient?.message
                  }
                  required
                />

                <Controller
                  name={`workers.${index}.additionalPercent`}
                  control={control}
                  render={({ field: apField }) => (
                    <NumberInput
                      label='Premio / Castigo'
                      placeholder='Ej: 15,00 o -10,00'
                      value={apField.value ? Number(apField.value) : undefined}
                      onChange={(value) => {
                        if (value === '' || value === null || value === undefined) {
                          apField.onChange('');
                        } else {
                          apField.onChange(String(value));
                        }
                      }}
                      onBlur={apField.onBlur}
                      error={errors.workers?.[index]?.additionalPercent?.message}
                      decimalSeparator=','
                      thousandSeparator='.'
                      allowNegative={true}
                      decimalScale={2}
                      fixedDecimalScale={false}
                      styles={{
                        input: {
                          color:
                            apField.value && Number(apField.value) !== 0
                              ? Number(apField.value) > 0
                                ? 'var(--mantine-color-green-9)'
                                : 'var(--mantine-color-red-9)'
                              : undefined,
                          fontWeight:
                            apField.value && Number(apField.value) !== 0 ? 600 : undefined,
                        },
                      }}
                    />
                  )}
                />
              </Stack>
            );
          })}

          <Button type='submit' loading={isPending} fullWidth>
            Crear asignación
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
