import { DYNNAMIX_API } from '@/config';

export async function deleteWorkShift(id: string) {
  await DYNNAMIX_API.delete(`/work-shift/${id}`);
}
