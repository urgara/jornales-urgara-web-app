import { DYNNAMIX_API } from '@/config';
import {
  type ListTerminalsResponse,
  ListTerminalsResponseSchema,
  type TerminalsQueryParams,
} from '../-models';

export async function getTerminals(params: TerminalsQueryParams): Promise<ListTerminalsResponse> {
  const response = await DYNNAMIX_API.get('/terminals', { params });
  return ListTerminalsResponseSchema.parse(response.data);
}
