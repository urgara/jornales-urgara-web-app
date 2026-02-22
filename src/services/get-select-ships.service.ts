import { z } from 'zod/v4';
import { DYNNAMIX_API } from '@/config';
import { ResponseGenericIncludeDataSchema } from '@/models';

const SelectShipSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const ListSelectShipsSchema = z.array(SelectShipSchema);
const ListSelectShipsResponseSchema = ResponseGenericIncludeDataSchema(ListSelectShipsSchema);

type SelectShip = z.infer<typeof SelectShipSchema>;
type ListSelectShipsResponse = z.infer<typeof ListSelectShipsResponseSchema>;

export async function getSelectShips(): Promise<ListSelectShipsResponse> {
  const response = await DYNNAMIX_API.get('/ships/select');
  return ListSelectShipsResponseSchema.parse(response.data);
}

export type { SelectShip, ListSelectShipsResponse };
