import { z } from 'zod';

export const AdoptionRequestStatusEnum = z.enum(['awaiting', 'canceled', 'approved', 'denied']);

export type AdoptionRequestStatusEnum = z.infer<typeof AdoptionRequestStatusEnum>;
