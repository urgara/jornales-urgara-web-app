import { z } from 'zod/v4';
import {
  LocalitySchema,
  ResponseGenericIncludeDataAndPaginationSchema,
  ResponseGenericIncludeDataSchema,
  Role,
} from '@/models';

export const AdminSchema = z.object({
  id: z.string(),
  name: z
    .string('El nombre es requerido')
    .min(1, 'El nombre no puede estar vacío')
    .max(30, 'El nombre no puede tener más de 30 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  surname: z
    .string('El apellido es requerido')
    .min(1, 'El apellido no puede estar vacío')
    .max(30, 'El apellido no puede tener más de 30 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'El apellido solo puede contener letras y espacios'),
  dni: z
    .string('El DNI es requerido')
    .min(8, 'El DNI debe tener al menos 8 dígitos')
    .max(9, 'El DNI no puede tener más de 9 dígitos')
    .regex(/^\d+$/, 'El DNI solo puede contener números'),
  localityId: z
    .string()
    .uuid()
    .nullable()
    .optional()
    .transform((val) => val ?? null),
  role: z.enum(Role, 'El rol no es valido'),
  createdAt: z.iso.datetime().transform((val) => new Date(val).toLocaleDateString('es-ES')),
  deletedAt: z.iso
    .datetime()
    .nullable()
    .transform((val) => (val ? new Date(val).toLocaleDateString('es-ES') : undefined)),
  Locality: LocalitySchema.nullable()
    .optional()
    .transform((val) => val ?? null),
});

const ListAdminsSchema = z.array(AdminSchema);
const ListAdminsResponseSchema = ResponseGenericIncludeDataAndPaginationSchema(ListAdminsSchema);
const GetAdminResponseSchema = ResponseGenericIncludeDataSchema(AdminSchema);

// Para API request (sin confirmPassword)
const CreateAdminApiSchema = z.object({
  name: AdminSchema.shape.name,
  surname: AdminSchema.shape.surname,
  dni: AdminSchema.shape.dni,
  password: z
    .string('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo (@$!%*?&#)'
    ),
  localityId: z.string().uuid().nullable(),
  role: AdminSchema.shape.role,
});

const UpdateAdminApiSchema = CreateAdminApiSchema.partial();

// Para formulario (con confirmPassword)
const CreateAdminRequestSchema = CreateAdminApiSchema.extend({
  confirmPassword: z.string().min(6, 'La confirmación debe tener al menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

const UpdateAdminRequestSchema = UpdateAdminApiSchema;

export {
  ListAdminsResponseSchema,
  GetAdminResponseSchema,
  CreateAdminRequestSchema,
  UpdateAdminRequestSchema,
  CreateAdminApiSchema,
  UpdateAdminApiSchema,
};

type Admin = z.infer<typeof AdminSchema>;
type ListAdminsResponse = z.infer<typeof ListAdminsResponseSchema>;
type GetAdminResponse = z.infer<typeof GetAdminResponseSchema>;
type CreateAdminRequest = z.infer<typeof CreateAdminRequestSchema>;
type UpdateAdminRequest = z.infer<typeof UpdateAdminRequestSchema>;
type CreateAdminApi = z.infer<typeof CreateAdminApiSchema>;
type UpdateAdminApi = z.infer<typeof UpdateAdminApiSchema>;

export type {
  Admin,
  ListAdminsResponse,
  GetAdminResponse,
  CreateAdminRequest,
  UpdateAdminRequest,
  CreateAdminApi,
  UpdateAdminApi,
};
