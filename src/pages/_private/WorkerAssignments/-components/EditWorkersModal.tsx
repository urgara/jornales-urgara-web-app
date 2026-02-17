import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { WorkerSelect } from '@/components';
import { WORKER_CATEGORY_OPTIONS } from '@/models';
import { useMutationUpdateWorkerAssignment } from '../-hooks';
import { type WorkerDetail, WorkerInputSchema } from '../-models';
import { BaseValueSelect, type BaseValueSelection } from './BaseValueSelect';

const SEPARATOR = '|';

const EditWorkersFormSchema = z.object({
  workers: z.array(WorkerInputSchema).min(1, 'Debe agregar al menos un trabajador'),
});

type EditWorkersFormData = z.infer<typeof EditWorkersFormSchema>;

interface EditWorkersModalProps {
  assignmentId: string;
  currentWorkers: WorkerDetail[];
  date: string;
  opened: boolean;
  onClose: () => void;
}

export function EditWorkersModal({
  assignmentId,
  currentWorkers,
  date,
  opened,
  onClose,
}: EditWorkersModalProps) {
  const { mutate: updateWorkerAssignment, isPending } = useMutationUpdateWorkerAssignment();

  const defaultWorkers = currentWorkers.map((w) => ({
    workerId: w.workerId,
    category: w.category,
    value: {
      workShiftBaseValueId: w.workShiftBaseValueId,
      coefficient: w.coefficient,
    },
    additionalPercent: w.additionalPercent || '',
  }));

  const initialBaseValueKeys: Record<number, string | null> = {};
  for (let i = 0; i < currentWorkers.length; i++) {
    const w = currentWorkers[i];
    initialBaseValueKeys[i] = `${w.workShiftBaseValueId}${SEPARATOR}${w.coefficient}`;
  }

  const [baseValueKeys, setBaseValueKeys] = useState<Record<number, string | null>>(
    initialBaseValueKeys
  );

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditWorkersFormData>({
    resolver: zodResolver(EditWorkersFormSchema),
    defaultValues: {
      workers: defaultWorkers,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'workers',
  });

  const onSubmit = (data: EditWorkersFormData) => {
    const cleanedWorkers = data.workers.map((w) => {
      const worker = { ...w };
      if (!worker.additionalPercent || worker.additionalPercent === '') {
        delete worker.additionalPercent;
      }
      return worker;
    });

    updateWorkerAssignment(
      { id: assignmentId, data: { workers: cleanedWorkers } },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleBaseValueChange = (index: number, selection: BaseValueSelection | null) => {
    if (selection) {
      setValue(`workers.${index}.value`, selection);
      setBaseValueKeys((prev) => ({
        ...prev,
        [index]: `${selection.workShiftBaseValueId}${SEPARATOR}${selection.coefficient}`,
      }));
    } else {
      setValue(`workers.${index}.value`, { workShiftBaseValueId: '', coefficient: '' });
      setBaseValueKeys((prev) => ({ ...prev, [index]: null }));
    }
  };

  const handleAddWorker = () => {
    append({
      workerId: '',
      category: undefined as unknown as 'IDONEO' | 'PERITO',
      value: { workShiftBaseValueId: '', coefficient: '' },
      additionalPercent: '',
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title='Editar trabajadores'
      centered
      size='lg'
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Group justify='flex-end'>
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
              <Stack
                key={field.id}
                gap='xs'
                style={{
                  border: '1px solid var(--mantine-color-dark-4)',
                  borderRadius: 8,
                  padding: 12,
                }}
              >
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
                  date={date}
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

          <Group justify='flex-end' mt='md'>
            <Button variant='outline' onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type='submit' loading={isPending}>
              Guardar
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
