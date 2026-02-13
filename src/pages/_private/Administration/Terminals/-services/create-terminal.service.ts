import { DYNNAMIX_API } from '@/config';

export async function createTerminal(data: {
  name: string;
  localityId?: string;
}): Promise<void> {
  await DYNNAMIX_API.post('/terminals', data);
}
