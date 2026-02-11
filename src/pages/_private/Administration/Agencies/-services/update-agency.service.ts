import { DYNNAMIX_API } from '@/config';
import type { UpdateAgencyRequest, UpdateAgencyResponse } from '../-models';
import { UpdateAgencyResponseSchema } from '../-models';

export async function updateAgency(
  id: string,
  data: UpdateAgencyRequest
): Promise<UpdateAgencyResponse> {
  const response = await DYNNAMIX_API.patch(`/agencies/${id}`, data);
  return UpdateAgencyResponseSchema.parse(response.data);
}
