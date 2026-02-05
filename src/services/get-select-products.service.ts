import { z } from 'zod/v4';
import { DYNNAMIX_API } from '@/config';
import { ResponseGenericIncludeDataSchema } from '@/models';

const SelectProductSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
});

const ListSelectProductsSchema = z.array(SelectProductSchema);
const ListSelectProductsResponseSchema = ResponseGenericIncludeDataSchema(ListSelectProductsSchema);

type SelectProduct = z.infer<typeof SelectProductSchema>;
type ListSelectProductsResponse = z.infer<typeof ListSelectProductsResponseSchema>;

export async function getSelectProducts(): Promise<ListSelectProductsResponse> {
	const response = await DYNNAMIX_API.get('/products/select');
	return ListSelectProductsResponseSchema.parse(response.data);
}

export type { SelectProduct, ListSelectProductsResponse };
