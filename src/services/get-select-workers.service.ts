import { DYNNAMIX_API } from '@/config';
import { type ListSelectWorkersResponse, ListSelectWorkersResponseSchema } from '@/models';

export async function getSelectWorkersService() {
	const { data } = await DYNNAMIX_API.get<ListSelectWorkersResponse>('/workers/select');
	return ListSelectWorkersResponseSchema.parse(data);
}
