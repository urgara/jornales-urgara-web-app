import { DYNNAMIX_API } from '@/config';
import type { ListWorkShiftsResponse, WorkShiftsQueryParams } from '../-models';
import { ListWorkShiftsResponseSchema } from '../-models';

export async function getWorkShifts(params: WorkShiftsQueryParams) {
  const { data } = await DYNNAMIX_API.get<ListWorkShiftsResponse>('/work-shifts', { params });
  return ListWorkShiftsResponseSchema.parse(data);
}
