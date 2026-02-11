import { z } from 'zod/v4';
import { DYNNAMIX_API } from '@/config';
import { ResponseGenericIncludeDataSchema } from '@/models';

const SelectAgencySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const ListSelectAgenciesSchema = z.array(SelectAgencySchema);
const ListSelectAgenciesResponseSchema = ResponseGenericIncludeDataSchema(ListSelectAgenciesSchema);

type SelectAgency = z.infer<typeof SelectAgencySchema>;
type ListSelectAgenciesResponse = z.infer<typeof ListSelectAgenciesResponseSchema>;

export async function getSelectAgencies(): Promise<ListSelectAgenciesResponse> {
  const response = await DYNNAMIX_API.get('/agencies/select');
  return ListSelectAgenciesResponseSchema.parse(response.data);
}

export type { SelectAgency, ListSelectAgenciesResponse };
