import { DYNNAMIX_API } from '@/config';

export async function deleteTerminal(id: string, localityId?: string): Promise<void> {
	const body = localityId ? { localityId } : undefined;
	await DYNNAMIX_API.delete(`/terminals/${id}`, { data: body });
}
