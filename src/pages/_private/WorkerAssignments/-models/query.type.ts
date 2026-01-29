import { z } from 'zod/v4';
import { GenericQueryParamsSchema } from '@/models';
import { WorkerAssignmentSchema } from './worker-assignment.type';

const WorkerAssignmentSortBySchema = z.enum(
	Object.keys(WorkerAssignmentSchema.shape) as [
		keyof typeof WorkerAssignmentSchema.shape,
		...Array<keyof typeof WorkerAssignmentSchema.shape>,
	]
);

const WorkerAssignmentsQueryParamsSchema = GenericQueryParamsSchema(
	WorkerAssignmentSortBySchema
).extend({
	workerId: z.string().uuid().optional(),
	workShiftId: z.string().uuid().optional(),
	dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

type WorkerAssignmentSortBy = z.infer<typeof WorkerAssignmentSortBySchema>;
type WorkerAssignmentsQueryParams = z.infer<typeof WorkerAssignmentsQueryParamsSchema>;

export { WorkerAssignmentsQueryParamsSchema, WorkerAssignmentSortBySchema };
export type { WorkerAssignmentsQueryParams, WorkerAssignmentSortBy };
