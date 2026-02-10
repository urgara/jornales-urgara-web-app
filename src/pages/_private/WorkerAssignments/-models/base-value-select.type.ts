import { z } from 'zod/v4';
import { ResponseGenericIncludeDataSchema, WorkerCategorySchema } from '@/models';

const SelectBaseValueCalculatedSchema = z.object({
	workShiftBaseValueId: z.string().uuid(),
	coefficient: z.string(),
	remunerated: z.string(),
	notRemunerated: z.string(),
});

const SelectBaseValueSchema = z.object({
	id: z.string().uuid(),
	remunerated: z.string(),
	notRemunerated: z.string(),
	startDate: z.string(),
	endDate: z.string(),
	category: WorkerCategorySchema,
	workShiftCalculatedValues: z.array(SelectBaseValueCalculatedSchema),
});

const ListSelectBaseValuesSchema = z.array(SelectBaseValueSchema);
const ListSelectBaseValuesResponseSchema =
	ResponseGenericIncludeDataSchema(ListSelectBaseValuesSchema);

interface SelectBaseValueParams {
	date: string;
	category: string;
	localityId?: string;
}

type SelectBaseValue = z.infer<typeof SelectBaseValueSchema>;
type ListSelectBaseValuesResponse = z.infer<typeof ListSelectBaseValuesResponseSchema>;

export { SelectBaseValueSchema, ListSelectBaseValuesResponseSchema };
export type { SelectBaseValue, ListSelectBaseValuesResponse, SelectBaseValueParams };
