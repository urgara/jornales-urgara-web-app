import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Divider,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconPlus } from '@tabler/icons-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  CompanySelect,
  ProductSelect,
  ShipSelect,
  TerminalSelect,
} from '@/components';
import { useAuthStore } from '@/stores';
import { useMutationCreateWorkerAssignment } from '../-hooks';
import {
  COMPANY_ROLE_OPTIONS,
  type CreateWorkerAssignmentRequest,
  CreateWorkerAssignmentRequestSchema,
} from '../-models';
import { ShiftSection } from './ShiftSection';

interface CreateWorkerAssignmentFormProps {
  opened: boolean;
  onClose: () => void;
}

type FormData = Omit<CreateWorkerAssignmentRequest, 'localityId'>;

export function CreateWorkerAssignmentForm({ opened, onClose }: CreateWorkerAssignmentFormProps) {
  const admin = useAuthStore((state) => state.admin);
  const { mutate: createWorkerAssignment, isPending } = useMutationCreateWorkerAssignment();

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
      date: '',
      companyId: '',
      companyRole: undefined,
      terminalId: '',
      productId: '',
      shipId: '',
      jc: false,
      shifts: [
        {
          workShiftId: '',
          workers: [
            {
              workerId: '',
              category: undefined,
              value: { workShiftBaseValueId: '', coefficient: '' },
              additionalPercent: '',
            },
          ],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'shifts',
  });

  const dateValue = watch('date');

  const onSubmit = (data: FormData) => {
    const submitData: CreateWorkerAssignmentRequest = {
      ...data,
      localityId: admin?.localityId || '',
    };

    // Clean up empty additionalPercent from all shifts/workers
    for (const shift of submitData.shifts) {
      for (const worker of shift.workers) {
        if (!worker.additionalPercent || worker.additionalPercent === '') {
          delete worker.additionalPercent;
        }
      }
    }

    createWorkerAssignment(submitData, {
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

  const handleAddShift = () => {
    append({
      workShiftId: '',
      workers: [
        {
          workerId: '',
          category: undefined as unknown as 'IDONEO' | 'PERITO',
          value: { workShiftBaseValueId: '', coefficient: '' },
          additionalPercent: '',
        },
      ],
    });
  };

  const isCalculateJc = admin?.Locality?.isCalculateJc === true;

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title='Crear nueva asignación'
      centered
      size='70%'
      styles={{
        body: { maxHeight: '80vh', overflowY: 'auto' },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
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
            <Title order={4}>Turnos</Title>
            <Button
              variant='light'
              size='xs'
              leftSection={<IconPlus size={14} />}
              onClick={handleAddShift}
            >
              Agregar turno
            </Button>
          </Group>

          {errors.shifts?.root?.message && (
            <Text c='red' size='sm'>
              {errors.shifts.root.message}
            </Text>
          )}

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing='md'>
            {fields.map((field, index) => (
              <ShiftSection
                key={field.id}
                shiftIndex={index}
                control={control}
                errors={errors}
                date={dateValue}
                onRemove={() => remove(index)}
                canRemove={fields.length > 1}
                setValue={setValue}
                watch={watch}
              />
            ))}
          </SimpleGrid>

          <Button type='submit' loading={isPending} fullWidth>
            Crear asignación
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
