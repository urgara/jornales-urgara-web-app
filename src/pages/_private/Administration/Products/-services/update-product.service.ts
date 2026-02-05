import { DYNNAMIX_API } from '@/config';
import type { UpdateProductRequest, UpdateProductResponse } from '../-models';
import { UpdateProductResponseSchema } from '../-models';

export async function updateProduct(id: string, data: UpdateProductRequest): Promise<UpdateProductResponse> {
	const response = await DYNNAMIX_API.patch(`/products/${id}`, data);
	return UpdateProductResponseSchema.parse(response.data);
}
