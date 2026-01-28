import { z } from 'zod/v4';
import { GenericQueryParamsSchema } from '@/models';
import { WorkShiftSchema } from './work-shift.type';

// Query Schema
const WorkShiftSortBySchema = z.enum(
  Object.keys(WorkShiftSchema.shape) as [
    keyof typeof WorkShiftSchema.shape,
    ...Array<keyof typeof WorkShiftSchema.shape>,
  ]
);
const WorkShiftsQueryParamsSchema = GenericQueryParamsSchema(WorkShiftSortBySchema).extend({
  description: z.string().optional(),
});

type WorkShiftsQueryParams = z.infer<typeof WorkShiftsQueryParamsSchema>;
type WorkShiftSortBy = z.infer<typeof WorkShiftSortBySchema>;

export { WorkShiftsQueryParamsSchema };
export type { WorkShiftSortBy, WorkShiftsQueryParams };
