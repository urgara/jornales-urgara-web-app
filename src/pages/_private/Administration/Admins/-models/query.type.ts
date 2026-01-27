import { z } from 'zod/v4';
import { GenericQueryParamsSchema } from '@/models';
import { AdminSchema } from './admin.type';

// Query Schema
const AdminSortBySchema = z.enum(
  Object.keys(AdminSchema.shape) as [
    keyof typeof AdminSchema.shape,
    ...Array<keyof typeof AdminSchema.shape>,
  ]
);
const AdminsQueryParamsSchema = GenericQueryParamsSchema(AdminSortBySchema).extend({
  name: z.string().optional(),
  surname: z.string().optional(),
  dni: z.string().optional(),
  role: z.string().optional(),
});

type AdminsQueryParams = z.infer<typeof AdminsQueryParamsSchema>;
type AdminSortBy = z.infer<typeof AdminSortBySchema>;

export { AdminsQueryParamsSchema };
export type { AdminSortBy, AdminsQueryParams };
