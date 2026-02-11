import { DYNNAMIX_API } from '@/config';
import type { ListProductsResponse, ProductsQueryParams } from '../-models';
import { ListProductsResponseSchema } from '../-models';

export async function getProducts(params: ProductsQueryParams): Promise<ListProductsResponse> {
  const response = await DYNNAMIX_API.get('/products', { params });
  return ListProductsResponseSchema.parse(response.data);
}
