import { DYNNAMIX_API } from '@/config';

export async function deleteAgency(id: string) {
	await DYNNAMIX_API.delete(`/agencies/${id}`);
}
