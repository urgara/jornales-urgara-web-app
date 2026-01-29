import { DYNNAMIX_API } from '@/config';
import type {
	CreateWorkerRequest,
	CreateWorkerResponse,
	GetWorkerResponse,
	ListWorkersResponse,
	UpdateWorkerRequest,
	UpdateWorkerResponse,
	WorkersQueryParams,
} from '../-models';
import {
	CreateWorkerResponseSchema,
	GetWorkerResponseSchema,
	ListWorkersResponseSchema,
	UpdateWorkerResponseSchema,
} from '../-models';

const BASE_URL = '/workers';

export const workerService = {
	getWorkers: async (params: WorkersQueryParams): Promise<ListWorkersResponse> => {
		const { data } = await DYNNAMIX_API.get<ListWorkersResponse>(BASE_URL, { params });
		return ListWorkersResponseSchema.parse(data);
	},

	getWorkerById: async (id: string): Promise<GetWorkerResponse> => {
		const { data } = await DYNNAMIX_API.get<GetWorkerResponse>(`${BASE_URL}/${id}`);
		return GetWorkerResponseSchema.parse(data);
	},

	createWorker: async (worker: CreateWorkerRequest): Promise<CreateWorkerResponse> => {
		const { data } = await DYNNAMIX_API.post<CreateWorkerResponse>(BASE_URL, worker);
		return CreateWorkerResponseSchema.parse(data);
	},

	updateWorker: async (id: string, worker: UpdateWorkerRequest): Promise<UpdateWorkerResponse> => {
		const { data } = await DYNNAMIX_API.patch<UpdateWorkerResponse>(`${BASE_URL}/${id}`, worker);
		return UpdateWorkerResponseSchema.parse(data);
	},

	deleteWorker: async (id: string): Promise<void> => {
		await DYNNAMIX_API.delete(`${BASE_URL}/${id}`);
	},
};
