import { DYNNAMIX_API } from '@/config';
import type { CreateCompanyRequest, CreateCompanyResponse } from '../-models';
import { CreateCompanyResponseSchema } from '../-models';

export async function createCompany(company: CreateCompanyRequest) {
  const { data } = await DYNNAMIX_API.post<CreateCompanyResponse>('/companies', company);
  return CreateCompanyResponseSchema.parse(data);
}
