import { z } from 'zod/v4';
import { ResponseGenericSchema } from '@/models';
import { REGEX } from '@/utils';

const LoginRequestSchema = z.object({
  dni: z
    .string()
    .min(8, 'El DNI debe tener al menos 8 caracteres')
    .regex(/^\d+$/, 'El DNI debe contener solo números'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(REGEX.adminPassword, {
      message:
        'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial (@$!%*?&#)',
    }),
});

const LoginResponseSchema = ResponseGenericSchema;

type LoginResponse = z.infer<typeof LoginResponseSchema>;
type LoginRequest = z.infer<typeof LoginRequestSchema>;

export { LoginResponseSchema, LoginRequestSchema };
export type { LoginResponse, LoginRequest };
