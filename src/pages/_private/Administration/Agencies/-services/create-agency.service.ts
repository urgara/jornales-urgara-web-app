import { DYNNAMIX_API } from '@/config';
import type { CreateAgencyRequest, CreateAgencyResponse } from '../-models';
import { CreateAgencyResponseSchema } from '../-models';

export async function createAgency(data: CreateAgencyRequest): Promise<CreateAgencyResponse> {
  const response = await DYNNAMIX_API.post('/agencies', data);
  return CreateAgencyResponseSchema.parse(response.data);
}
