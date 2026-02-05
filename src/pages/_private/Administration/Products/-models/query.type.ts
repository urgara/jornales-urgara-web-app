import { z } from 'zod/v4';
import { GenericQueryParamsSchema } from '@/models';
import { ProductSchema } from './product.type';

const ProductSortBySchema = z.enum(
	Object.keys(ProductSchema.shape).filter(key =>
		['id', 'name'].includes(key)
	) as [keyof typeof ProductSchema.shape, ...Array<keyof typeof ProductSchema.shape>]
);

const ProductsQueryParamsSchema = GenericQueryParamsSchema(ProductSortBySchema).extend({
	name: z.string().optional(),
	isActive: z.boolean().optional(),
});

type ProductSortBy = z.infer<typeof ProductSortBySchema>;
type ProductsQueryParams = z.infer<typeof ProductsQueryParamsSchema>;

export { ProductSortBySchema, ProductsQueryParamsSchema };
export type { ProductSortBy, ProductsQueryParams };
