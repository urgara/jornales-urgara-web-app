import { z } from 'zod/v4';
import {
  ResponseGenericIncludeDataSchema,
  ResponseGenericIncludeDataAndPaginationSchema,
} from '@/models';

// Day of Week Enum
export enum DayOfWeek {
  M = 'M', // Monday
  T = 'T', // Tuesday
  W = 'W', // Wednesday
  Th = 'Th', // Thursday
  F = 'F', // Friday
  S = 'S', // Saturday
  Su = 'Su', // Sunday
}

// Work Shift Schema
const WorkShiftSchema = z.object({
  id: z.string().uuid(),
  days: z.array(z.nativeEnum(DayOfWeek)),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime(),
  description: z
    .string()
    .max(60, 'La descripción no puede tener más de 60 caracteres')
    .optional()
    .nullable()
    .transform((val) => val ?? null),
  coefficient: z.string().regex(/^\d+(\.\d+)?$/, 'El coeficiente debe ser un número decimal'),
  createdAt: z.iso.datetime().transform((val) => new Date(val).toLocaleDateString('es-ES')),
  deletedAt: z.iso
    .datetime()
    .nullable()
    .transform((val) => (val ? new Date(val).toLocaleDateString('es-ES') : undefined)),
});

// Schema para select de Work Shift (solo id y description)
const SelectWorkShiftSchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
});

const ListSelectWorkShiftsSchema = z.array(SelectWorkShiftSchema);
const ListSelectWorkShiftsResponseSchema = ResponseGenericIncludeDataSchema(
  ListSelectWorkShiftsSchema
);

// List Work Shifts Schema
const ListWorkShiftsSchema = z.array(WorkShiftSchema);
const ListWorkShiftsResponseSchema = ResponseGenericIncludeDataAndPaginationSchema(
  ListWorkShiftsSchema
);

// Get Work Shift Schema
const GetWorkShiftResponseSchema = ResponseGenericIncludeDataSchema(WorkShiftSchema);

// Create Work Shift Schema
const CreateWorkShiftRequestSchema = z.object({
  days: z.array(z.nativeEnum(DayOfWeek)).min(1, 'Debe seleccionar al menos un día'),
  startTime: z.date({ message: 'La hora de inicio es requerida' }),
  endTime: z.date({ message: 'La hora de fin es requerida' }),
  description: z
    .string()
    .max(60, 'La descripción no puede tener más de 60 caracteres')
    .nullable()
    .optional(),
  coefficient: z
    .string({ message: 'El coeficiente es requerido' })
    .regex(/^\d+(\.\d+)?$/, 'El coeficiente debe ser un número decimal'),
});

const CreateWorkShiftResponseSchema = ResponseGenericIncludeDataSchema(WorkShiftSchema);

// Update Work Shift Schema
const UpdateWorkShiftRequestSchema = CreateWorkShiftRequestSchema.partial();

const UpdateWorkShiftResponseSchema = ResponseGenericIncludeDataSchema(WorkShiftSchema);

type WorkShift = z.infer<typeof WorkShiftSchema>;
type SelectWorkShift = z.infer<typeof SelectWorkShiftSchema>;
type ListSelectWorkShiftsResponse = z.infer<typeof ListSelectWorkShiftsResponseSchema>;
type ListWorkShiftsResponse = z.infer<typeof ListWorkShiftsResponseSchema>;
type GetWorkShiftResponse = z.infer<typeof GetWorkShiftResponseSchema>;
type CreateWorkShiftRequest = z.infer<typeof CreateWorkShiftRequestSchema>;
type CreateWorkShiftResponse = z.infer<typeof CreateWorkShiftResponseSchema>;
type UpdateWorkShiftRequest = z.infer<typeof UpdateWorkShiftRequestSchema>;
type UpdateWorkShiftResponse = z.infer<typeof UpdateWorkShiftResponseSchema>;

export {
  WorkShiftSchema,
  ListSelectWorkShiftsResponseSchema,
  ListWorkShiftsResponseSchema,
  GetWorkShiftResponseSchema,
  CreateWorkShiftRequestSchema,
  CreateWorkShiftResponseSchema,
  UpdateWorkShiftRequestSchema,
  UpdateWorkShiftResponseSchema,
};

export type {
  WorkShift,
  SelectWorkShift,
  ListSelectWorkShiftsResponse,
  ListWorkShiftsResponse,
  GetWorkShiftResponse,
  CreateWorkShiftRequest,
  CreateWorkShiftResponse,
  UpdateWorkShiftRequest,
  UpdateWorkShiftResponse,
};
