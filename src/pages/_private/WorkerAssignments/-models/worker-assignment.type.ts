import { z } from 'zod/v4';
import {
	ResponseGenericIncludeDataAndPaginationSchema,
	ResponseGenericIncludeDataSchema,
	WorkerCategorySchema,
} from '@/models';

// Regex para validar formato YYYY-MM-DD
const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Enums
const DayOfWeekEnum = z.enum(['M', 'T', 'W', 'Th', 'F', 'S', 'Su']);

// Worker Schema (para relaciones)
const WorkerRelationSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	surname: z.string(),
	dni: z.string(),
	localityId: z.string().uuid(),
	category: WorkerCategorySchema,
	createdAt: z.coerce.date(),
	deletedAt: z.coerce.date().nullable(),
});

// WorkShift Schema (para relaciones)
const WorkShiftRelationSchema = z.object({
	id: z.string().uuid(),
	days: z.array(DayOfWeekEnum),
	startTime: z.string().nullable(),
	endTime: z.string().nullable(),
	durationMinutes: z.number(),
	description: z.string().nullable(),
	coefficient: z.string(),
	createdAt: z.coerce.date(),
	deletedAt: z.coerce.date().nullable(),
});

// Worker Assignment Schema (permisivo para respuestas del servidor)
const WorkerAssignmentSchema = z.object({
	id: z.string().uuid(),
	workerId: z.string().uuid(),
	workShiftId: z.string().uuid(),
	date: z.string(),
	category: WorkerCategorySchema,
	workShiftBaseValueId: z.string().uuid(),
	coefficient: z.string(),
	baseValue: z.string(),
	additionalPercent: z.string().nullable(),
	totalAmount: z.string(),
	companyId: z.string().uuid(),
	localityId: z.string().uuid(),
	agencyId: z.string().uuid(),
	terminalId: z.string().uuid(),
	productId: z.string().uuid(),
	createdAt: z.string(),
});

// Worker Assignment With Relations Schema (para GET /:id)
const WorkerAssignmentWithRelationsSchema = WorkerAssignmentSchema.extend({
	Worker: WorkerRelationSchema.optional().nullable(),
	WorkShift: WorkShiftRelationSchema.optional().nullable(),
});

// List Worker Assignments Schema
const ListWorkerAssignmentsSchema = z.array(WorkerAssignmentSchema);
const ListWorkerAssignmentsResponseSchema = ResponseGenericIncludeDataAndPaginationSchema(
	ListWorkerAssignmentsSchema
);

// Get Worker Assignment Schema (con relaciones)
const GetWorkerAssignmentResponseSchema = ResponseGenericIncludeDataSchema(
	WorkerAssignmentWithRelationsSchema
);

// Create Worker Assignment Schema
const CreateWorkerAssignmentRequestSchema = z.object({
	workerId: z.string().uuid('El ID del trabajador debe ser un UUID válido'),
	workShiftId: z.string().uuid('El ID del turno debe ser un UUID válido'),
	date: z.string().regex(DATE_FORMAT_REGEX, 'El formato debe ser YYYY-MM-DD'),
	category: WorkerCategorySchema,
	value: z.object({
		workShiftBaseValueId: z.string().uuid('El ID del valor base debe ser un UUID válido'),
		coefficient: z.string().min(1, 'El coeficiente es requerido'),
	}),
	additionalPercent: z
		.union([
			z.string().regex(/^-?\d+(\.\d{1,2})?$/, 'El formato debe ser decimal con hasta 2 decimales'),
			z.literal(''),
		])
		.optional(),
	companyId: z.string().uuid('El ID de la empresa debe ser un UUID válido'),
	localityId: z.string().uuid('El ID de la localidad debe ser un UUID válido'),
	agencyId: z.string().uuid('El ID de la agencia debe ser un UUID válido'),
	terminalId: z.string().uuid('El ID de la terminal debe ser un UUID válido'),
	productId: z.string().uuid('El ID del producto debe ser un UUID válido'),
});

const CreateWorkerAssignmentResponseSchema =
	ResponseGenericIncludeDataSchema(WorkerAssignmentSchema);

// Update Worker Assignment Schema
const UpdateWorkerAssignmentRequestSchema = z.object({
	workerId: z.string().uuid('El ID del trabajador debe ser un UUID válido').optional(),
	workShiftId: z.string().uuid('El ID del turno debe ser un UUID válido').optional(),
	date: z.string().regex(DATE_FORMAT_REGEX, 'El formato debe ser YYYY-MM-DD').optional(),
	category: WorkerCategorySchema.optional(),
	value: z
		.object({
			workShiftBaseValueId: z.string().uuid('El ID del valor base debe ser un UUID válido'),
			coefficient: z.string().min(1, 'El coeficiente es requerido'),
		})
		.optional(),
	additionalPercent: z
		.union([
			z.string().regex(/^-?\d+(\.\d{1,2})?$/, 'El formato debe ser decimal con hasta 2 decimales'),
			z.literal(''),
		])
		.optional(),
	companyId: z.string().uuid('El ID de la empresa debe ser un UUID válido').optional(),
	localityId: z.string().uuid('El ID de la localidad debe ser un UUID válido').optional(),
	agencyId: z.string().uuid('El ID de la agencia debe ser un UUID válido').optional(),
	terminalId: z.string().uuid('El ID de la terminal debe ser un UUID válido').optional(),
	productId: z.string().uuid('El ID del producto debe ser un UUID válido').optional(),
});

const UpdateWorkerAssignmentResponseSchema =
	ResponseGenericIncludeDataSchema(WorkerAssignmentSchema);

type DayOfWeek = z.infer<typeof DayOfWeekEnum>;
type WorkerRelation = z.infer<typeof WorkerRelationSchema>;
type WorkShiftRelation = z.infer<typeof WorkShiftRelationSchema>;
type WorkerAssignment = z.infer<typeof WorkerAssignmentSchema>;
type WorkerAssignmentWithRelations = z.infer<typeof WorkerAssignmentWithRelationsSchema>;
type ListWorkerAssignmentsResponse = z.infer<typeof ListWorkerAssignmentsResponseSchema>;
type GetWorkerAssignmentResponse = z.infer<typeof GetWorkerAssignmentResponseSchema>;
type CreateWorkerAssignmentRequest = z.infer<typeof CreateWorkerAssignmentRequestSchema>;
type CreateWorkerAssignmentResponse = z.infer<typeof CreateWorkerAssignmentResponseSchema>;
type UpdateWorkerAssignmentRequest = z.infer<typeof UpdateWorkerAssignmentRequestSchema>;
type UpdateWorkerAssignmentResponse = z.infer<typeof UpdateWorkerAssignmentResponseSchema>;

export {
	DayOfWeekEnum,
	WorkerRelationSchema,
	WorkShiftRelationSchema,
	WorkerAssignmentSchema,
	WorkerAssignmentWithRelationsSchema,
	ListWorkerAssignmentsResponseSchema,
	GetWorkerAssignmentResponseSchema,
	CreateWorkerAssignmentRequestSchema,
	CreateWorkerAssignmentResponseSchema,
	UpdateWorkerAssignmentRequestSchema,
	UpdateWorkerAssignmentResponseSchema,
};

export type {
	DayOfWeek,
	WorkerRelation,
	WorkShiftRelation,
	WorkerAssignment,
	WorkerAssignmentWithRelations,
	ListWorkerAssignmentsResponse,
	GetWorkerAssignmentResponse,
	CreateWorkerAssignmentRequest,
	CreateWorkerAssignmentResponse,
	UpdateWorkerAssignmentRequest,
	UpdateWorkerAssignmentResponse,
};
