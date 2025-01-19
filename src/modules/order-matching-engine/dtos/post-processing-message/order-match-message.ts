import { MatchingEngineEventType } from '../../domain/events/matching-engine-event-type';
import { OrderExpirationTypeEnum } from '../../domain/order-expiration-type-enum';
import { OrderStatusEnum } from '../../domain/order-status-enum';
import { OrderTypeEnum } from '../../domain/order-type-enum';
import { PostProcessingMessage } from '../../infra/event/post-processing-message';

export class OrderMatchMessage implements PostProcessingMessage {
  eventType = MatchingEngineEventType.OrderMatch;
  constructor(
    public payload: {
      id: string;
      type: OrderTypeEnum;
      expirationType: OrderExpirationTypeEnum;
      executedShares: number;
      executedTotalValue: number;
      executedUnitValue: number;
      currentStatus: OrderStatusEnum;
      processedAtTimestamp: number;
      matchedOrderIds: string[];
    },
  ) {}
}
