import { DYNNAMIX_API } from '@/config';

export async function deleteShip(id: string) {
  await DYNNAMIX_API.delete(`/ships/${id}`);
}
