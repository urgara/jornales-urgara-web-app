import { DYNNAMIX_API } from '@/config';
import type { CompaniesQueryParams, ListCompaniesResponse } from '../-models';
import { ListCompaniesResponseSchema } from '../-models';

export async function getCompanies(params: CompaniesQueryParams) {
  const { data } = await DYNNAMIX_API.get<ListCompaniesResponse>('/companies', { params });
  return ListCompaniesResponseSchema.parse(data);
}
