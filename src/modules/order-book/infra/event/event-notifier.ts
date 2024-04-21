import { EventNames } from '../../dtos/event-names';

export interface IEventNotifier {
  notifyWithBody(eventName: EventNames, body: object): Promise<void>;
}
