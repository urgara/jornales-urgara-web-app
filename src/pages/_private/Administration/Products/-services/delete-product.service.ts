import { DYNNAMIX_API } from '@/config';

export async function deleteProduct(id: string) {
  await DYNNAMIX_API.delete(`/products/${id}`);
}
