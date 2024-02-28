import { z } from 'zod';

export const AnimalTypeEnum = z.enum(['cat', 'dog']);

export type AnimalTypeEnum = z.infer<typeof AnimalTypeEnum>;
