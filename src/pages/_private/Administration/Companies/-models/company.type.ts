import { z } from 'zod/v4';
import {
  ResponseGenericIncludeDataSchema,
  ResponseGenericIncludeDataAndPaginationSchema,
} from '@/models';

// Legal Entity Schema
const LegalEntitySchema = z.object({
  id: z.number(),
  abbreviation: z.string(),
  description: z.string(),
  isActive: z.boolean(),
});

// Schema para select de Legal Entity (solo id, abbreviation y description)
const SelectLegalEntitySchema = z.object({
  id: z.number(),
  abbreviation: z.string(),
  description: z.string(),
});

const ListSelectLegalEntitiesSchema = z.array(SelectLegalEntitySchema);
const ListSelectLegalEntitiesResponseSchema = ResponseGenericIncludeDataSchema(
  ListSelectLegalEntitiesSchema
);

// Company Schema
const CompanySchema = z.object({
  id: z.number(),
  name: z
    .string('El nombre es requerido')
    .min(1, 'El nombre no puede estar vacío')
    .max(150, 'El nombre no puede tener más de 150 caracteres'),
  cuit: z
    .string()
    .length(11, 'El CUIT debe tener exactamente 11 caracteres')
    .regex(/^\d+$/, 'El CUIT solo puede contener números')
    .optional()
    .nullable()
    .transform((val) => val ?? null),
  legalEntityId: z.number('La entidad legal es requerida'),
  createdAt: z.iso.datetime().transform((val) => new Date(val).toLocaleDateString('es-ES')),
  deletedAt: z.iso
    .datetime()
    .nullable()
    .transform((val) => (val ? new Date(val).toLocaleDateString('es-ES') : undefined)),
  LegalEntity: LegalEntitySchema.nullable()
    .optional()
    .transform((val) => val ?? null),
});

// Schema para select de Company (solo id y name)
const SelectCompanySchema = z.object({
  id: z.number(),
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
    .string()
    .length(11, 'El CUIT debe tener exactamente 11 caracteres')
    .regex(/^\d+$/, 'El CUIT solo puede contener números')
    .nullable()
    .optional(),
  legalEntityId: z.number('La entidad legal es requerida'),
});

const CreateCompanyResponseSchema = ResponseGenericIncludeDataSchema(
  CompanySchema.omit({ LegalEntity: true })
);

// Update Company Schema
const UpdateCompanyRequestSchema = CreateCompanyRequestSchema.partial();

const UpdateCompanyResponseSchema = ResponseGenericIncludeDataSchema(
  CompanySchema.omit({ LegalEntity: true })
);

type Company = z.infer<typeof CompanySchema>;
type LegalEntity = z.infer<typeof LegalEntitySchema>;
type SelectLegalEntity = z.infer<typeof SelectLegalEntitySchema>;
type ListSelectLegalEntitiesResponse = z.infer<typeof ListSelectLegalEntitiesResponseSchema>;
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
  LegalEntitySchema,
  ListSelectLegalEntitiesResponseSchema,
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
  LegalEntity,
  SelectLegalEntity,
  ListSelectLegalEntitiesResponse,
  SelectCompany,
  ListSelectCompaniesResponse,
  ListCompaniesResponse,
  GetCompanyResponse,
  CreateCompanyRequest,
  CreateCompanyResponse,
  UpdateCompanyRequest,
  UpdateCompanyResponse,
};
