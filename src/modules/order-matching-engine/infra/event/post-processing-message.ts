import { MatchingEngineEventType } from '../../domain/events/matching-engine-event-type';

export interface PostProcessingMessage {
  eventType: MatchingEngineEventType;
  payload: any;
}
