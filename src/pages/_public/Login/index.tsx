import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Center,
  Container,
  Flex,
  Grid,
  Image,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { type ErrorResponse, ErrorType } from '@/models';
import { useMutationLogin } from './-hooks';
import { type LoginRequest, LoginRequestSchema } from './-models';

export const Route = createFileRoute('/_public/Login/')({
  beforeLoad: ({ context }) => {
    if (context.isAuth) {
      throw redirect({ to: '/Dashboard' });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  const loginMutation = useMutationLogin();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      dni: '',
      password: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: LoginRequest) => {
    loginMutation.mutate(data, {
      onError: (error) => {
        if (isAxiosError(error)) {
          const errorData = error.response?.data as ErrorResponse;
          if (errorData.name === ErrorType.UNAUTHORIZED) {
            setError('dni', { message: ' ' });
            setError('password', { message: 'DNI o contraseña incorrectos' });
          }
        }
      },
    });
  };

  return (
    <Container fluid>
      <Grid>
        <Grid.Col span={4} h='100vh' p='lg'>
          <Flex direction='column' align='center' h='100%' w='100%' justify='center'>
            <Image src='images\logo-urgara.png' h='150px' fit='contain' />
            <Flex
              component='form'
              direction='column'
              w='100%'
              gap='md'
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextInput
                {...register('dni')}
                placeholder='Enter your DNI'
                error={errors.dni?.message}
              />

              <PasswordInput
                {...register('password')}
                placeholder='Enter your password'
                error={errors.password?.message}
              />
              <Center>
                <Button type='submit' loading={isSubmitting || loginMutation.isPending}>
                  Iniciar Sesión
                </Button>
              </Center>
            </Flex>
          </Flex>
          <Center>
            <Text c='dimmed'>Desarrollado por Dynnamo Crypt S.A</Text>
          </Center>
        </Grid.Col>
        <Grid.Col span={8} h='100vh' bg='var(--mantine-color-dark-9)'>
          <Flex align='center' gap='md' h='100%'>
            <Image src='images\campo-trigo.jpg' h='80%' flex={1} fit='cover' radius='md' />
            <Image src='images\cosecha-de-maiz.jpg' h='90%' flex={1} fit='cover' radius='md' />
            <Image src='images\puerto-bahia.jpg' h='80%' flex={1} fit='cover' radius='md' />
          </Flex>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
