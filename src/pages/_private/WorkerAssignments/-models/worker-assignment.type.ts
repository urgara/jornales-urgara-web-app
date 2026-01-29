import { z } from 'zod/v4';
import {
	ResponseGenericIncludeDataAndPaginationSchema,
	ResponseGenericIncludeDataSchema,
} from '@/models';

// Regex para validar formato YYYY-MM-DD
const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Worker Assignment Schema (permisivo para respuestas del servidor)
const WorkerAssignmentSchema = z.object({
	id: z.string().uuid(),
	workerId: z.string().uuid(),
	workShiftId: z.string().uuid(),
	date: z.string(),
	additionalPercent: z.string().nullable(),
	totalAmount: z.string(),
	createdAt: z.string(),
});

// List Worker Assignments Schema
const ListWorkerAssignmentsSchema = z.array(WorkerAssignmentSchema);
const ListWorkerAssignmentsResponseSchema = ResponseGenericIncludeDataAndPaginationSchema(
	ListWorkerAssignmentsSchema
);

// Get Worker Assignment Schema
const GetWorkerAssignmentResponseSchema = ResponseGenericIncludeDataSchema(WorkerAssignmentSchema);

// Create Worker Assignment Schema
const CreateWorkerAssignmentRequestSchema = z.object({
	workerId: z.string().uuid('El ID del trabajador debe ser un UUID válido'),
	workShiftId: z.string().uuid('El ID del turno debe ser un UUID válido'),
	date: z.string().regex(DATE_FORMAT_REGEX, 'El formato debe ser YYYY-MM-DD'),
	additionalPercent: z
		.union([
			z.string().regex(/^\d+(\.\d{1,2})?$/, 'El formato debe ser decimal con hasta 2 decimales'),
			z.literal(''),
		])
		.optional(),
});

const CreateWorkerAssignmentResponseSchema =
	ResponseGenericIncludeDataSchema(WorkerAssignmentSchema);

// Update Worker Assignment Schema
const UpdateWorkerAssignmentRequestSchema = z.object({
	workerId: z.string().uuid('El ID del trabajador debe ser un UUID válido').optional(),
	workShiftId: z.string().uuid('El ID del turno debe ser un UUID válido').optional(),
	date: z.string().regex(DATE_FORMAT_REGEX, 'El formato debe ser YYYY-MM-DD').optional(),
	additionalPercent: z
		.union([
			z.string().regex(/^\d+(\.\d{1,2})?$/, 'El formato debe ser decimal con hasta 2 decimales'),
			z.literal(''),
		])
		.optional(),
});

const UpdateWorkerAssignmentResponseSchema =
	ResponseGenericIncludeDataSchema(WorkerAssignmentSchema);

type WorkerAssignment = z.infer<typeof WorkerAssignmentSchema>;
type ListWorkerAssignmentsResponse = z.infer<typeof ListWorkerAssignmentsResponseSchema>;
type GetWorkerAssignmentResponse = z.infer<typeof GetWorkerAssignmentResponseSchema>;
type CreateWorkerAssignmentRequest = z.infer<typeof CreateWorkerAssignmentRequestSchema>;
type CreateWorkerAssignmentResponse = z.infer<typeof CreateWorkerAssignmentResponseSchema>;
type UpdateWorkerAssignmentRequest = z.infer<typeof UpdateWorkerAssignmentRequestSchema>;
type UpdateWorkerAssignmentResponse = z.infer<typeof UpdateWorkerAssignmentResponseSchema>;

export {
	WorkerAssignmentSchema,
	ListWorkerAssignmentsResponseSchema,
	GetWorkerAssignmentResponseSchema,
	CreateWorkerAssignmentRequestSchema,
	CreateWorkerAssignmentResponseSchema,
	UpdateWorkerAssignmentRequestSchema,
	UpdateWorkerAssignmentResponseSchema,
};

export type {
	WorkerAssignment,
	ListWorkerAssignmentsResponse,
	GetWorkerAssignmentResponse,
	CreateWorkerAssignmentRequest,
	CreateWorkerAssignmentResponse,
	UpdateWorkerAssignmentRequest,
	UpdateWorkerAssignmentResponse,
};
