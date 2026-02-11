import { DYNNAMIX_API } from '@/config';
import type { CreateProductRequest, CreateProductResponse } from '../-models';
import { CreateProductResponseSchema } from '../-models';

export async function createProduct(data: CreateProductRequest): Promise<CreateProductResponse> {
  const response = await DYNNAMIX_API.post('/products', data);
  return CreateProductResponseSchema.parse(response.data);
}
