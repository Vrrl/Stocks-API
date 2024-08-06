import { MatchingEngineEventType } from '../../domain/events/matching-engine-event-type';
import { PostProcessingMessage } from '../../infra/event/post-processing-message';

export class OrderMutationFailedMessage implements PostProcessingMessage {
  type = MatchingEngineEventType.OrderMutationFailed;
  constructor(public payload: { id: string; reason: FailErrorsType }) {}

  static FailErrors = {
    ORDER_NOT_FOUND: 'The specified order was not found',
  } as const;
}

export type FailErrorsType =
  (typeof OrderMutationFailedMessage.FailErrors)[keyof typeof OrderMutationFailedMessage.FailErrors];
