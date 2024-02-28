import { z } from 'zod';

export const AnimalStatusEnum = z.enum(['lost', 'sheltered', 'adopted']);

export type AnimalStatusEnum = z.infer<typeof AnimalStatusEnum>;
