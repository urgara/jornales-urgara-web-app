import { z } from 'zod/v4';
import { GenericQueryParamsSchema } from '@/models';
import { LocalitySchema } from './locality.type';

// Query Schema
const LocalitySortBySchema = z.enum(
  Object.keys(LocalitySchema.shape) as [
    keyof typeof LocalitySchema.shape,
    ...Array<keyof typeof LocalitySchema.shape>,
  ]
);
const LocalitiesQueryParamsSchema = GenericQueryParamsSchema(LocalitySortBySchema).extend({
  name: z.string().optional(),
  province: z.string().optional(),
  isActive: z.string().optional(),
});

type LocalitiesQueryParams = z.infer<typeof LocalitiesQueryParamsSchema>;
type LocalitySortBy = z.infer<typeof LocalitySortBySchema>;

export { LocalitiesQueryParamsSchema };
export type { LocalitySortBy, LocalitiesQueryParams };
