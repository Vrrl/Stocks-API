import { IEventNotifier } from '../event-notifier';
import { inject, injectable } from 'inversify';
import { v4 as uuid } from 'uuid';
import {
  PublishCommand,
  PublishCommandInput,
  SNSClient,
  PublishBatchCommandInput,
  PublishBatchRequestEntry,
  PublishBatchCommand,
} from '@aws-sdk/client-sns';
import { PostProcessingMessage } from '../post-processing-message';
import TYPES from '../../types';

@injectable()
export class EventNotifier implements IEventNotifier {
  SNS_ORDER_POSTPROCESS_TOPIC: string;

  constructor(@inject(TYPES.SNSClient) private snsClient: SNSClient) {
    this.SNS_ORDER_POSTPROCESS_TOPIC = 'arn:aws:sns:us-east-1:565393064122:MatchingEngineTopic'; // TODO: add env var
  }

  async notifyOrderTopic({ payload, eventType }: PostProcessingMessage): Promise<void> {
    const params: PublishCommandInput = {
      Subject: eventType,
      Message: JSON.stringify(payload),
      TopicArn: this.SNS_ORDER_POSTPROCESS_TOPIC,
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: eventType,
        },
      },
    };

    const command = new PublishCommand(params);
    await this.snsClient.send(command);
  }

  async notifyBatch(eventMessages: PostProcessingMessage[]): Promise<void> {
    const preparedMessages: PublishBatchRequestEntry[] = eventMessages.map(x => ({
      Id: uuid(),
      Subject: x.eventType,
      Message: JSON.stringify(x.payload),
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: x.eventType,
        },
      },
    }));

    const params: PublishBatchCommandInput = {
      PublishBatchRequestEntries: preparedMessages,
      TopicArn: this.SNS_ORDER_POSTPROCESS_TOPIC,
    };

    const command = new PublishBatchCommand(params);
    const test = await this.snsClient.send(command);
    console.log(test);
  }
}
