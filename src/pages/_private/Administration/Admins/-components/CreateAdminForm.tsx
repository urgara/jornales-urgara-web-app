import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Drawer, Group, Select, Stack, TextInput } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { LocalitySelect } from '@/components';
import { Role } from '@/models';
import { useMutationCreateAdmin } from '../-hooks';
import type { CreateAdminRequest } from '../-models';
import { CreateAdminRequestSchema } from '../-models';

interface CreateAdminFormProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateAdminForm({ opened, onClose }: CreateAdminFormProps) {
  const createAdmin = useMutationCreateAdmin();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateAdminRequest>({
    resolver: zodResolver(CreateAdminRequestSchema),
    defaultValues: {
      localityId: null,
      role: Role.LOCAL,
    },
  });

  const selectedRole = watch('role');

  const onSubmit = (data: CreateAdminRequest) => {
    const submitData = {
      ...data,
      localityId: data.role === Role.ADMIN ? null : data.localityId,
    };

    createAdmin.mutate(submitData, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const roleOptions = [
    { value: Role.ADMIN, label: 'Administrador Global' },
    { value: Role.LOCAL, label: 'Administrador Local' },
  ];

  return (
    <Drawer opened={opened} onClose={onClose} title='Crear Administrador' position='right'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput
            label='Nombre'
            placeholder='Ingrese el nombre'
            withAsterisk
            {...register('name')}
            error={errors.name?.message}
          />

          <TextInput
            label='Apellido'
            placeholder='Ingrese el apellido'
            withAsterisk
            {...register('surname')}
            error={errors.surname?.message}
          />

          <TextInput
            label='DNI'
            placeholder='Ingrese el DNI'
            withAsterisk
            {...register('dni')}
            error={errors.dni?.message}
          />

          <Select
            label='Rol'
            placeholder='Seleccione el rol'
            data={roleOptions}
            withAsterisk
            {...register('role')}
            onChange={(value) => setValue('role', value as Role.ADMIN | Role.LOCAL)}
            error={errors.role?.message}
          />

          {selectedRole === Role.LOCAL && (
            <LocalitySelect
              label='Localidad'
              placeholder='Seleccione la localidad'
              clearable
              {...register('localityId')}
              onChange={(value) => setValue('localityId', value || null)}
              error={errors.localityId?.message}
            />
          )}

          <TextInput
            label='Contraseña'
            type='password'
            placeholder='Ingrese la contraseña'
            withAsterisk
            {...register('password')}
            error={errors.password?.message}
          />

          <TextInput
            label='Confirmar Contraseña'
            type='password'
            placeholder='Confirme la contraseña'
            withAsterisk
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <Group justify='flex-end' mt='md'>
            <Button variant='outline' onClick={onClose}>
              Cancelar
            </Button>
            <Button type='submit' loading={createAdmin.isPending}>
              Crear
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
}
