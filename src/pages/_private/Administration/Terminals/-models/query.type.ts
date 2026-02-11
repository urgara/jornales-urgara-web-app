import { z } from 'zod/v4';
import { GenericQueryParamsSchema } from '@/models';
import { TerminalSchema } from './terminal.type';

const TerminalSortBySchema = z.enum(
  Object.keys(TerminalSchema.shape) as [
    keyof typeof TerminalSchema.shape,
    ...Array<keyof typeof TerminalSchema.shape>,
  ]
);

const TerminalsQueryParamsSchema = GenericQueryParamsSchema(TerminalSortBySchema).extend({
  name: z.string().optional(),
  localityId: z.string().uuid().optional(),
});

type TerminalSortBy = z.infer<typeof TerminalSortBySchema>;
type TerminalsQueryParams = z.infer<typeof TerminalsQueryParamsSchema>;

export { TerminalsQueryParamsSchema, TerminalSortBySchema };
export type { TerminalsQueryParams, TerminalSortBy };
