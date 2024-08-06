import { PostProcessingMessage } from './post-processing-message';

export interface IEventNotifier {
  notifyOrderTopic(eventMessage: PostProcessingMessage): Promise<void>;
  notifyBatch(eventMessages: PostProcessingMessage[]): Promise<void>;
}
