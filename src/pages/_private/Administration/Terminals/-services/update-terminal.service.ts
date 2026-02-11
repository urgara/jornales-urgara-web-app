import { DYNNAMIX_API } from '@/config';
import type { UpdateTerminalRequest } from '../-models';

export async function updateTerminal(
  id: string,
  data: UpdateTerminalRequest,
  localityId?: string
): Promise<void> {
  const body = localityId ? { ...data, localityId } : data;
  await DYNNAMIX_API.patch(`/terminals/${id}`, body);
}
