import { DYNNAMIX_API } from '@/config';

export async function deleteBaseValue(id: string, localityId?: string) {
  await DYNNAMIX_API.delete(`/work-shift-base-values/${id}`, { data: { localityId } });
}
