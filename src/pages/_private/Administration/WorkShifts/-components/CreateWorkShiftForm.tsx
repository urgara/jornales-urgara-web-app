import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Checkbox, Drawer, Group, Stack, TextInput } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useForm, Controller } from 'react-hook-form';
import { useMutationCreateWorkShift } from '../-hooks';
import { DayOfWeek, type CreateWorkShiftRequest } from '../-models';
import { CreateWorkShiftRequestSchema } from '../-models';

interface CreateWorkShiftFormProps {
  opened: boolean;
  onClose: () => void;
}

const DAY_OPTIONS = [
  { value: DayOfWeek.M, label: 'Lunes' },
  { value: DayOfWeek.T, label: 'Martes' },
  { value: DayOfWeek.W, label: 'Miércoles' },
  { value: DayOfWeek.Th, label: 'Jueves' },
  { value: DayOfWeek.F, label: 'Viernes' },
  { value: DayOfWeek.S, label: 'Sábado' },
  { value: DayOfWeek.Su, label: 'Domingo' },
];

export function CreateWorkShiftForm({ opened, onClose }: CreateWorkShiftFormProps) {
  const createWorkShift = useMutationCreateWorkShift();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateWorkShiftRequest>({
    resolver: zodResolver(CreateWorkShiftRequestSchema),
    defaultValues: {
      days: [],
      description: null,
    },
  });

  const onSubmit = (data: CreateWorkShiftRequest) => {
    createWorkShift.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Drawer opened={opened} onClose={onClose} title='Crear Turno' position='right' size='lg'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput
            label='Descripción'
            placeholder='Ingrese la descripción del turno'
            {...register('description')}
            error={errors.description?.message}
          />

          <Controller
            name='days'
            control={control}
            render={({ field }) => (
              <Checkbox.Group
                label='Días de la semana'
                withAsterisk
                value={field.value}
                onChange={field.onChange}
                error={errors.days?.message}
              >
                <Group mt='xs'>
                  {DAY_OPTIONS.map((day) => (
                    <Checkbox key={day.value} value={day.value} label={day.label} />
                  ))}
                </Group>
              </Checkbox.Group>
            )}
          />

          <Controller
            name='startTime'
            control={control}
            render={({ field }) => (
              <TimeInput
                label='Hora de inicio'
                withAsterisk
                value={field.value ? new Date(field.value).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }) : ''}
                onChange={(event) => {
                  const timeValue = event.currentTarget.value;
                  if (timeValue) {
                    const [hours, minutes] = timeValue.split(':');
                    const date = new Date();
                    date.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0);
                    field.onChange(date);
                  }
                }}
                error={errors.startTime?.message}
              />
            )}
          />

          <Controller
            name='endTime'
            control={control}
            render={({ field }) => (
              <TimeInput
                label='Hora de fin'
                withAsterisk
                value={field.value ? new Date(field.value).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }) : ''}
                onChange={(event) => {
                  const timeValue = event.currentTarget.value;
                  if (timeValue) {
                    const [hours, minutes] = timeValue.split(':');
                    const date = new Date();
                    date.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0);
                    field.onChange(date);
                  }
                }}
                error={errors.endTime?.message}
              />
            )}
          />

          <TextInput
            label='Coeficiente'
            placeholder='1.00'
            withAsterisk
            {...register('coefficient')}
            error={errors.coefficient?.message}
          />

          <Group justify='flex-end' mt='md'>
            <Button variant='outline' onClick={onClose}>
              Cancelar
            </Button>
            <Button type='submit' loading={createWorkShift.isPending}>
              Crear
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
}
