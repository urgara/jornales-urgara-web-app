import { DYNNAMIX_API } from '@/config';
import type { Admin } from '../-models';
import { CreateAdminApiSchema, type CreateAdminRequest } from '../-models';

export const createAdmin = async (data: CreateAdminRequest): Promise<Admin> => {
  // Strip automáticamente remueve confirmPassword y otros campos no definidos
  const apiData = CreateAdminApiSchema.strip().parse(data);

  const response = await DYNNAMIX_API.post<Admin>('/auth/admins', apiData);
  return response.data;
};
