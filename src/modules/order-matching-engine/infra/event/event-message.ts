import { MatchingEngineEventNames } from '../../domain/events/matching-engine-event-names';

export interface EventMessage {
  eventName: MatchingEngineEventNames;
  body: object;
}
