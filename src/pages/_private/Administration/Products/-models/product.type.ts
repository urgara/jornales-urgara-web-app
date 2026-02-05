import { z } from 'zod/v4';
import { ResponseGenericIncludeDataSchema, ResponseGenericIncludeDataAndPaginationSchema } from '@/models';

const ProductSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1).max(40),
	isActive: z.boolean(),
	createdAt: z.iso.datetime(),
	deletedAt: z.iso.datetime().nullable(),
});

const SelectProductSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
});

const ListProductsSchema = z.array(ProductSchema);
const ListProductsResponseSchema = ResponseGenericIncludeDataAndPaginationSchema(ListProductsSchema);

const ListSelectProductsSchema = z.array(SelectProductSchema);
const ListSelectProductsResponseSchema = ResponseGenericIncludeDataSchema(ListSelectProductsSchema);

const GetProductResponseSchema = ResponseGenericIncludeDataSchema(ProductSchema);

// Create Product Schema (sin default para usar con react-hook-form)
const CreateProductRequestSchemaBase = z.object({
	name: z.string().min(1, 'El nombre es requerido').max(40, 'El nombre no debe exceder 40 caracteres'),
	isActive: z.boolean().optional(),
});

// Schema con default para enviar al backend
const CreateProductRequestSchema = CreateProductRequestSchemaBase.transform((val) => ({
	...val,
	isActive: val.isActive ?? true,
}));

const CreateProductResponseSchema = ResponseGenericIncludeDataSchema(ProductSchema);

const UpdateProductRequestSchema = z.object({
	name: z.string().min(1, 'El nombre es requerido').max(40, 'El nombre no debe exceder 40 caracteres').optional(),
	isActive: z.boolean().optional(),
});

const UpdateProductResponseSchema = ResponseGenericIncludeDataSchema(ProductSchema);

type Product = z.infer<typeof ProductSchema>;
type SelectProduct = z.infer<typeof SelectProductSchema>;
type ListProductsResponse = z.infer<typeof ListProductsResponseSchema>;
type ListSelectProductsResponse = z.infer<typeof ListSelectProductsResponseSchema>;
type GetProductResponse = z.infer<typeof GetProductResponseSchema>;
type CreateProductRequest = z.infer<typeof CreateProductRequestSchema>;
type CreateProductResponse = z.infer<typeof CreateProductResponseSchema>;
type UpdateProductRequest = z.infer<typeof UpdateProductRequestSchema>;
type UpdateProductResponse = z.infer<typeof UpdateProductResponseSchema>;

export {
	ProductSchema,
	SelectProductSchema,
	ListProductsResponseSchema,
	ListSelectProductsResponseSchema,
	GetProductResponseSchema,
	CreateProductRequestSchemaBase,
	CreateProductRequestSchema,
	CreateProductResponseSchema,
	UpdateProductRequestSchema,
	UpdateProductResponseSchema,
};

export type {
	Product,
	SelectProduct,
	ListProductsResponse,
	ListSelectProductsResponse,
	GetProductResponse,
	CreateProductRequest,
	CreateProductResponse,
	UpdateProductRequest,
	UpdateProductResponse,
};
