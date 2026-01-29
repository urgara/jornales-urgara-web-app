import { z } from 'zod/v4';
import { ResponseGenericIncludeDataSchema } from './generic-responses.type';

// Day of Week Enum
const DayOfWeek = z.enum(['M', 'T', 'W', 'Th', 'F', 'S', 'Su']);

// Select Work Shift Schema
const SelectWorkShiftSchema = z.object({
	id: z.string().uuid(),
	days: z.array(DayOfWeek),
	startTime: z.string(),
	endTime: z.string(),
	durationMinutes: z.number().int().positive(),
	description: z.string().nullable(),
	coefficient: z.string(),
	createdAt: z.string(),
	deletedAt: z.string().nullable(),
});

const ListSelectWorkShiftsSchema = z.array(SelectWorkShiftSchema);
const ListSelectWorkShiftsResponseSchema = ResponseGenericIncludeDataSchema(
	ListSelectWorkShiftsSchema
);

type SelectWorkShift = z.infer<typeof SelectWorkShiftSchema>;
type ListSelectWorkShiftsResponse = z.infer<typeof ListSelectWorkShiftsResponseSchema>;

export { SelectWorkShiftSchema, ListSelectWorkShiftsResponseSchema };
export type { SelectWorkShift, ListSelectWorkShiftsResponse };
