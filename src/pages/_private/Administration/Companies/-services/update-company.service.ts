import { DYNNAMIX_API } from '@/config';
import type { UpdateCompanyRequest, UpdateCompanyResponse } from '../-models';
import { UpdateCompanyResponseSchema } from '../-models';

export async function updateCompany(id: number, company: UpdateCompanyRequest) {
  const { data } = await DYNNAMIX_API.patch<UpdateCompanyResponse>(`/companies/${id}`, company);
  return UpdateCompanyResponseSchema.parse(data);
}
