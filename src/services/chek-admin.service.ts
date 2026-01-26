import { DYNNAMIX_API } from '@/config';
import { type CheckAdminResponse, CheckAdminResponseSchema } from '@/models';

export async function chekAdminService() {
  const { data } = await DYNNAMIX_API.get<CheckAdminResponse>('/auth/admin');
  return CheckAdminResponseSchema.parse(data);
}
