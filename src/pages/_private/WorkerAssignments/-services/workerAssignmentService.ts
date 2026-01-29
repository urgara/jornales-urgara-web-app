import { DYNNAMIX_API } from '@/config';
import type {
	CreateWorkerAssignmentRequest,
	CreateWorkerAssignmentResponse,
	GetWorkerAssignmentResponse,
	ListWorkerAssignmentsResponse,
	UpdateWorkerAssignmentRequest,
	UpdateWorkerAssignmentResponse,
	WorkerAssignmentsQueryParams,
} from '../-models';
import {
	CreateWorkerAssignmentResponseSchema,
	GetWorkerAssignmentResponseSchema,
	ListWorkerAssignmentsResponseSchema,
	UpdateWorkerAssignmentResponseSchema,
} from '../-models';

const BASE_URL = '/worker-assignments';

export const workerAssignmentService = {
	getWorkerAssignments: async (
		params: WorkerAssignmentsQueryParams
	): Promise<ListWorkerAssignmentsResponse> => {
		const { data } = await DYNNAMIX_API.get<ListWorkerAssignmentsResponse>(BASE_URL, {
			params,
		});
		return ListWorkerAssignmentsResponseSchema.parse(data);
	},

	getWorkerAssignmentById: async (id: string): Promise<GetWorkerAssignmentResponse> => {
		const { data } = await DYNNAMIX_API.get<GetWorkerAssignmentResponse>(`${BASE_URL}/${id}`);
		return GetWorkerAssignmentResponseSchema.parse(data);
	},

	createWorkerAssignment: async (
		workerAssignment: CreateWorkerAssignmentRequest
	): Promise<CreateWorkerAssignmentResponse> => {
		const { data } = await DYNNAMIX_API.post<CreateWorkerAssignmentResponse>(
			BASE_URL,
			workerAssignment
		);
		return CreateWorkerAssignmentResponseSchema.parse(data);
	},

	updateWorkerAssignment: async (
		id: string,
		workerAssignment: UpdateWorkerAssignmentRequest
	): Promise<UpdateWorkerAssignmentResponse> => {
		const { data } = await DYNNAMIX_API.patch<UpdateWorkerAssignmentResponse>(
			`${BASE_URL}/${id}`,
			workerAssignment
		);
		return UpdateWorkerAssignmentResponseSchema.parse(data);
	},
};
