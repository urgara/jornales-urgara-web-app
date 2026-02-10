import { z } from 'zod/v4';
import {
	ResponseGenericIncludeDataAndPaginationSchema,
	ResponseGenericIncludeDataSchema,
	WorkerCategorySchema,
} from '@/models';

// Worker Schema
const WorkerSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no debe exceder 100 caracteres'),
	surname: z
		.string()
		.min(1, 'El apellido es requerido')
		.max(100, 'El apellido no debe exceder 100 caracteres'),
	dni: z
		.string()
		.min(7, 'El DNI debe tener al menos 7 caracteres')
		.max(10, 'El DNI no debe exceder 10 caracteres'),
	category: WorkerCategorySchema,
	localityId: z.string().uuid(),
	baseHourlyRate: z.string().regex(/^\d+(\.\d{1,2})?$/, 'El formato debe ser decimal con hasta 2 decimales'),
	createdAt: z.iso.datetime(),
	deletedAt: z.iso.datetime().nullable(),
});

// List Workers Schema
const ListWorkersSchema = z.array(WorkerSchema);
const ListWorkersResponseSchema = ResponseGenericIncludeDataAndPaginationSchema(ListWorkersSchema);

// Get Worker Schema
const GetWorkerResponseSchema = ResponseGenericIncludeDataSchema(WorkerSchema);

// Create Worker Schema
const CreateWorkerRequestSchema = z.object({
	name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no debe exceder 100 caracteres'),
	surname: z
		.string()
		.min(1, 'El apellido es requerido')
		.max(100, 'El apellido no debe exceder 100 caracteres'),
	dni: z
		.string()
		.min(7, 'El DNI debe tener al menos 7 caracteres')
		.max(10, 'El DNI no debe exceder 10 caracteres'),
	category: WorkerCategorySchema,
	localityId: z.string().uuid(),
	baseHourlyRate: z.string().regex(/^\d+(\.\d{1,2})?$/, 'El formato debe ser decimal con hasta 2 decimales'),
});

const CreateWorkerResponseSchema = ResponseGenericIncludeDataSchema(WorkerSchema);

// Update Worker Schema
const UpdateWorkerRequestSchema = z.object({
	name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no debe exceder 100 caracteres').optional(),
	surname: z
		.string()
		.min(1, 'El apellido es requerido')
		.max(100, 'El apellido no debe exceder 100 caracteres')
		.optional(),
	dni: z
		.string()
		.min(7, 'El DNI debe tener al menos 7 caracteres')
		.max(10, 'El DNI no debe exceder 10 caracteres')
		.optional(),
	category: WorkerCategorySchema.optional(),
	localityId: z.string().uuid().optional(),
	baseHourlyRate: z.string().regex(/^\d+(\.\d{1,2})?$/, 'El formato debe ser decimal con hasta 2 decimales').optional(),
});

const UpdateWorkerResponseSchema = ResponseGenericIncludeDataSchema(WorkerSchema);

type Worker = z.infer<typeof WorkerSchema>;
type ListWorkersResponse = z.infer<typeof ListWorkersResponseSchema>;
type GetWorkerResponse = z.infer<typeof GetWorkerResponseSchema>;
type CreateWorkerRequest = z.infer<typeof CreateWorkerRequestSchema>;
type CreateWorkerResponse = z.infer<typeof CreateWorkerResponseSchema>;
type UpdateWorkerRequest = z.infer<typeof UpdateWorkerRequestSchema>;
type UpdateWorkerResponse = z.infer<typeof UpdateWorkerResponseSchema>;

export {
	WorkerSchema,
	ListWorkersResponseSchema,
	GetWorkerResponseSchema,
	CreateWorkerRequestSchema,
	CreateWorkerResponseSchema,
	UpdateWorkerRequestSchema,
	UpdateWorkerResponseSchema,
};

export type {
	Worker,
	ListWorkersResponse,
	GetWorkerResponse,
	CreateWorkerRequest,
	CreateWorkerResponse,
	UpdateWorkerRequest,
	UpdateWorkerResponse,
};
