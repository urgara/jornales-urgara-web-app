import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Drawer, Group, Stack, TextInput } from '@mantine/core';
import type { z } from 'zod/v4';
import { useForm } from 'react-hook-form';
import { useMutationCreateCompany } from '../-hooks';
import type { CreateCompanyRequest } from '../-models';
import { CreateCompanyRequestSchemaBase } from '../-models';

type CreateCompanyFormData = z.infer<typeof CreateCompanyRequestSchemaBase>;

interface CreateCompanyFormProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateCompanyForm({ opened, onClose }: CreateCompanyFormProps) {
  const createCompany = useMutationCreateCompany();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCompanyFormData>({
    resolver: zodResolver(CreateCompanyRequestSchemaBase),
    defaultValues: {
      name: '',
      cuit: null,
    },
  });

  const onSubmit = (data: CreateCompanyFormData) => {
    const submitData: CreateCompanyRequest = {
      ...data,
      cuit: data.cuit === '' ? null : data.cuit ?? null,
    };
    createCompany.mutate(submitData, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Drawer opened={opened} onClose={onClose} title='Crear Empresa' position='right'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput
            label='Nombre'
            placeholder='Ingrese el nombre de la empresa'
            withAsterisk
            {...register('name')}
            error={errors.name?.message}
          />

          <TextInput
            label='CUIT'
            placeholder='Ingrese el CUIT (11 dígitos)'
            {...register('cuit')}
            error={errors.cuit?.message}
          />

          <Group justify='flex-end' mt='md'>
            <Button variant='outline' onClick={onClose}>
              Cancelar
            </Button>
            <Button type='submit' loading={createCompany.isPending}>
              Crear
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
}
