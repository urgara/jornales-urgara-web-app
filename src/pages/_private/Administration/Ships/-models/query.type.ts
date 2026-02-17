import { z } from 'zod/v4';
import { GenericQueryParamsSchema } from '@/models';
import { ShipSchema } from './ship.type';

const ShipSortBySchema = z.enum(
  Object.keys(ShipSchema.shape).filter((key) => ['id', 'name', 'createdAt'].includes(key)) as [
    keyof typeof ShipSchema.shape,
    ...Array<keyof typeof ShipSchema.shape>,
  ]
);

const ShipsQueryParamsSchema = GenericQueryParamsSchema(ShipSortBySchema).extend({
  name: z.string().optional(),
});

type ShipSortBy = z.infer<typeof ShipSortBySchema>;
type ShipsQueryParams = z.infer<typeof ShipsQueryParamsSchema>;

export { ShipSortBySchema, ShipsQueryParamsSchema };
export type { ShipSortBy, ShipsQueryParams };
