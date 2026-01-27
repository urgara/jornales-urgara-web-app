import { z } from 'zod/v4';
import { GenericQueryParamsSchema } from '@/models';
import { CompanySchema } from './company.type';

// Query Schema
const CompanySortBySchema = z.enum(
  Object.keys(CompanySchema.shape) as [
    keyof typeof CompanySchema.shape,
    ...Array<keyof typeof CompanySchema.shape>,
  ]
);
const CompaniesQueryParamsSchema = GenericQueryParamsSchema(CompanySortBySchema).extend({
  name: z.string().optional(),
  cuit: z.string().optional(),
  legalEntityId: z.number().optional(),
});

type CompaniesQueryParams = z.infer<typeof CompaniesQueryParamsSchema>;
type CompanySortBy = z.infer<typeof CompanySortBySchema>;

export { CompaniesQueryParamsSchema };
export type { CompanySortBy, CompaniesQueryParams };
