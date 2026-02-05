import { DYNNAMIX_API } from '@/config';
import type { AgenciesQueryParams, ListAgenciesResponse } from '../-models';
import { ListAgenciesResponseSchema } from '../-models';

export async function getAgencies(params: AgenciesQueryParams): Promise<ListAgenciesResponse> {
	const response = await DYNNAMIX_API.get('/agencies', { params });
	return ListAgenciesResponseSchema.parse(response.data);
}
