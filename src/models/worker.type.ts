import { z } from 'zod/v4';
import { ResponseGenericIncludeDataSchema } from './generic-responses.type';

// Select Worker Schema
const SelectWorkerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  surname: z.string(),
  dni: z.string(),
});

const ListSelectWorkersSchema = z.array(SelectWorkerSchema);
const ListSelectWorkersResponseSchema = ResponseGenericIncludeDataSchema(ListSelectWorkersSchema);

type SelectWorker = z.infer<typeof SelectWorkerSchema>;
type ListSelectWorkersResponse = z.infer<typeof ListSelectWorkersResponseSchema>;

export { SelectWorkerSchema, ListSelectWorkersResponseSchema };
export type { SelectWorker, ListSelectWorkersResponse };
