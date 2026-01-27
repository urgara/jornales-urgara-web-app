import { DYNNAMIX_API } from '@/config';
import {
  type ListSelectLocalitiesResponse,
  ListSelectLocalitiesResponseSchema,
} from '@/pages/_private/Administration/Localities/-models';

export async function getSelectLocalitiesService() {
  const { data } = await DYNNAMIX_API.get<ListSelectLocalitiesResponse>('/locality/select');
  return ListSelectLocalitiesResponseSchema.parse(data);
}
