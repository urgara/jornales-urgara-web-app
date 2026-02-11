import { DYNNAMIX_API } from '@/config';
import { type CountResponse, CountResponseSchema } from '@/models';

// Companies Count (no requiere localityId)
export async function getCompaniesCountService() {
  const { data } = await DYNNAMIX_API.get<CountResponse>('/companies/count');
  return CountResponseSchema.parse(data);
}

// Agencies Count (no requiere localityId)
export async function getAgenciesCountService() {
  const { data } = await DYNNAMIX_API.get<CountResponse>('/agencies/count');
  return CountResponseSchema.parse(data);
}

// Workers Count (requiere localityId)
export async function getWorkersCountService(localityId?: string) {
  const { data } = await DYNNAMIX_API.get<CountResponse>('/workers/count', {
    params: localityId ? { localityId } : undefined,
  });
  return CountResponseSchema.parse(data);
}

// Worker Assignments Count (requiere localityId)
export async function getWorkerAssignmentsCountService(localityId?: string) {
  const { data } = await DYNNAMIX_API.get<CountResponse>('/worker-assignments/count', {
    params: localityId ? { localityId } : undefined,
  });
  return CountResponseSchema.parse(data);
}
