import { z } from 'zod/v4';
import { GenericQueryParamsSchema } from '@/models';
import { WorkShiftBaseValueSchema } from './base-value.type';

const WorkShiftBaseValueSortBySchema = z.enum(
  Object.keys(WorkShiftBaseValueSchema.shape) as [
    keyof typeof WorkShiftBaseValueSchema.shape,
    ...Array<keyof typeof WorkShiftBaseValueSchema.shape>,
  ]
);

const WorkShiftBaseValuesQueryParamsSchema = GenericQueryParamsSchema(
  WorkShiftBaseValueSortBySchema
).extend({
  localityId: z.string().uuid().optional(),
});

type WorkShiftBaseValuesQueryParams = z.infer<typeof WorkShiftBaseValuesQueryParamsSchema>;
type WorkShiftBaseValueSortBy = z.infer<typeof WorkShiftBaseValueSortBySchema>;

export { WorkShiftBaseValuesQueryParamsSchema };
export type { WorkShiftBaseValueSortBy, WorkShiftBaseValuesQueryParams };
