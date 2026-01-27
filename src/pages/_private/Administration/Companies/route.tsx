import { createFileRoute } from '@tanstack/react-router';
import { CompaniesQueryParamsSchema } from './-models';

export const Route = createFileRoute('/_private/Administration/Companies')({
  validateSearch: (search) => CompaniesQueryParamsSchema.parse(search),
});
