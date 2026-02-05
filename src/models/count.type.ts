import { z } from 'zod/v4';
import { ResponseGenericIncludeDataSchema } from './generic-responses.type';

// Count Data Schema
const CountDataSchema = z.object({
	total: z.number().int().nonnegative(),
});

// Count Response Schema
const CountResponseSchema = ResponseGenericIncludeDataSchema(CountDataSchema);

type CountData = z.infer<typeof CountDataSchema>;
type CountResponse = z.infer<typeof CountResponseSchema>;

export { CountResponseSchema, CountDataSchema };
export type { CountResponse, CountData };
