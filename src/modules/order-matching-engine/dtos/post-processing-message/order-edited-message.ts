import { MatchingEngineEventType } from '../../domain/events/matching-engine-event-type';
import { OrderExpirationTypeEnum } from '../../domain/order-expiration-type-enum';
import { PostProcessingMessage } from '../../infra/event/post-processing-message';

export class OrderEditedMessage implements PostProcessingMessage {
  eventType = MatchingEngineEventType.OrderEdited;
  constructor(
    public payload: {
      orderId: string;
      unitValue: number;
      shares: number;
      expirationType: OrderExpirationTypeEnum;
      expirationTimestamp: number | null;
    },
  ) {}
}
