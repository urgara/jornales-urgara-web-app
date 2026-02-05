import { DYNNAMIX_API } from '@/config';
import { type ListSelectWorkersResponse, ListSelectWorkersResponseSchema } from '@/models';

interface SelectWorkersParams {
	localityId?: string;
}

export async function getSelectWorkersService(params?: SelectWorkersParams) {
	const { data } = await DYNNAMIX_API.get<ListSelectWorkersResponse>('/workers/select', { params });
	return ListSelectWorkersResponseSchema.parse(data);
}
