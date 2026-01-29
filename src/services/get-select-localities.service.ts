import { DYNNAMIX_API } from '@/config';
import { type ListSelectLocalitiesResponse, ListSelectLocalitiesResponseSchema } from '@/models';

export async function getSelectLocalitiesService() {
  const { data } = await DYNNAMIX_API.get<ListSelectLocalitiesResponse>('/localities/select');
  return ListSelectLocalitiesResponseSchema.parse(data);
}
