import { DYNNAMIX_API } from '@/config';
import type {
  CreateWorkShiftBaseValueRequest,
  CreateWorkShiftBaseValueResponse,
} from '../-models';
import { CreateWorkShiftBaseValueResponseSchema } from '../-models';

export async function createBaseValue(
  baseValue: CreateWorkShiftBaseValueRequest & { localityId?: string }
) {
  const { data } = await DYNNAMIX_API.post<CreateWorkShiftBaseValueResponse>(
    '/work-shift-base-values',
    baseValue
  );
  return CreateWorkShiftBaseValueResponseSchema.parse(data);
}
