import { z } from 'zod/v4';
import { DYNNAMIX_API } from '@/config';
import { ResponseGenericIncludeDataSchema } from '@/models';

const SelectTerminalSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
});

const ListSelectTerminalsSchema = z.array(SelectTerminalSchema);
const ListSelectTerminalsResponseSchema = ResponseGenericIncludeDataSchema(ListSelectTerminalsSchema);

type SelectTerminal = z.infer<typeof SelectTerminalSchema>;
type ListSelectTerminalsResponse = z.infer<typeof ListSelectTerminalsResponseSchema>;

export async function getSelectTerminals(localityId: string): Promise<ListSelectTerminalsResponse> {
	const response = await DYNNAMIX_API.get('/terminals/select', {
		params: { localityId },
	});
	return ListSelectTerminalsResponseSchema.parse(response.data);
}

export type { SelectTerminal, ListSelectTerminalsResponse };
