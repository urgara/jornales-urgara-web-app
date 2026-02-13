import { z } from 'zod/v4';
import { ResponseGenericIncludeDataAndPaginationSchema } from '@/models';

const TerminalSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(50),
});

const ListTerminalsSchema = z.array(TerminalSchema);
const ListTerminalsResponseSchema =
  ResponseGenericIncludeDataAndPaginationSchema(ListTerminalsSchema);

const CreateTerminalRequestSchema = z.object({
  name: z.string().max(50),
});

const UpdateTerminalRequestSchema = TerminalSchema.pick({
  name: true,
}).partial();

type Terminal = z.infer<typeof TerminalSchema>;
type ListTerminalsResponse = z.infer<typeof ListTerminalsResponseSchema>;
type CreateTerminalRequest = z.infer<typeof CreateTerminalRequestSchema>;
type UpdateTerminalRequest = z.infer<typeof UpdateTerminalRequestSchema>;

export {
  TerminalSchema,
  ListTerminalsResponseSchema,
  CreateTerminalRequestSchema,
  UpdateTerminalRequestSchema,
};

export type { Terminal, ListTerminalsResponse, CreateTerminalRequest, UpdateTerminalRequest };
