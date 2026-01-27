import { DYNNAMIX_API } from '@/config';

export async function deleteCompany(id: number) {
  await DYNNAMIX_API.delete(`/companies/${id}`);
}
