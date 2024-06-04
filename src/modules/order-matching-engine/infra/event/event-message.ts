import { EventNames } from '../../dtos/event-names';

export interface EventMessage {
  eventName: EventNames;
  body: object;
}
