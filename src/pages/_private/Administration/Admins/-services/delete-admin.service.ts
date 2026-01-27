import { DYNNAMIX_API } from '@/config';
import type { Admin } from '../-models';

export const deleteAdmin = async (id: string): Promise<Admin> => {
  const response = await DYNNAMIX_API.delete<Admin>(`/auth/admins/${id}`);
  return response.data;
};
