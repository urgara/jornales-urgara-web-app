import { createFileRoute } from '@tanstack/react-router';
import { WorkShiftsQueryParamsSchema } from './-models';

export const Route = createFileRoute('/_private/WorkerManagement/WorkShift/List')({
  validateSearch: (search) => WorkShiftsQueryParamsSchema.parse(search),
});
