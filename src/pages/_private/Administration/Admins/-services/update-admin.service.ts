import { DYNNAMIX_API } from '@/config';
import type { Admin } from '../-models';
import type { UpdateAdminRequest } from '../-models';

export const updateAdmin = async (id: string, data: UpdateAdminRequest): Promise<Admin> => {
  const response = await DYNNAMIX_API.patch<Admin>(`/auth/admins/${id}`, data);
  return response.data;
};
