import { z } from 'zod/v4';

export const GenericQueryParamsSchema = <T extends z.ZodTypeAny>(sortBySchema: T) =>
  z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    sortBy: sortBySchema.optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  });
