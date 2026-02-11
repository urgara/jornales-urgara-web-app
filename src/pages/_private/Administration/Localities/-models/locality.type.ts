import { z } from 'zod/v4';
import {
  ResponseGenericIncludeDataAndPaginationSchema,
  ResponseGenericIncludeDataSchema,
} from '@/models';

export const LocalitySchema = z.object({
  id: z.string().uuid(),
  name: z
    .string('El nombre es requerido')
    .min(1, 'El nombre no puede estar vacío')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  province: z
    .string('La provincia es requerida')
    .min(1, 'La provincia no puede estar vacía')
    .max(100, 'La provincia no puede tener más de 100 caracteres'),
  createdAt: z.iso.datetime().transform((val) => new Date(val).toLocaleDateString('es-ES')),
  deletedAt: z.iso
    .datetime()
    .nullable()
    .transform((val) => (val ? new Date(val).toLocaleDateString('es-ES') : undefined)),
});

// Schema para select (solo id y name)
const SelectLocalitySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const ListLocalitiesSchema = z.array(LocalitySchema);
const ListSelectLocalitiesSchema = z.array(SelectLocalitySchema);
const ListLocalitiesResponseSchema =
  ResponseGenericIncludeDataAndPaginationSchema(ListLocalitiesSchema);
const ListSelectLocalitiesResponseSchema = ResponseGenericIncludeDataSchema(
  ListSelectLocalitiesSchema
);
const GetLocalityResponseSchema = ResponseGenericIncludeDataSchema(LocalitySchema);

const CreateLocalityRequestSchema = LocalitySchema.pick({
  name: true,
  province: true,
});

const UpdateLocalityRequestSchema = CreateLocalityRequestSchema.partial();

export {
  ListLocalitiesResponseSchema,
  ListSelectLocalitiesResponseSchema,
  GetLocalityResponseSchema,
  CreateLocalityRequestSchema,
  UpdateLocalityRequestSchema,
};

type Locality = z.infer<typeof LocalitySchema>;
type SelectLocality = z.infer<typeof SelectLocalitySchema>;
type ListLocalitiesResponse = z.infer<typeof ListLocalitiesResponseSchema>;
type ListSelectLocalitiesResponse = z.infer<typeof ListSelectLocalitiesResponseSchema>;
type GetLocalityResponse = z.infer<typeof GetLocalityResponseSchema>;
type CreateLocalityRequest = z.infer<typeof CreateLocalityRequestSchema>;
type UpdateLocalityRequest = z.infer<typeof UpdateLocalityRequestSchema>;

export type {
  Locality,
  SelectLocality,
  ListLocalitiesResponse,
  ListSelectLocalitiesResponse,
  GetLocalityResponse,
  CreateLocalityRequest,
  UpdateLocalityRequest,
};
