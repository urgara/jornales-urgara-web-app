import { DYNNAMIX_API } from '@/config';
import type { CreateShipRequest, CreateShipResponse } from '../-models';
import { CreateShipResponseSchema } from '../-models';

export async function createShip(data: CreateShipRequest): Promise<CreateShipResponse> {
  const response = await DYNNAMIX_API.post('/ships', data);
  return CreateShipResponseSchema.parse(response.data);
}
