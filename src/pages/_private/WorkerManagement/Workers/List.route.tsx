import { createFileRoute } from '@tanstack/react-router';
import { WorkersQueryParamsSchema } from './-models';

export const Route = createFileRoute('/_private/WorkerManagement/Workers/List')({
  validateSearch: (search) => WorkersQueryParamsSchema.parse(search),
});
