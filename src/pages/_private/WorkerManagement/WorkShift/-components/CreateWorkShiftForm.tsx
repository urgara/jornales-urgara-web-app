import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Modal, MultiSelect, Select, Stack, TextInput } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { useMutationCreateWorkShift } from '../-hooks';
import { type CreateWorkShiftRequest, CreateWorkShiftRequestSchema } from '../-models';

interface CreateWorkShiftFormProps {
  opened: boolean;
  onClose: () => void;
}

const DAY_OPTIONS = [
  { value: 'M', label: 'Lunes' },
  { value: 'T', label: 'Martes' },
  { value: 'W', label: 'Miércoles' },
  { value: 'Th', label: 'Jueves' },
  { value: 'F', label: 'Viernes' },
  { value: 'S', label: 'Sábado' },
  { value: 'Su', label: 'Domingo' },
];

// Generar opciones de tiempo de 00:00 a 23:00 cada hora
const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return { value: `${hour}:00`, label: `${hour}:00` };
});

const COEFFICIENT_OPTIONS = [
  { value: '1', label: '1' },
  { value: '1.5', label: '1,5' },
  { value: '2', label: '2' },
  { value: '2.25', label: '2,25' },
];

export function CreateWorkShiftForm({ opened, onClose }: CreateWorkShiftFormProps) {
  const { mutate: createWorkShift, isPending } = useMutationCreateWorkShift();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateWorkShiftRequest>({
    resolver: zodResolver(CreateWorkShiftRequestSchema),
    defaultValues: {
      days: ['M', 'T', 'W', 'Th', 'F', 'S', 'Su'],
      startTime: '',
      endTime: '',
      description: '',
      coefficient: '',
    },
  });

  const daysValue = watch('days');
  const showDescription = daysValue?.length === 0;
  const requireTimeFields = daysValue && daysValue.length > 0;

  const onSubmit = (data: CreateWorkShiftRequest) => {
    createWorkShift(data, {
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
    <Modal opened={opened} onClose={handleClose} title='Crear nuevo turno' centered size='md'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Controller
            name='days'
            control={control}
            render={({ field }) => (
              <MultiSelect
                {...field}
                label='Días de la semana'
                placeholder='Seleccione los días (dejar vacío para turno especial)'
                data={DAY_OPTIONS}
                error={errors.days?.message}
                clearable
              />
            )}
          />

          {showDescription && (
            <TextInput
              label='Descripción'
              placeholder='Ej: Encargado de carga'
              required
              {...register('description')}
              error={errors.description?.message}
            />
          )}

          <Controller
            name='startTime'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label='Hora de inicio'
                placeholder={
                  requireTimeFields ? 'Seleccione hora' : 'Opcional para turnos sin días'
                }
                data={TIME_OPTIONS}
                required={requireTimeFields}
                searchable
                error={errors.startTime?.message}
              />
            )}
          />

          <Controller
            name='endTime'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label='Hora de fin'
                placeholder={
                  requireTimeFields ? 'Seleccione hora' : 'Opcional para turnos sin días'
                }
                data={TIME_OPTIONS}
                required={requireTimeFields}
                searchable
                error={errors.endTime?.message}
              />
            )}
          />

          <Controller
            name='coefficient'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label='Coeficiente'
                placeholder='Seleccione el coeficiente'
                data={COEFFICIENT_OPTIONS}
                required
                error={errors.coefficient?.message}
              />
            )}
          />

          <Button type='submit' loading={isPending} fullWidth>
            Crear turno
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
