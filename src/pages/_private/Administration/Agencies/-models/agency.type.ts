import { z } from 'zod/v4';
import {
  ResponseGenericIncludeDataAndPaginationSchema,
  ResponseGenericIncludeDataSchema,
} from '@/models';

// Agency Schema
const AgencySchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(150, 'El nombre no debe exceder 150 caracteres'),
  createdAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().nullable(),
});

// List Agencies Schema
const ListAgenciesSchema = z.array(AgencySchema);
const ListAgenciesResponseSchema =
  ResponseGenericIncludeDataAndPaginationSchema(ListAgenciesSchema);

// Get Agency Schema
const GetAgencyResponseSchema = ResponseGenericIncludeDataSchema(AgencySchema);

// Create Agency Schema
const CreateAgencyRequestSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(150, 'El nombre no debe exceder 150 caracteres'),
});

const CreateAgencyResponseSchema = ResponseGenericIncludeDataSchema(AgencySchema);

// Update Agency Schema
const UpdateAgencyRequestSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(150, 'El nombre no debe exceder 150 caracteres')
    .optional(),
});

const UpdateAgencyResponseSchema = ResponseGenericIncludeDataSchema(AgencySchema);

type Agency = z.infer<typeof AgencySchema>;
type ListAgenciesResponse = z.infer<typeof ListAgenciesResponseSchema>;
type GetAgencyResponse = z.infer<typeof GetAgencyResponseSchema>;
type CreateAgencyRequest = z.infer<typeof CreateAgencyRequestSchema>;
type CreateAgencyResponse = z.infer<typeof CreateAgencyResponseSchema>;
type UpdateAgencyRequest = z.infer<typeof UpdateAgencyRequestSchema>;
type UpdateAgencyResponse = z.infer<typeof UpdateAgencyResponseSchema>;

export {
  AgencySchema,
  ListAgenciesResponseSchema,
  GetAgencyResponseSchema,
  CreateAgencyRequestSchema,
  CreateAgencyResponseSchema,
  UpdateAgencyRequestSchema,
  UpdateAgencyResponseSchema,
};

export type {
  Agency,
  ListAgenciesResponse,
  GetAgencyResponse,
  CreateAgencyRequest,
  CreateAgencyResponse,
  UpdateAgencyRequest,
  UpdateAgencyResponse,
};
