import { z } from 'zod/v4';
import { ResponseGenericIncludeDataSchema } from './generic-responses.type';

// Select Company Schema
const SelectCompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const ListSelectCompaniesSchema = z.array(SelectCompanySchema);
const ListSelectCompaniesResponseSchema =
  ResponseGenericIncludeDataSchema(ListSelectCompaniesSchema);

type SelectCompany = z.infer<typeof SelectCompanySchema>;
type ListSelectCompaniesResponse = z.infer<typeof ListSelectCompaniesResponseSchema>;

export { SelectCompanySchema, ListSelectCompaniesResponseSchema };
export type { SelectCompany, ListSelectCompaniesResponse };
