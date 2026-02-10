import { DYNNAMIX_API } from '@/config';
import {
	type ListSelectBaseValuesResponse,
	ListSelectBaseValuesResponseSchema,
	type SelectBaseValueParams,
} from '../-models';

export async function getSelectBaseValuesService(
	params: SelectBaseValueParams
): Promise<ListSelectBaseValuesResponse> {
	const { data } = await DYNNAMIX_API.get<ListSelectBaseValuesResponse>(
		'/work-shift-base-values/select',
		{ params }
	);
	return ListSelectBaseValuesResponseSchema.parse(data);
}
