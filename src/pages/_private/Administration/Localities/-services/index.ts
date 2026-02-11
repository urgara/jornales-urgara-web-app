import { DYNNAMIX_API } from '@/config';
import type {
  CreateLocalityRequest,
  LocalitiesQueryParams,
  UpdateLocalityRequest,
} from '../-models';
import { GetLocalityResponseSchema, ListLocalitiesResponseSchema } from '../-models';

export const getLocalitiesService = async (params: LocalitiesQueryParams = {}) => {
  const response = await DYNNAMIX_API.get('/localities', { params });
  return ListLocalitiesResponseSchema.parse(response.data);
};

export const getLocalityByIdService = async (id: string) => {
  const response = await DYNNAMIX_API.get(`/localities/${id}`);
  return GetLocalityResponseSchema.parse(response.data);
};

export const createLocalityService = async (data: CreateLocalityRequest) => {
  const response = await DYNNAMIX_API.post('/localities', data);
  return GetLocalityResponseSchema.parse(response.data);
};

export const updateLocalityService = async (id: string, data: UpdateLocalityRequest) => {
  const response = await DYNNAMIX_API.put(`/localities/${id}`, data);
  return GetLocalityResponseSchema.parse(response.data);
};

export const deleteLocalityService = async (id: string) => {
  const response = await DYNNAMIX_API.delete(`/localities/${id}`);
  return response.data;
};
