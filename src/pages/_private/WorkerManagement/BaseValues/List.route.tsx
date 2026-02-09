import { createFileRoute } from '@tanstack/react-router';
import { WorkShiftBaseValuesQueryParamsSchema } from './-models';

export const Route = createFileRoute('/_private/WorkerManagement/BaseValues/List')({
  validateSearch: (search) => WorkShiftBaseValuesQueryParamsSchema.parse(search),
});
