import { DYNNAMIX_API } from '@/config';
import { type ListSelectWorkShiftsResponse, ListSelectWorkShiftsResponseSchema } from '@/models';

export async function getSelectWorkShiftsService() {
	const { data } = await DYNNAMIX_API.get<ListSelectWorkShiftsResponse>('/work-shifts/select');
	return ListSelectWorkShiftsResponseSchema.parse(data);
}
