import { DYNNAMIX_API } from '@/config';
import { type ListSelectWorkShiftsResponse, ListSelectWorkShiftsResponseSchema } from '@/models';

interface SelectWorkShiftsParams {
	localityId?: string;
}

export async function getSelectWorkShiftsService(params?: SelectWorkShiftsParams) {
	const { data } = await DYNNAMIX_API.get<ListSelectWorkShiftsResponse>('/work-shifts/select', {
		params,
	});
	return ListSelectWorkShiftsResponseSchema.parse(data);
}
