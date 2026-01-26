import { DYNNAMIX_API } from '@/config';
import {
  type LoginRequest,
  LoginRequestSchema,
  type LoginResponse,
  LoginResponseSchema,
} from '../-models';

export async function loginService(credentials: LoginRequest): Promise<LoginResponse> {
  const validatedCredentials = LoginRequestSchema.parse(credentials);
  const response = await DYNNAMIX_API.post<LoginResponse>(
    'auth/login',
    validatedCredentials,
    {
      customNotifications: {
        VALIDATION_ERROR: 'Credenciales inválidas. Verifique DNI y contraseña',
        NOT_FOUND: 'Usuario no encontrado en el sistema',
        UNAUTHORIZED: 'Credenciales incorrectas',
      },
    }
  );

  const validatedResponse = LoginResponseSchema.parse(response.data);

  return validatedResponse;
}
