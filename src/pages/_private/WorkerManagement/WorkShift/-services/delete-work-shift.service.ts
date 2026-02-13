import { DYNNAMIX_API } from '@/config';

export async function deleteWorkShift(id: string, localityId?: string) {
  await DYNNAMIX_API.delete(`/work-shifts/${id}`, { data: { localityId } });
}
