import { DYNNAMIX_API } from '@/config';
import type { CreateWorkShiftRequest, CreateWorkShiftResponse } from '../-models';
import { CreateWorkShiftResponseSchema } from '../-models';

export async function createWorkShift(workShift: CreateWorkShiftRequest & { localityId?: string }) {
  const { data } = await DYNNAMIX_API.post<CreateWorkShiftResponse>('/work-shifts', workShift);
  return CreateWorkShiftResponseSchema.parse(data);
}
