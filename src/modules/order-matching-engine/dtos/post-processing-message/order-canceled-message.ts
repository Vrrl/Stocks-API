import { MatchingEngineEventType } from '../../domain/events/matching-engine-event-type';
import { PostProcessingMessage } from '../../infra/event/post-processing-message';

export class OrderCanceledMessage implements PostProcessingMessage {
  type = MatchingEngineEventType.OrderCanceled;
  constructor(
    public payload: {
      orderId: string;
    },
  ) {}
}
