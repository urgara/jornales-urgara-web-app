import { z } from 'zod/v4';
import {
  ResponseGenericIncludeDataSchema,
  ResponseGenericIncludeDataAndPaginationSchema,
} from '@/models';

// Regex para validar formato HH:mm
const TIME_FORMAT_HH_MM_REGEX = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

// Day of Week Enum
const DayOfWeek = z.enum(['M', 'T', 'W', 'Th', 'F', 'S', 'Su']);

// Work Shift Schema
const WorkShiftSchema = z.object({
  id: z.string().uuid(),
  days: z.array(DayOfWeek),
  startTime: z.string().regex(TIME_FORMAT_HH_MM_REGEX, 'El formato debe ser HH:mm').nullable(),
  endTime: z.string().regex(TIME_FORMAT_HH_MM_REGEX, 'El formato debe ser HH:mm').nullable(),
  description: z.string().max(60, 'La descripción no debe exceder 60 caracteres').nullable(),
  coefficient: z.string().min(1, 'El coeficiente es requerido'),
  createdAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().nullable(),
});

// Schema para select de Work Shift (solo id y description)
const SelectWorkShiftSchema = z.object({
  id: z.string().uuid(),
  description: z.string().nullable(),
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
const CreateWorkShiftRequestSchema = z
  .object({
    days: z.array(DayOfWeek),
    startTime: z
      .string()
      .regex(TIME_FORMAT_HH_MM_REGEX, 'El formato debe ser HH:mm')
      .optional()
      .or(z.literal('')),
    endTime: z
      .string()
      .regex(TIME_FORMAT_HH_MM_REGEX, 'El formato debe ser HH:mm')
      .optional()
      .or(z.literal('')),
    description: z.string().max(60, 'La descripción no debe exceder 60 caracteres').optional(),
    coefficient: z.string().min(1, 'El coeficiente es requerido'),
  })
  .refine(
    (data) => {
      // Si days tiene elementos, startTime y endTime son obligatorios
      if (data.days.length > 0 && (!data.startTime || data.startTime === '' || !data.endTime || data.endTime === '')) {
        return false;
      }
      return true;
    },
    {
      message: 'Los horarios son requeridos cuando se especifican días',
      path: ['startTime'],
    }
  )
  .refine(
    (data) => {
      // Si days está vacío, description es requerido
      if (data.days.length === 0 && (!data.description || data.description === '')) {
        return false;
      }
      return true;
    },
    {
      message: 'La descripción es requerida cuando no se especifican días',
      path: ['description'],
    }
  );

const CreateWorkShiftResponseSchema = ResponseGenericIncludeDataSchema(WorkShiftSchema);

// Update Work Shift Schema
const UpdateWorkShiftRequestSchema = z
  .object({
    days: z.array(DayOfWeek).optional(),
    startTime: z.string().regex(TIME_FORMAT_HH_MM_REGEX, 'El formato debe ser HH:mm').optional(),
    endTime: z.string().regex(TIME_FORMAT_HH_MM_REGEX, 'El formato debe ser HH:mm').optional(),
    description: z.string().max(60, 'La descripción no debe exceder 60 caracteres').optional(),
    coefficient: z.string().optional(),
  })
  .refine(
    (data) => {
      // Si days está explícitamente vacío, description es requerido
      if (data.days && data.days.length === 0 && !data.description) {
        return false;
      }
      return true;
    },
    {
      message: 'La descripción es requerida cuando los días están vacíos',
      path: ['description'],
    }
  );

const UpdateWorkShiftResponseSchema = ResponseGenericIncludeDataSchema(WorkShiftSchema);

type DayOfWeekType = z.infer<typeof DayOfWeek>;
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
  DayOfWeek,
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
  DayOfWeekType,
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
