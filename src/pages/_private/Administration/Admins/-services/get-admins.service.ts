import { DYNNAMIX_API } from '@/config';
import {
  type AdminsQueryParams,
  type ListAdminsResponse,
  ListAdminsResponseSchema,
} from '../-models';

export async function getAdminsService(params: AdminsQueryParams = {}) {
  const { data } = await DYNNAMIX_API.get<ListAdminsResponse>('/auth/admins', {
    params,
  });
  return ListAdminsResponseSchema.parse(data);
}
