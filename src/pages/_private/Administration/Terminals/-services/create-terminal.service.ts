import { DYNNAMIX_API } from '@/config';
import type { CreateTerminalRequest } from '../-models';

export async function createTerminal(
  data: CreateTerminalRequest,
  localityId?: string
): Promise<void> {
  const body = localityId ? { ...data, localityId } : data;
  await DYNNAMIX_API.post('/terminals', body);
}
