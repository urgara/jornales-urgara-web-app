import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useForm } from 'react-hook-form';
import type { z } from 'zod/v4';
import { useMutationCreateShip } from '../-hooks';
import { CreateShipRequestSchemaBase } from '../-models';

type CreateShipFormData = z.infer<typeof CreateShipRequestSchemaBase>;

interface CreateShipFormProps {
  opened: boolean;
  onClose: () => void;
}

const CreateShipForm = ({ opened, onClose }: CreateShipFormProps) => {
  const { mutate: createShip, isPending } = useMutationCreateShip();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateShipFormData>({
    resolver: zodResolver(CreateShipRequestSchemaBase),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (data: CreateShipFormData) => {
    createShip(data, {
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
    <Modal opened={opened} onClose={handleClose} title='Crear Barco'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap='md'>
          <TextInput
            label='Nombre'
            placeholder='Ingrese el nombre del barco'
            {...register('name')}
            error={errors.name?.message}
            required
          />
          <Group justify='flex-end' mt='md'>
            <Button variant='outline' onClick={handleClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type='submit' loading={isPending}>
              Crear
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export { CreateShipForm };
