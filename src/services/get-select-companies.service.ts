import { DYNNAMIX_API } from '@/config';
import { type ListSelectCompaniesResponse, ListSelectCompaniesResponseSchema } from '@/models';

export async function getSelectCompaniesService() {
  const { data } = await DYNNAMIX_API.get<ListSelectCompaniesResponse>('/companies/select');
  return ListSelectCompaniesResponseSchema.parse(data);
}
