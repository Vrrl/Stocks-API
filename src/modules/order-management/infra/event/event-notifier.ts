import { EventNames } from '../../domain/event-names';

export interface IEventNotifier {
  notifyWithBody(eventName: EventNames, body: object): Promise<void>;
}
