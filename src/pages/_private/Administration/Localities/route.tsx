import { createFileRoute } from '@tanstack/react-router';
import { LocalitiesQueryParamsSchema } from './-models';

export const Route = createFileRoute('/_private/Administration/Localities')({
  validateSearch: LocalitiesQueryParamsSchema,
});
