import { z } from 'zod/v4';
import { ResponseGenericIncludeDataSchema } from './generic-responses.type';

// Schema para Locality completa (con todas las propiedades)
const LocalitySchema = z.object({
  id: z.number(),
  name: z.string(),
  province: z.string(),
  createdAt: z.iso.datetime().transform((val) => new Date(val).toLocaleDateString('es-ES')),
  deletedAt: z.iso
    .datetime()
    .nullable()
    .transform((val) => (val ? new Date(val).toLocaleDateString('es-ES') : undefined)),
});

// Schema para select (solo id y name)
const SelectLocalitySchema = z.object({
  id: z.number(),
  name: z.string(),
});

const ListSelectLocalitiesSchema = z.array(SelectLocalitySchema);
const ListSelectLocalitiesResponseSchema = ResponseGenericIncludeDataSchema(ListSelectLocalitiesSchema);

enum Role {
  ADMIN = 'ADMIN',
  LOCAL = 'LOCAL',
}

const AdminSchema = z.object({
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
    .number()
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

const CheckAdminResponseSchema = ResponseGenericIncludeDataSchema(AdminSchema);

type Admin = z.infer<typeof AdminSchema>;
type CheckAdminResponse = z.infer<typeof CheckAdminResponseSchema>;
type Locality = z.infer<typeof LocalitySchema>;
type SelectLocality = z.infer<typeof SelectLocalitySchema>;
type ListSelectLocalitiesResponse = z.infer<typeof ListSelectLocalitiesResponseSchema>;

export { AdminSchema, CheckAdminResponseSchema, Role, LocalitySchema, ListSelectLocalitiesResponseSchema };
export type { Admin, CheckAdminResponse, Locality, SelectLocality, ListSelectLocalitiesResponse };
