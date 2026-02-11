import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Flex, Modal, PasswordInput } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { useMutationChangePassword } from '@/hooks';
import { type ChangePasswordForm, ChangePasswordFormSchema } from '@/models';

interface ChangePasswordModalProps {
  opened: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ opened, onClose }: ChangePasswordModalProps) {
  const mutation = useMutationChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(ChangePasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: ChangePasswordForm) => {
    mutation.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  return (
    <Modal withinPortal opened={opened} onClose={handleClose} title='Cambiar contraseña' centered>
      <Flex component='form' direction='column' gap='md' onSubmit={handleSubmit(onSubmit)}>
        <PasswordInput
          {...register('currentPassword')}
          label='Contraseña actual'
          placeholder='Ingrese su contraseña actual'
          error={errors.currentPassword?.message}
        />
        <PasswordInput
          {...register('newPassword')}
          label='Nueva contraseña'
          placeholder='Ingrese la nueva contraseña'
          error={errors.newPassword?.message}
        />
        <PasswordInput
          {...register('confirmPassword')}
          label='Confirmar contraseña'
          placeholder='Confirme la nueva contraseña'
          error={errors.confirmPassword?.message}
        />
        <Button type='submit' loading={mutation.isPending}>
          Cambiar contraseña
        </Button>
      </Flex>
    </Modal>
  );
}
