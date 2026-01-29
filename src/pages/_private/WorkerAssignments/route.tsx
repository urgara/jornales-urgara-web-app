import { createFileRoute } from '@tanstack/react-router';
import { WorkerAssignmentsQueryParamsSchema } from './-models';

export const Route = createFileRoute('/_private/WorkerAssignments')({
	validateSearch: (search) => WorkerAssignmentsQueryParamsSchema.parse(search),
});
