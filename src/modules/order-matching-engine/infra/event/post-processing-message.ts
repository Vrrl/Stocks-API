import { MatchingEngineEventType } from '../../domain/events/matching-engine-event-type';

export interface PostProcessingMessage {
  type: MatchingEngineEventType;
  payload: any;
}
