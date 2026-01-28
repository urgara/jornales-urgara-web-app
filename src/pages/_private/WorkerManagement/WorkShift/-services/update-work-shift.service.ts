import { DYNNAMIX_API } from '@/config';
import type { UpdateWorkShiftRequest, UpdateWorkShiftResponse } from '../-models';
import { UpdateWorkShiftResponseSchema } from '../-models';

export async function updateWorkShift(id: string, workShift: UpdateWorkShiftRequest) {
  const { data } = await DYNNAMIX_API.patch<UpdateWorkShiftResponse>(
    `/work-shifts/${id}`,
    workShift
  );
  return UpdateWorkShiftResponseSchema.parse(data);
}
