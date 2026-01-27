import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Drawer, Group, Stack, TextInput } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { useMutationCreateLocality } from '../-hooks';
import type { CreateLocalityRequest } from '../-models';
import { CreateLocalityRequestSchema } from '../-models';

interface CreateLocalityFormProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateLocalityForm({ opened, onClose }: CreateLocalityFormProps) {
  const createLocality = useMutationCreateLocality();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLocalityRequest>({
    resolver: zodResolver(CreateLocalityRequestSchema),
  });

  const onSubmit = (data: CreateLocalityRequest) => {
    createLocality.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Drawer opened={opened} onClose={onClose} title='Crear Localidad' position='right'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput
            label='Nombre'
            placeholder='Ingrese el nombre de la localidad'
            withAsterisk
            {...register('name')}
            error={errors.name?.message}
          />

          <TextInput
            label='Provincia'
            placeholder='Ingrese la provincia'
            withAsterisk
            {...register('province')}
            error={errors.province?.message}
          />

          <Group justify='flex-end' mt='md'>
            <Button variant='outline' onClick={onClose}>
              Cancelar
            </Button>
            <Button type='submit' loading={createLocality.isPending}>
              Crear
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
}
