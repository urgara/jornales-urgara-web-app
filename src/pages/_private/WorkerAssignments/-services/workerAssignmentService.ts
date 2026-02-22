import { DYNNAMIX_API } from '@/config';
import type {
  CreateWorkerAssignmentRequest,
  CreateWorkerAssignmentResponse,
  ListWorkerAssignmentsResponse,
  UpdateWorkerAssignmentRequest,
  UpdateWorkerAssignmentResponse,
  WorkerAssignmentsQueryParams,
} from '../-models';
import {
  CreateWorkerAssignmentResponseSchema,
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
