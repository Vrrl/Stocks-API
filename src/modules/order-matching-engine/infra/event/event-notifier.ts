import { EventMessage } from './event-message';

export interface IEventNotifier {
  notifyOrderTopic(eventMessage: EventMessage): Promise<void>;
  notifyBatch(eventMessages: EventMessage[]): Promise<void>;
}
