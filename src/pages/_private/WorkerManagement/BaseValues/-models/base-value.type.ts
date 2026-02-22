import { z } from 'zod/v4';
import {
  ResponseGenericIncludeDataAndPaginationSchema,
  ResponseGenericIncludeDataSchema,
  WorkerCategorySchema,
} from '@/models';

const WorkShiftCalculatedValueSchema = z.object({
  workShiftBaseValueId: z.string().uuid(),
  coefficient: z.string(),
  remunerated: z.string(),
  notRemunerated: z.string(),
  gross: z.string(),
  net: z.string(),
});

const WorkShiftBaseValueSchema = z.object({
  id: z.string().uuid(),
  remunerated: z.string(),
  notRemunerated: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  category: WorkerCategorySchema,
  workShiftCalculatedValues: z.array(WorkShiftCalculatedValueSchema).optional(),
});

const ListWorkShiftBaseValuesSchema = z.array(WorkShiftBaseValueSchema);
const ListWorkShiftBaseValuesResponseSchema = ResponseGenericIncludeDataAndPaginationSchema(
  ListWorkShiftBaseValuesSchema
);

const CreateWorkShiftBaseValueRequestSchema = z.object({
  remunerated: z.string().min(1, 'El valor remunerado es requerido'),
  notRemunerated: z.string().min(1, 'El valor no remunerado es requerido'),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  endDate: z.string().min(1, 'La fecha de fin es requerida'),
  category: WorkerCategorySchema,
  coefficients: z.array(z.string()).min(1, 'Debe seleccionar al menos un coeficiente'),
});

const CreateWorkShiftBaseValueResponseSchema =
  ResponseGenericIncludeDataSchema(WorkShiftBaseValueSchema);

type WorkShiftCalculatedValue = z.infer<typeof WorkShiftCalculatedValueSchema>;
type WorkShiftBaseValue = z.infer<typeof WorkShiftBaseValueSchema>;
type ListWorkShiftBaseValuesResponse = z.infer<typeof ListWorkShiftBaseValuesResponseSchema>;
type CreateWorkShiftBaseValueRequest = z.infer<typeof CreateWorkShiftBaseValueRequestSchema>;
type CreateWorkShiftBaseValueResponse = z.infer<typeof CreateWorkShiftBaseValueResponseSchema>;

export {
  WorkShiftCalculatedValueSchema,
  WorkShiftBaseValueSchema,
  ListWorkShiftBaseValuesResponseSchema,
  CreateWorkShiftBaseValueRequestSchema,
  CreateWorkShiftBaseValueResponseSchema,
};

export type {
  WorkShiftCalculatedValue,
  WorkShiftBaseValue,
  ListWorkShiftBaseValuesResponse,
  CreateWorkShiftBaseValueRequest,
  CreateWorkShiftBaseValueResponse,
};
