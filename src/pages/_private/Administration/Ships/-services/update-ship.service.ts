import { DYNNAMIX_API } from '@/config';
import type { UpdateShipRequest, UpdateShipResponse } from '../-models';
import { UpdateShipResponseSchema } from '../-models';

export async function updateShip(
  id: string,
  data: UpdateShipRequest
): Promise<UpdateShipResponse> {
  const response = await DYNNAMIX_API.patch(`/ships/${id}`, data);
  return UpdateShipResponseSchema.parse(response.data);
}
