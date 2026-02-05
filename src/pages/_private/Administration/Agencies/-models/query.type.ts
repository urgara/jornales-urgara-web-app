import { z } from 'zod/v4';
import { GenericQueryParamsSchema } from '@/models';
import { AgencySchema } from './agency.type';

const AgencySortBySchema = z.enum(
	Object.keys(AgencySchema.shape).filter(key =>
		['id', 'name', 'createdAt'].includes(key)
	) as [keyof typeof AgencySchema.shape, ...Array<keyof typeof AgencySchema.shape>]
);

const AgenciesQueryParamsSchema = GenericQueryParamsSchema(AgencySortBySchema).extend({
	name: z.string().optional(),
});

type AgencySortBy = z.infer<typeof AgencySortBySchema>;
type AgenciesQueryParams = z.infer<typeof AgenciesQueryParamsSchema>;

export { AgencySortBySchema, AgenciesQueryParamsSchema };
export type { AgencySortBy, AgenciesQueryParams };
