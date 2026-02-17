import { z } from 'zod/v4';
import {
  ResponseGenericIncludeDataAndPaginationSchema,
  ResponseGenericIncludeDataSchema,
} from '@/models';

const ShipSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(50),
  createdAt: z.string(),
  deletedAt: z.string().nullable(),
});

const ListShipsSchema = z.array(ShipSchema);
const ListShipsResponseSchema = ResponseGenericIncludeDataAndPaginationSchema(ListShipsSchema);

const GetShipResponseSchema = ResponseGenericIncludeDataSchema(ShipSchema);

const CreateShipRequestSchemaBase = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no debe exceder 50 caracteres'),
});

const CreateShipRequestSchema = CreateShipRequestSchemaBase;
const CreateShipResponseSchema = ResponseGenericIncludeDataSchema(ShipSchema);

const UpdateShipRequestSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no debe exceder 50 caracteres')
    .optional(),
});

const UpdateShipResponseSchema = ResponseGenericIncludeDataSchema(ShipSchema);

type Ship = z.infer<typeof ShipSchema>;
type ListShipsResponse = z.infer<typeof ListShipsResponseSchema>;
type GetShipResponse = z.infer<typeof GetShipResponseSchema>;
type CreateShipRequest = z.infer<typeof CreateShipRequestSchema>;
type CreateShipResponse = z.infer<typeof CreateShipResponseSchema>;
type UpdateShipRequest = z.infer<typeof UpdateShipRequestSchema>;
type UpdateShipResponse = z.infer<typeof UpdateShipResponseSchema>;

export {
  ShipSchema,
  ListShipsResponseSchema,
  GetShipResponseSchema,
  CreateShipRequestSchemaBase,
  CreateShipRequestSchema,
  CreateShipResponseSchema,
  UpdateShipRequestSchema,
  UpdateShipResponseSchema,
};

export type {
  Ship,
  ListShipsResponse,
  GetShipResponse,
  CreateShipRequest,
  CreateShipResponse,
  UpdateShipRequest,
  UpdateShipResponse,
};
