import { createFileRoute } from '@tanstack/react-router';
import { WorkShiftsQueryParamsSchema } from './-models';

export const Route = createFileRoute('/_private/Administration/WorkShifts')({
  validateSearch: (search) => WorkShiftsQueryParamsSchema.parse(search),
});
