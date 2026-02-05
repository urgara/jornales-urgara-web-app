import { DYNNAMIX_API } from '@/config';

export async function deleteCompany(id: string) {
  await DYNNAMIX_API.delete(`/companies/${id}`);
}
