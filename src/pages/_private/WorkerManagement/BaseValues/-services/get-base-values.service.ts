import { DYNNAMIX_API } from '@/config';
import type { ListWorkShiftBaseValuesResponse, WorkShiftBaseValuesQueryParams } from '../-models';
import { ListWorkShiftBaseValuesResponseSchema } from '../-models';

export async function getBaseValues(params: WorkShiftBaseValuesQueryParams) {
  const { data } = await DYNNAMIX_API.get<ListWorkShiftBaseValuesResponse>(
    '/work-shift-base-values',
    { params }
  );
  return ListWorkShiftBaseValuesResponseSchema.parse(data);
}
