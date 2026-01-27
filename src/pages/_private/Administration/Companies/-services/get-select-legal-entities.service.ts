import { DYNNAMIX_API } from '@/config';
import type { ListSelectLegalEntitiesResponse } from '../-models';
import { ListSelectLegalEntitiesResponseSchema } from '../-models';

export async function getSelectLegalEntities() {
  const { data } = await DYNNAMIX_API.get<ListSelectLegalEntitiesResponse>('/legal-entities/select');
  return ListSelectLegalEntitiesResponseSchema.parse(data);
}
