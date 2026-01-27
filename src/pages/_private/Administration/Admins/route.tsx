import { createFileRoute } from '@tanstack/react-router';
import { AdminsQueryParamsSchema } from './-models';

export const Route = createFileRoute('/_private/Administration/Admins')({
  validateSearch: AdminsQueryParamsSchema,
});
