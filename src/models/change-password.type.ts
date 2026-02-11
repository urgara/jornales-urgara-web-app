import { z } from 'zod/v4';
import { REGEX } from '@/utils/regex';

const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z
    .string()
    .regex(
      REGEX.adminPassword,
      'Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial'
    ),
});

const ChangePasswordFormSchema = ChangePasswordRequestSchema.extend({
  confirmPassword: z.string().min(1, 'Debe confirmar la nueva contraseña'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;
type ChangePasswordForm = z.infer<typeof ChangePasswordFormSchema>;

export { ChangePasswordRequestSchema, ChangePasswordFormSchema };
export type { ChangePasswordRequest, ChangePasswordForm };
