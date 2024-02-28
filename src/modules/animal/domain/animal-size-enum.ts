import { z } from 'zod';

export const AnimalSizeEnum = z.enum(['small', 'medium', 'big']);

export type AnimalSizeEnum = z.infer<typeof AnimalSizeEnum>;
