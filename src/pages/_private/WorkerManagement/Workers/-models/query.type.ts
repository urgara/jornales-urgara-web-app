import { z } from 'zod/v4';
import { GenericQueryParamsSchema } from '@/models';
import { WorkerSchema } from './worker.type';

const WorkerSortBySchema = z.enum(
	Object.keys(WorkerSchema.shape) as [keyof typeof WorkerSchema.shape, ...Array<keyof typeof WorkerSchema.shape>]
);

const WorkersQueryParamsSchema = GenericQueryParamsSchema(WorkerSortBySchema).extend({
	name: z.string().optional(),
	surname: z.string().optional(),
	dni: z.string().optional(),
	localityId: z.string().uuid().optional(),
});

type WorkerSortBy = z.infer<typeof WorkerSortBySchema>;
type WorkersQueryParams = z.infer<typeof WorkersQueryParamsSchema>;

export { WorkersQueryParamsSchema, WorkerSortBySchema };
export type { WorkersQueryParams, WorkerSortBy };
