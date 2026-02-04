import { z } from 'zod/v4';
import {
  ResponseGenericIncludeDataSchema,
  ResponseGenericIncludeDataAndPaginationSchema,
} from '@/models';

// Company Schema
const CompanySchema = z.object({
  id: z.string().uuid(),
  name: z
    .string('El nombre es requerido')
    .min(1, 'El nombre no puede estar vacío')
    .max(150, 'El nombre no puede tener más de 150 caracteres'),
  cuit: z.union([z.string().length(11).regex(/^\d+$/), z.null()]).optional().transform((val) => val ?? null),
  createdAt: z.iso.datetime().transform((val) => new Date(val).toLocaleDateString('es-ES')),
  deletedAt: z.iso
    .datetime()
    .nullable()
    .transform((val) => (val ? new Date(val).toLocaleDateString('es-ES') : undefined)),
});

// Schema para select de Company (solo id y name)
const SelectCompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const ListSelectCompaniesSchema = z.array(SelectCompanySchema);
const ListSelectCompaniesResponseSchema = ResponseGenericIncludeDataSchema(ListSelectCompaniesSchema);

// List Companies Schema
const ListCompaniesSchema = z.array(CompanySchema);
const ListCompaniesResponseSchema = ResponseGenericIncludeDataAndPaginationSchema(
  ListCompaniesSchema
);

// Get Company Schema
const GetCompanyResponseSchema = ResponseGenericIncludeDataSchema(CompanySchema);

// Create Company Schema
const CreateCompanyRequestSchema = z.object({
  name: z
    .string('El nombre es requerido')
    .min(1, 'El nombre no puede estar vacío')
    .max(150, 'El nombre no puede tener más de 150 caracteres'),
  cuit: z
    .union([
      z.string().length(11, 'El CUIT debe tener exactamente 11 caracteres').regex(/^\d+$/, 'El CUIT solo puede contener números'),
      z.literal(''),
      z.null(),
    ])
    .optional()
    .transform((val) => (val === '' ? null : val ?? null)),
});

const CreateCompanyResponseSchema = ResponseGenericIncludeDataSchema(CompanySchema);

// Update Company Schema
const UpdateCompanyRequestSchema = CreateCompanyRequestSchema.partial();

const UpdateCompanyResponseSchema = ResponseGenericIncludeDataSchema(CompanySchema);

type Company = z.infer<typeof CompanySchema>;
type SelectCompany = z.infer<typeof SelectCompanySchema>;
type ListSelectCompaniesResponse = z.infer<typeof ListSelectCompaniesResponseSchema>;
type ListCompaniesResponse = z.infer<typeof ListCompaniesResponseSchema>;
type GetCompanyResponse = z.infer<typeof GetCompanyResponseSchema>;
type CreateCompanyRequest = z.infer<typeof CreateCompanyRequestSchema>;
type CreateCompanyResponse = z.infer<typeof CreateCompanyResponseSchema>;
type UpdateCompanyRequest = z.infer<typeof UpdateCompanyRequestSchema>;
type UpdateCompanyResponse = z.infer<typeof UpdateCompanyResponseSchema>;

export {
  CompanySchema,
  ListSelectCompaniesResponseSchema,
  ListCompaniesResponseSchema,
  GetCompanyResponseSchema,
  CreateCompanyRequestSchema,
  CreateCompanyResponseSchema,
  UpdateCompanyRequestSchema,
  UpdateCompanyResponseSchema,
};

export type {
  Company,
  SelectCompany,
  ListSelectCompaniesResponse,
  ListCompaniesResponse,
  GetCompanyResponse,
  CreateCompanyRequest,
  CreateCompanyResponse,
  UpdateCompanyRequest,
  UpdateCompanyResponse,
};
