import { MatchingEngineEventType } from '../../domain/events/matching-engine-event-type';
import { Order } from '../../domain/order';
import { PostProcessingMessage } from '../../infra/event/post-processing-message';

export class OrderEditedMessage implements PostProcessingMessage {
  type = MatchingEngineEventType.OrderEdited;
  constructor(public payload: { order: Order }) {}
}
