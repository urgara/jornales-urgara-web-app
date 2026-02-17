import { DYNNAMIX_API } from '@/config';
import type { ListShipsResponse, ShipsQueryParams } from '../-models';
import { ListShipsResponseSchema } from '../-models';

export async function getShips(params: ShipsQueryParams): Promise<ListShipsResponse> {
  const response = await DYNNAMIX_API.get('/ships', { params });
  return ListShipsResponseSchema.parse(response.data);
}
