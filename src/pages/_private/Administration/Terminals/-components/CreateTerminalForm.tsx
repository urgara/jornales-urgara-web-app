import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LocalitySelect } from '@/components';
import { useMutationCreateTerminal } from '../-hooks';
import { type CreateTerminalRequest, CreateTerminalRequestSchema } from '../-models';

type CreateTerminalFormProps = {
  opened: boolean;
  onClose: () => void;
};

export function CreateTerminalForm({ opened, onClose }: CreateTerminalFormProps) {
  const { mutate: createTerminal, isPending } = useMutationCreateTerminal();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateTerminalRequest>({
    resolver: zodResolver(CreateTerminalRequestSchema),
  });

  useEffect(() => {
    if (!opened) {
      reset();
    }
  }, [opened, reset]);

  const onSubmit = (data: CreateTerminalRequest) => {
    createTerminal(data, {
      onSuccess: () => {
        onClose();
        reset();
      },
    });
  };

  return (
    <Modal opened={opened} onClose={onClose} title='Crear Terminal'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput
            label='Nombre'
            placeholder='Ingrese el nombre del terminal'
            {...register('name')}
            error={errors.name?.message}
            required
          />
          <Controller
            name='localityId'
            control={control}
            render={({ field }) => (
              <LocalitySelect
                label='Localidad'
                placeholder='Seleccione una localidad'
                {...field}
                error={errors.localityId?.message}
                required
              />
            )}
          />
          <Group justify='flex-end' mt='md'>
            <Button variant='outline' onClick={onClose} disabled={isPending}>
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
}
