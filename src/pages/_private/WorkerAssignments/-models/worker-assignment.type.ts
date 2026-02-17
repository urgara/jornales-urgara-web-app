import { z } from 'zod/v4';
import {
  ResponseGenericIncludeDataAndPaginationSchema,
  ResponseGenericIncludeDataSchema,
  WorkerCategorySchema,
} from '@/models';

const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const CompanyRoleSchema = z.enum(['EXPORTER', 'SURVEYOR']);

const COMPANY_ROLE_LABELS: Record<z.infer<typeof CompanyRoleSchema>, string> = {
  EXPORTER: 'Exportador',
  SURVEYOR: 'Surveyor',
};

const COMPANY_ROLE_OPTIONS = [
  { value: 'EXPORTER', label: 'Exportador' },
  { value: 'SURVEYOR', label: 'Surveyor' },
] as const;

const getCompanyRoleLabel = (role: z.infer<typeof CompanyRoleSchema>): string => {
  return COMPANY_ROLE_LABELS[role] ?? role;
};

const WorkerDetailSchema = z.object({
  id: z.uuid(),
  workerAssignmentId: z.uuid(),
  workerId: z.uuid(),
  category: WorkerCategorySchema,
  workShiftBaseValueId: z.uuid(),
  coefficient: z.string(),
  baseValue: z.string(),
  additionalPercent: z.string().nullable(),
  totalAmount: z.string(),
});

const WorkerAssignmentSchema = z.object({
  id: z.uuid(),
  workShiftId: z.uuid(),
  date: z.string(),
  companyId: z.uuid(),
  companyRole: CompanyRoleSchema,
  localityId: z.uuid(),
  terminalId: z.uuid(),
  productId: z.uuid(),
  shipId: z.uuid(),
  shipName: z.string().optional(),
  jc: z.boolean(),
  createdAt: z.string(),
  workers: z.array(WorkerDetailSchema),
});

const ListWorkerAssignmentsSchema = z.array(WorkerAssignmentSchema);
const ListWorkerAssignmentsResponseSchema = ResponseGenericIncludeDataAndPaginationSchema(
  ListWorkerAssignmentsSchema
);

const WorkerInputSchema = z.object({
  workerId: z.uuid(),
  category: WorkerCategorySchema,
  value: z.object({
    workShiftBaseValueId: z.uuid(),
    coefficient: z.string().min(1, 'El coeficiente es requerido'),
  }),
  additionalPercent: z
    .union([
      z.string().regex(/^-?\d+(\.\d{1,2})?$/, 'El formato debe ser decimal con hasta 2 decimales'),
      z.literal(''),
    ])
    .optional(),
});

const CreateWorkerAssignmentRequestSchema = z.object({
  workShiftId: z.uuid(),
  date: z.string().regex(DATE_FORMAT_REGEX, 'El formato debe ser YYYY-MM-DD'),
  companyId: z.uuid(),
  companyRole: CompanyRoleSchema,
  localityId: z.uuid(),
  terminalId: z.uuid(),
  productId: z.uuid(),
  shipId: z.uuid(),
  jc: z.boolean().optional(),
  workers: z.array(WorkerInputSchema).min(1, 'Debe agregar al menos un trabajador'),
});

const CreateWorkerAssignmentResponseSchema =
  ResponseGenericIncludeDataSchema(WorkerAssignmentSchema);

const UpdateWorkerAssignmentRequestSchema = z.object({
  workShiftId: z.uuid().optional(),
  date: z.string().regex(DATE_FORMAT_REGEX, 'El formato debe ser YYYY-MM-DD').optional(),
  companyId: z.uuid().optional(),
  companyRole: CompanyRoleSchema.optional(),
  localityId: z.uuid().optional(),
  terminalId: z.uuid().optional(),
  productId: z.uuid().optional(),
  shipId: z.uuid().optional(),
  jc: z.boolean().optional(),
  workers: z.array(WorkerInputSchema).min(1, 'Debe agregar al menos un trabajador').optional(),
});

const UpdateWorkerAssignmentResponseSchema =
  ResponseGenericIncludeDataSchema(WorkerAssignmentSchema);

type CompanyRole = z.infer<typeof CompanyRoleSchema>;
type WorkerDetail = z.infer<typeof WorkerDetailSchema>;
type WorkerAssignment = z.infer<typeof WorkerAssignmentSchema>;
type WorkerInput = z.infer<typeof WorkerInputSchema>;
type ListWorkerAssignmentsResponse = z.infer<typeof ListWorkerAssignmentsResponseSchema>;
type CreateWorkerAssignmentRequest = z.infer<typeof CreateWorkerAssignmentRequestSchema>;
type CreateWorkerAssignmentResponse = z.infer<typeof CreateWorkerAssignmentResponseSchema>;
type UpdateWorkerAssignmentRequest = z.infer<typeof UpdateWorkerAssignmentRequestSchema>;
type UpdateWorkerAssignmentResponse = z.infer<typeof UpdateWorkerAssignmentResponseSchema>;

export {
  CompanyRoleSchema,
  COMPANY_ROLE_LABELS,
  COMPANY_ROLE_OPTIONS,
  getCompanyRoleLabel,
  WorkerDetailSchema,
  WorkerAssignmentSchema,
  WorkerInputSchema,
  ListWorkerAssignmentsResponseSchema,
  CreateWorkerAssignmentRequestSchema,
  CreateWorkerAssignmentResponseSchema,
  UpdateWorkerAssignmentRequestSchema,
  UpdateWorkerAssignmentResponseSchema,
};

export type {
  CompanyRole,
  WorkerDetail,
  WorkerAssignment,
  WorkerInput,
  ListWorkerAssignmentsResponse,
  CreateWorkerAssignmentRequest,
  CreateWorkerAssignmentResponse,
  UpdateWorkerAssignmentRequest,
  UpdateWorkerAssignmentResponse,
};
